import type { 
    SimpleValidatorInstance, 
    FieldRules, 
    ValidationResult 
} from './types/index.d.ts';

/**
 * Основной класс SimpleValidator для валидации HTML-форм
 * Предоставляет API для добавления правил валидации и проверки полей формы
 * @class SimpleValidator
 * @implements {SimpleValidatorInstance}
 */

class SimpleValidator implements SimpleValidatorInstance {
    public form: HTMLFormElement;
    public fields: Map<string, FieldRules> = new Map();

    /**
     * Создает экземпляр SimpleValidator
     * @constructor
     * @param {HTMLFormElement} form - HTML форма для валидации
     */

    constructor(form: HTMLFormElement) {
        this.form = form;
    }

    /**
     * Добавляет правила валидации для поля формы
     * @param {string} name - Имя поля формы (атрибут name)
     * @param {FieldRules} rules - Объект с правилами валидации
     * @returns {void}
     */

    addField(name: string, rules: FieldRules): void {
        this.fields.set(name, rules);
    }

    /**
     * Выполняет валидацию всех добавленных полей формы
     * @returns {ValidationResult} Результат валидации с ошибками
     */

    validate(): ValidationResult {
        const errors: Record<string, string[]> = {};
        let isValid = true;

        for (const [fieldName, rules] of this.fields) {
            const field = this.form.elements.namedItem(fieldName) as HTMLInputElement;
            if (!field) continue;

            const fieldErrors = this.validateField(field, rules);
            
            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
                isValid = false;
                this.showError(fieldName, fieldErrors);
            } else {
                this.clearError(fieldName);
            }
        }

        return { valid: isValid, errors };
    }

    /**
     * Валидирует одно поле формы по заданным правилам
     * @private
     * @param {HTMLInputElement} field - HTML элемент поля
     * @param {FieldRules} rules - Правила валидации
     * @returns {string[]} Массив сообщений об ошибках
     */

    private validateField(field: HTMLInputElement, rules: FieldRules): string[] {
        const errors: string[] = [];
        const value = field.value.trim();

        if (rules.required && !value) {
            errors.push('Это поле обязательно');
        }

        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Минимум ${rules.minLength} символов`);
        }

        if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors.push('Введите корректный email');
            }
        }

        return errors;
    }

    /**
     * Отображает сообщения об ошибках в DOM
     * @private
     * @param {string} fieldName - Имя поля с ошибкой
     * @param {string[]} errors - Массив сообщений об ошибках
     * @returns {void}
     */

    private showError(fieldName: string, errors: string[]): void {
        const errorContainer = this.form.querySelector(`[data-error-for="${fieldName}"]`);
        if (errorContainer) {
            errorContainer.textContent = errors.join(', ');
        }
    }
    
    /**
     * Очищает сообщения об ошибках в DOM
     * @private
     * @param {string} fieldName - Имя поля для очистки
     * @returns {void}
     */

    private clearError(fieldName: string): void {
        const errorContainer = this.form.querySelector(`[data-error-for="${fieldName}"]`);
        if (errorContainer) {
            errorContainer.textContent = '';
        }
    }
}

export default SimpleValidator;