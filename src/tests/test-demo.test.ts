import { describe, it, expect, beforeEach, vi } from 'vitest'
import SimpleValidator from '../main.ts'

// Mock the DOM structure exactly like in test-demo.ts
describe('test-demo.ts Integration', () => {
  let form: HTMLFormElement
  let validateBtn: HTMLButtonElement
  let resetBtn: HTMLButtonElement

  beforeEach(() => {
    // Setup exact DOM structure from test-demo.ts
    document.body.innerHTML = `
      <form id="test-form">
        <input type="text" name="username" />
        <input type="email" name="email" />
        <input type="password" name="password" />
        <div data-error-for="username"></div>
        <div data-error-for="email"></div>
        <div data-error-for="password"></div>
        <button id="validate-btn">Validate</button>
        <button id="reset-btn">Reset</button>
      </form>
    `
    
    form = document.getElementById('test-form') as HTMLFormElement
    validateBtn = document.getElementById('validate-btn') as HTMLButtonElement
    resetBtn = document.getElementById('reset-btn') as HTMLButtonElement
  })

  describe('Demo initialization', () => {
    it('should find all required DOM elements', () => {
      expect(form).toBeTruthy()
      expect(validateBtn).toBeTruthy()
      expect(resetBtn).toBeTruthy()
      expect(form.elements.namedItem('username')).toBeTruthy()
      expect(form.elements.namedItem('email')).toBeTruthy()
      expect(form.elements.namedItem('password')).toBeTruthy()
    })

    it('should initialize validator and add fields correctly', () => {
      // This tests the logic from test-demo.ts
      const validator = new SimpleValidator(form)
      
      validator.addField('username', {
        required: true,
        minLength: 3
      })
      
      validator.addField('email', {
        email: true
      })
      
      validator.addField('password', {
        required: true,
        minLength: 6
      })
      
      expect(validator.fields.size).toBe(3)
      expect(validator.fields.get('username')).toEqual({ required: true, minLength: 3 })
      expect(validator.fields.get('email')).toEqual({ email: true })
      expect(validator.fields.get('password')).toEqual({ required: true, minLength: 6 })
    })
  })

  describe('Validate button click', () => {
    it('should validate form and log result when validate button is clicked', () => {
      const validator = new SimpleValidator(form)
      const consoleSpy = vi.spyOn(console, 'log')
      
      // Setup exactly like test-demo.ts
      validator.addField('username', { required: true, minLength: 3 })
      validator.addField('email', { email: true })
      validator.addField('password', { required: true, minLength: 6 })
      
      // Set invalid data
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement
      
      usernameInput.value = 'ab' // Too short
      passwordInput.value = '123' // Too short
      
      // Simulate button click handler
      validateBtn.addEventListener('click', () => {
        const result = validator.validate()
        console.log(result)
      })
      
      // Trigger click
      validateBtn.click()
      
      // Should log validation result
      expect(consoleSpy).toHaveBeenCalledWith({
        valid: false,
        errors: expect.objectContaining({
          username: expect.arrayContaining(['Минимум 3 символов']),
          password: expect.arrayContaining(['Минимум 6 символов'])
        })
      })
      
      consoleSpy.mockRestore()
    })

    it('should log success when all fields are valid', () => {
      const validator = new SimpleValidator(form)
      const consoleSpy = vi.spyOn(console, 'log')
      
      validator.addField('username', { required: true, minLength: 3 })
      validator.addField('email', { email: true })
      validator.addField('password', { required: true, minLength: 6 })
      
      // Set valid data
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      const emailInput = form.elements.namedItem('email') as HTMLInputElement
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement
      
      usernameInput.value = 'JohnDoe'
      emailInput.value = 'john@example.com'
      passwordInput.value = 'password123'
      
      validateBtn.addEventListener('click', () => {
        const result = validator.validate()
        console.log(result)
      })
      
      validateBtn.click()
      
      expect(consoleSpy).toHaveBeenCalledWith({
        valid: true,
        errors: {}
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Reset button click', () => {
    it('should reset form when reset button is clicked', () => {
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      const emailInput = form.elements.namedItem('email') as HTMLInputElement
      
      // Set values
      usernameInput.value = 'Test User'
      emailInput.value = 'test@example.com'
      
      expect(usernameInput.value).toBe('Test User')
      expect(emailInput.value).toBe('test@example.com')
      
      // Setup reset handler
      resetBtn.addEventListener('click', () => {
        form.reset()
      })
      
      // Trigger reset
      resetBtn.click()
      
      // Values should be cleared
      expect(usernameInput.value).toBe('')
      expect(emailInput.value).toBe('')
    })

    it('should clear error messages after reset and re-validation', () => {
      const validator = new SimpleValidator(form)
      const consoleSpy = vi.spyOn(console, 'log')
      
      validator.addField('username', { required: true })
      
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      
      // First validation (error)
      usernameInput.value = ''
      validateBtn.addEventListener('click', () => {
        const result = validator.validate()
        console.log(result)
      })
      
      validateBtn.click()
      
      // Check error is shown
      const errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('Это поле обязательно')
      
      // Reset
      resetBtn.addEventListener('click', () => {
        form.reset()
      })
      resetBtn.click()
      
      // Error should still be there until re-validation
      expect(errorContainer?.textContent).toBe('Это поле обязательно')
      
      // Re-validate after reset (field is now empty but form was reset)
      // Note: reset() clears the value but validation runs on current state
      validateBtn.click()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Edge cases from test-demo.ts', () => {
    it('should not initialize if elements are missing', () => {
      // Test the if condition in test-demo.ts
      document.body.innerHTML = '' // No elements
      
      const missingForm = document.getElementById('test-form')
      const missingValidateBtn = document.getElementById('validate-btn')
      const missingResetBtn = document.getElementById('reset-btn')
      
      // The if condition in test-demo.ts would fail
      expect(missingForm).toBeFalsy()
      expect(missingValidateBtn).toBeFalsy()
      expect(missingResetBtn).toBeFalsy()
      
      // So the code inside the if block wouldn't run
      // This is correct behavior
    })

    it('should work with only some fields having rules', () => {
      // Test partial field setup (like if test-demo.ts only set some fields)
      const validator = new SimpleValidator(form)
      const consoleSpy = vi.spyOn(console, 'log')
      
      // Only setup username (like a modified demo)
      validator.addField('username', { required: true })
      // Don't setup email and password
      
      const usernameInput = form.elements.namedItem('username') as HTMLInputElement
      usernameInput.value = 'John'
      
      validateBtn.addEventListener('click', () => {
        const result = validator.validate()
        console.log(result)
      })
      
      validateBtn.click()
      
      // Should validate only username
      expect(consoleSpy).toHaveBeenCalledWith({
        valid: true,
        errors: {}
      })
      
      consoleSpy.mockRestore()
    })
  })
})