/**
 * TypeScript определения типов для SimpleValidator
 * Описывает интерфейсы и типы, используемые в библиотеке
 * @module types
 */

/**
 * Инициализационный тип для SimpleValidator
 * @typedef {HTMLFormElement} SimpleValidatorInit
 */
export type SimpleValidatorInit = HTMLFormElement

/**
 * Правила валидации для поля формы
 * @interface FieldRules
 * @property {boolean} [required] - Обязательное поле
 * @property {number} [minLength] - Минимальная длина значения
 * @property {boolean} [email] - Проверка формата email
 */
export interface FieldRules {
    required?: boolean
    minLength?: number
    email?: boolean
}

/**
 * Результат валидации формы
 * @interface ValidationResult
 * @property {boolean} valid - Общий статус валидности формы
 * @property {Record<string, string[]>} errors - Ошибки по именам полей
 */
export interface ValidationResult {
    valid: boolean
    errors: Record<string, string[]>
}

/**
 * Функция добавления поля для валидации
 * @interface AddFieldFunction
 * @param {string} fieldName - Имя поля формы
 * @param {FieldRules} rules - Правила валидации
 */
export interface AddFieldFunction {
    (fieldName: string, rules: FieldRules): void
}

/**
 * Функция выполнения валидации
 * @interface ValidateFunction
 * @returns {ValidationResult} Результат валидации
 */
export interface ValidateFunction {
    (): ValidationResult
}

/**
 * Экземпляр SimpleValidator
 * @interface SimpleValidatorInstance
 * @property {HTMLFormElement} form - HTML форма
 * @property {Map<string, FieldRules>} fields - Коллекция правил валидации
 * @property {AddFieldFunction} addField - Метод добавления поля
 * @property {ValidateFunction} validate - Метод валидации
 */
export interface SimpleValidatorInstance {
    form: HTMLFormElement 
    fields: Map<string, FieldRules>
    addField: AddFieldFunction
    validate: ValidateFunction
}

/**
 * Конструктор SimpleValidator
 * @interface SimpleValidatorConstructor
 * @param {HTMLFormElement} form - HTML форма
 * @returns {SimpleValidatorInstance} Экземпляр валидатора
 */
export interface SimpleValidatorConstructor {
    new (form: HTMLFormElement): SimpleValidatorInstance 
}

/**
 * Основной экспорт SimpleValidator
 * @declare
 * @type {SimpleValidatorConstructor}
 */
export declare const SimpleValidator: SimpleValidatorConstructor