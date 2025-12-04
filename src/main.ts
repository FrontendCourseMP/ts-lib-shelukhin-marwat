import type { 
    SimpleValidatorInstance, 
    FieldRules, 
    ValidationResult 
} from './types/index.d.ts';

class SimpleValidator implements SimpleValidatorInstance {
    public form: HTMLFormElement;
    public fields: Map<string, FieldRules> = new Map();

    constructor(form: HTMLFormElement) {
        this.form = form;
    }

    addField(name: string, rules: FieldRules): void {
        this.fields.set(name, rules);
    }

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

    private showError(fieldName: string, errors: string[]): void {
        const errorContainer = this.form.querySelector(`[data-error-for="${fieldName}"]`);
        if (errorContainer) {
            errorContainer.textContent = errors.join(', ');
        }
    }

    private clearError(fieldName: string): void {
        const errorContainer = this.form.querySelector(`[data-error-for="${fieldName}"]`);
        if (errorContainer) {
            errorContainer.textContent = '';
        }
    }
}

export default SimpleValidator;