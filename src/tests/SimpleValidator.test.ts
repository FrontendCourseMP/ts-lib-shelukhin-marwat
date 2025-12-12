import { describe, it, expect, beforeEach } from 'vitest'
import SimpleValidator from '../main.ts'

describe('SimpleValidator', () => {
  let form: HTMLFormElement
  let validator: SimpleValidator

  beforeEach(() => {
    // Setup DOM for each test
    document.body.innerHTML = `
      <form id="test-form">
        <input type="text" name="username" />
        <input type="email" name="email" />
        <input type="password" name="password" />
        <div data-error-for="username" class="error"></div>
        <div data-error-for="email" class="error"></div>
        <div data-error-for="password" class="error"></div>
      </form>
    `
    
    form = document.getElementById('test-form') as HTMLFormElement
    validator = new SimpleValidator(form)
  })

  describe('constructor and addField', () => {
    it('should create validator with form element', () => {
      expect(validator.form).toBe(form)
      expect(validator.fields.size).toBe(0)
    })

    it('should add field rules', () => {
      validator.addField('username', { required: true, minLength: 3 })
      expect(validator.fields.get('username')).toEqual({ required: true, minLength: 3 })
    })

    it('should add multiple fields', () => {
      validator.addField('username', { required: true })
      validator.addField('email', { email: true })
      expect(validator.fields.size).toBe(2)
    })
  })

  describe('validateField (private method testing via public validate)', () => {
    it('should validate required field - empty', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = ''
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Это поле обязательно')
    })

    it('should validate required field - filled', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = 'John'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should validate minLength - too short', () => {
      validator.addField('username', { minLength: 5 })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = 'abc'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Минимум 5 символов')
    })

    it('should validate minLength - valid', () => {
      validator.addField('username', { minLength: 3 })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = 'abcde'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })

    it('should validate email - invalid', () => {
      validator.addField('email', { email: true })
      const input = form.elements.namedItem('email') as HTMLInputElement
      input.value = 'invalid-email'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.email).toContain('Введите корректный email')
    })

    it('should validate email - valid', () => {
      validator.addField('email', { email: true })
      const input = form.elements.namedItem('email') as HTMLInputElement
      input.value = 'test@example.com'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })

    it('should validate email - empty (no error when not required)', () => {
      validator.addField('email', { email: true })
      const input = form.elements.namedItem('email') as HTMLInputElement
      input.value = ''
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })

    it('should validate multiple rules together', () => {
      validator.addField('username', { required: true, minLength: 3 })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = 'ab' // Too short
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Это поле обязательно')
      expect(result.errors.username).toContain('Минимум 3 символов')
    })

    it('should trim whitespace before validation', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = '   ' // Only spaces
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Это поле обязательно')
    })
  })

  describe('showError and clearError (DOM interactions)', () => {
    it('should display error in DOM when validation fails', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = ''
      
      validator.validate()
      
      const errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('Это поле обязательно')
    })

    it('should display multiple errors joined by comma', () => {
      validator.addField('username', { required: true, minLength: 5 })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = 'ab'
      
      validator.validate()
      
      const errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('Это поле обязательно, Минимум 5 символов')
    })

    it('should clear error when validation passes', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username') as HTMLInputElement
      
      // First with error
      input.value = ''
      validator.validate()
      let errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('Это поле обязательно')
      
      // Then fix it
      input.value = 'John'
      validator.validate()
      errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('')
    })

    it('should handle missing error container gracefully', () => {
      // Remove error container
      const container = form.querySelector('[data-error-for="username"]')
      container?.remove()
      
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username') as HTMLInputElement
      input.value = ''
      
      // Should not throw error
      expect(() => validator.validate()).not.toThrow()
    })
  })

  describe('validate() method', () => {
    it('should return valid result when all fields pass', () => {
      validator.addField('username', { required: true })
      validator.addField('email', { email: true })
      
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      const emailInput = form.elements.namedItem('email') as HTMLInputElement
      
      usernameInput.value = 'JohnDoe'
      emailInput.value = 'john@example.com'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return invalid result with errors when validation fails', () => {
      validator.addField('username', { required: true, minLength: 5 })
      validator.addField('email', { email: true })
      
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      const emailInput = form.elements.namedItem('email') as HTMLInputElement
      
      usernameInput.value = 'ab'
      emailInput.value = 'invalid-email'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toHaveLength(2)
      expect(result.errors.email).toContain('Введите корректный email')
    })

    it('should skip non-existent fields', () => {
      validator.addField('nonexistent', { required: true })
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true) // Field doesn't exist, so no validation
      expect(result.errors).toEqual({})
    })

    it('should validate only fields with rules', () => {
      // Don't add rules for email field
      validator.addField('username', { required: true })
      
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      const emailInput = form.elements.namedItem('email') as HTMLInputElement
      
      usernameInput.value = 'John'
      emailInput.value = '' // Should be ignored
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })
  })
})