/**
 * Демонстрационный файл использования SimpleValidator
 * Показывает реальный пример интеграции библиотеки в проект
 * @file test-demo.ts
 */
import SimpleValidator from './main.ts';

const form = document.getElementById('test-form') as HTMLFormElement;
const validateBtn = document.getElementById('validate-btn');
const resetBtn = document.getElementById('reset-btn');

/**
 * Основная логика демо-приложения
 * Инициализирует валидатор и настраивает обработчики событий
 */
if (form && validateBtn && resetBtn) {
    const validator = new SimpleValidator(form);

    /**
     * Добавление правил валидации для поля username
     * - Обязательное поле
     * - Минимум 3 символа
     */
    validator.addField('username', {
        required: true,
        minLength: 3
    });

    /**
     * Добавление правил валидации для поля email
     * - Проверка формата email
     */
    validator.addField('email', {
        email: true
    });
    
    /**
     * Добавление правил валидации для поля password
     * - Обязательное поле
     * - Минимум 6 символов
     */
    validator.addField('password', {
        required: true,
        minLength: 6
    });

    /**
     * Обработчик клика по кнопке валидации
     * Выполняет валидацию и логирует результат
     */
    validateBtn.addEventListener('click', () => {
        const result = validator.validate();
        console.log(result);
    });
        /**
     * Обработчик клика по кнопке сброса
     * Очищает значения формы
     */
    resetBtn.addEventListener('click', () => {
        form.reset();
    });
}