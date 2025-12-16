# Документация по вашему решению
## Команда: shelukhin-marwat

## shemi52-Шелухин Михаил
## Morwat Mohmand - Мохманд Марват

# SimpleValidator - Библиотека валидации HTML-форм

**SimpleValidator** — это легкая и удобная библиотека для валидации HTML-форм, написанная на TypeScript. Библиотека предоставляет простой API для добавления правил валидации к полям формы с автоматическим отображением ошибок.

- **Полная поддержка TypeScript** — строгая типизация и автодополнение
- **Простой API** — минимальный набор методов для быстрого старта
- **Гибкая валидация** — поддержка основных правил валидации
- **Интеграция с DOM** — автоматическое отображение ошибок
- **Расширяемая архитектура** — легко добавить новые правила
- **Комплексное тестирование** — 81 тест с полным покрытием

## Быстрый старт

### HTML
```html
<form id="test-form" novalidate>
    <div>
        <label>Имя пользователя *</label><br>
        <input type="text" name="username">
        <p data-error-for="username"></p>
    </div>

    <div>
        <label>Email</label><br>
        <input type="email" name="email">
        <p data-error-for="email"></p>
    </div>

    <div>
        <label>Пароль *</label><br>
        <input type="password" name="password">
        <p data-error-for="password"></p>
    </div>

    <div>
        <button type="button" id="validate-btn">Проверить форму</button>
        <button type="button" id="reset-btn">Сбросить</button>
    </div>
</form>

<script type="module" src="/src/test-demo.ts"></script>
```
## TypeScript (test-demo.ts)
```typescript
import SimpleValidator from './main.ts';

const form = document.getElementById('test-form') as HTMLFormElement;
const validateBtn = document.getElementById('validate-btn');
const resetBtn = document.getElementById('reset-btn');

if (form && validateBtn && resetBtn) {
    const validator = new SimpleValidator(form);
    
    validator.addField('username', {
        required: true,
        minLength: 3
    });
    
    validator.addField('email', {
        email: true
    });
    
    validator.addField('password', {
        required: true,
        minLength: 6
    });
    
    validateBtn.addEventListener('click', () => {
        const result = validator.validate();
        console.log(result);
    });
    
    resetBtn.addEventListener('click', () => {
        form.reset();
    });
}
```

## API документация

### Класс SimpleValidator
```typescript
new SimpleValidator(form: HTMLFormElement)
```

### Основные валидаторы

| Валидатор | Описание | Пример использования |
|-----------|----------|---------------------|
| `required` | Обязательное поле | `{ required: true}` |
| `email` | Валидация email | `{ email: 'true' }` |
| `minLength` | Валидация длинны | `{ minLength: 5 }` |


### Интерфейсы 
#### FieldRules
```typescript
interface FieldRules {
    required?: boolean;   // Обязательное поле
    minLength?: number;   // Минимальная длина
    email?: boolean;      // Проверка email формата
};
```

#### ValidationResult
```typescript
interface ValidationResult {
    valid: boolean;
    errors: Record<string, string[]>;
};
```
## Конфигурация

### Правила валидации

```typescript
const validator = new SimpleValidator(form);

// Для каждого поля задаются правила напрямую
validator.addField('username', {
    required: true,
    minLength: 3
});

validator.addField('email', {
    email: true
});

validator.addField('password', {
    required: true,
    minLength: 8
});
```

### Отображения ошибок

```typescript
private showError(fieldName: string, errors: string[]): void {
    const errorContainer = this.form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorContainer) {
        errorContainer.textContent = errors.join(', ');
    }
};
```
## Тестирование

Проект включает комплексный набор тестов, написанных с использованием **Vitest** и **jsdom**.

### Запуск тестов

```bash
# Установка зависимостей
npm install

# Запуск всех тестов
npm test

# Запуск тестов в режиме наблюдения
npm test -- --watch

# Запуск с подробным выводом
npm test -- --reporter=verbose
```

### Структура тестов

- **`src/tests/SimpleValidator.test.js`** - Тесты всех функций валидации (20 теста)
- **`src/tests/test-demo.test.js`** - Интеграционных тестов (8 тестов)

Всего: **28 тестов.**

### Пример теста

```typescript
describe('test-demo.ts Integration', () => {
  it('should initialize validator and add fields correctly', () => {
    const validator = new SimpleValidator(form)
    
    validator.addField('username', {
      required: true,
      minLength: 3
    })
    
    validator.addField('email', {
      email: true
    })
    
    expect(validator.fields.size).toBe(2)
    expect(validator.fields.get('username')).toEqual({ required: true, minLength: 3 })
    expect(validator.fields.get('email')).toEqual({ email: true })
  })
};);
```

## Структура проекта

```
src/
├── main.ts
│   
├── main.ts
│  
├── types/
│   ├── index.d.ts        # TypeScript определения типов
│   └── types.ts          # Дополнительные типы
│
└── tests/
    ├── SimpleValidator.test.js
    └── test-demo.test.js      

```

## Запуск

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск сервера разработки
npm run dev

# Или через Vite напрямую
npx run vite

# Откройте 
http://localhost:5174
```
