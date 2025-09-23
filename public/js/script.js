// Menu Navigation Button Toggle
const navButton = document.querySelector('.mobile-nav')

navButton.addEventListener('click', () => {
    const navMenu = document.querySelector('nav ul')
    navMenu.classList.toggle('hide')
})

// Show/Hide Password Toggle
const showPasswordButton = document.querySelector('.show-password')

showPasswordButton.addEventListener('click', () => {
    const passwordField = document.getElementById('account_password')
    const showIcon = document.querySelector('.show-password-icon')
    const hideIcon = document.querySelector('.hide-password-icon')
    showIcon.classList.toggle('hide')
    hideIcon.classList.toggle('hide')
    if (!showIcon.checkVisibility()) {
        passwordField.setAttribute('type', 'text')
    } else {
        passwordField.setAttribute('type', 'password')
    }
})
