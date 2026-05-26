const loginForm = document.forms.loginForm;
const emailInput = loginForm.elements.emailInput;
const passwordInput = loginForm.elements.passwordInput;

const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const submitButton = loginForm.elements.submitButton;

window.addEventListener('DOMContentLoaded', () => {
     if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('loginContainer').hidden = true;
        document.getElementById('appContainer').hidden = false;
    } 
    else {
        document.getElementById('loginContainer').hidden = false;
        document.getElementById('appContainer').hidden = true;
    }
});

loginForm.addEventListener('input', () => {
    validateLoginForm();
});

togglePassword.addEventListener('click', () => {
    showPassword(passwordInput, togglePassword);
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateLoginForm()) {
        addToLocalStorage('isLoggedIn', 'true');
        loginForm.reset();
        document.getElementById('loginContainer').hidden = true;
        document.getElementById('appContainer').hidden = false;
    }
});


function validateLoginForm() {
    let isEmailValid = validateEmail(emailInput, emailError);
    let isPasswordValid = validatePassword(passwordInput, passwordError);
    if (isEmailValid && isPasswordValid) {
        return true;
    }
    return false;
}

function validateEmail(emailInput, errorElement) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value)) {
        changeField(emailInput, false);
        errorElement.textContent = 'Please enter a valid email address.';
        return false;
    }
    else {
        changeField(emailInput, true);
        errorElement.textContent = '';
        return true;
    }
}

function validatePassword(passwordInput, errorElement) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(passwordInput.value)) {
        changeField(passwordInput, false);
        errorElement.textContent = 'Invalid password.';
        return false;
    }
    else {
        changeField(passwordInput, true);
        errorElement.textContent = '';
        return true;
    }
}

function changeField(input, isValid) {
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('error');
    }
}
function showPassword(input, image) {
    if (input.type === 'password') {
        input.type = 'text';
        image.src = 'images/opened eye.jpg';
    } else {
        input.type = 'password';
        image.src = 'images/closed eye.jpg';
    }
}

function addToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}
