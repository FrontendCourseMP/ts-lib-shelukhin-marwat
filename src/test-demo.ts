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