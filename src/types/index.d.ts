export type SimpleValidatorInit = HTMLFormElement

export interface FieldRules {
    required?: boolean
    minLength?: number
    email?: boolean
}

export interface ValidationResult {
    valid: boolean
    errors: Record<string, string[]>
}

export interface AddFieldFunction {
    (fieldName: string, rules: FieldRules): void
}

export interface ValidateFunction {
    (): ValidationResult
}

export interface SimpleValidatorInstance {
    form: HTMLFormElement 
    fields: Map<string, FieldRules>
    addField: AddFieldFunction
    validate: ValidateFunction
}

export interface SimpleValidatorConstructor {
    new (form: HTMLFormElement): SimpleValidatorInstance 
}

export declare const SimpleValidator: SimpleValidatorConstructor