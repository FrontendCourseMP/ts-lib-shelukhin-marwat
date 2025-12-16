import { describe, it, expect, beforeEach } from 'vitest'
import SimpleValidator from '../main.js'

/**
 * Юнит-тесты для класса SimpleValidator
 * Проверяет основные функции валидации и работу с DOM
 * @test {SimpleValidator}
 */

describe('SimpleValidator', () => {
  let form
  let validator
  
    /**
     * Настройка тестового окружения перед каждым тестом
     * Создает тестовую форму и экземпляр валидатора
     */
  beforeEach(() => {
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
    
    form = document.getElementById('test-form')
    validator = new SimpleValidator(form)
  })
    /**
     * Тестирование конструктора и метода addField
     * Проверяет инициализацию и добавление правил валидации
    */
  describe('constructor and addField', () => {

    /**
    * Проверяет создание валидатора с формой
    * @test
    */
    it('should create validator with form element', () => {
      expect(validator.form).toBe(form)
      expect(validator.fields.size).toBe(0)
    })

    /**
    * Проверяет добавление правил валидации для поля
    * @test
    */
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

  /**
   * Тестирование валидации полей формы
   * Проверяет различные сценарии валидации через метод validate()
   */
  describe('validateField (private method testing via public validate)', () => {
    /**
     * Проверяет валидацию обязательного поля при пустом значении
     * @test
     */
    it('should validate required field - empty', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username')
      input.value = ''
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Это поле обязательно')
    })

    /**
     * Проверяет валидацию обязательного поля при заполненном значении
     * @test
     */
    it('should validate required field - filled', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username')
      input.value = 'John'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    /**
     * Проверяет валидацию минимальной длины при слишком коротком значении
     * @test
     */
    it('should validate minLength - too short', () => {
      validator.addField('username', { minLength: 5 })
      const input = form.elements.namedItem('username')
      input.value = 'abc'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Минимум 5 символов')
    })

    it('should validate minLength - valid', () => {
      validator.addField('username', { minLength: 3 })
      const input = form.elements.namedItem('username')
      input.value = 'abcde'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })

    it('should validate email - invalid', () => {
      validator.addField('email', { email: true })
      const input = form.elements.namedItem('email')
      input.value = 'invalid-email'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.email).toContain('Введите корректный email')
    })

    it('should validate email - valid', () => {
      validator.addField('email', { email: true })
      const input = form.elements.namedItem('email')
      input.value = 'test@example.com'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })

    it('should validate email - empty (no error when not required)', () => {
      validator.addField('email', { email: true })
      const input = form.elements.namedItem('email')
      input.value = ''
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })

    it('should validate multiple rules together', () => {
      validator.addField('username', { required: true, minLength: 3 })
      const input = form.elements.namedItem('username')
      input.value = '' // EMPTY string - triggers both rules
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Это поле обязательно')
      expect(result.errors.username).toContain('Минимум 3 символов')
    })

    it('should trim whitespace before validation', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username')
      input.value = '   ' // Only spaces
      
      const result = validator.validate()
      
      expect(result.valid).toBe(false)
      expect(result.errors.username).toContain('Это поле обязательно')
    })
  })

  /**
   * Тестирование отображения ошибок в DOM
   * Проверяет методы showError и clearError
   */
  describe('showError and clearError (DOM interactions)', () => {
    /**
     * Проверяет отображение ошибок в DOM при неудачной валидации
     * @test
     */
    it('should display error in DOM when validation fails', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username')
      input.value = ''
      
      validator.validate()
      
      const errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('Это поле обязательно')
    })
    
    /**
     * Проверяет очистку ошибок в DOM при успешной валидации
     * @test
     */
    it('should display multiple errors joined by comma', () => {
      validator.addField('username', { required: true, minLength: 5 })
      const input = form.elements.namedItem('username')
      input.value = '' // EMPTY string - triggers both errors
      
      validator.validate()
      
      const errorContainer = form.querySelector('[data-error-for="username"]')
      expect(errorContainer?.textContent).toBe('Это поле обязательно, Минимум 5 символов')
    })

    it('should clear error when validation passes', () => {
      validator.addField('username', { required: true })
      const input = form.elements.namedItem('username')
      
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
      const input = form.elements.namedItem('username')
      input.value = ''
      
      // Should not throw error
      expect(() => validator.validate()).not.toThrow()
    })
  })

  describe('validate() method', () => {
    it('should return valid result when all fields pass', () => {
      validator.addField('username', { required: true })
      validator.addField('email', { email: true })
      
      const usernameInput = form.elements.namedItem('username')
      const emailInput = form.elements.namedItem('email')
      
      usernameInput.value = 'JohnDoe'
      emailInput.value = 'john@example.com'
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return invalid result with errors when validation fails', () => {
      validator.addField('username', { required: true, minLength: 5 })
      validator.addField('email', { email: true })
      
      const usernameInput = form.elements.namedItem('username')
      const emailInput = form.elements.namedItem('email')
      
      usernameInput.value = '' // EMPTY - triggers both required and minLength
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
      
      const usernameInput = form.elements.namedItem('username')
      const emailInput = form.elements.namedItem('email')
      
      usernameInput.value = 'John'
      emailInput.value = '' // Should be ignored
      
      const result = validator.validate()
      
      expect(result.valid).toBe(true)
    })
  })
})