const navButton = document.querySelector('.mobile-nav')

navButton.addEventListener('click', () => {
    const navMenu = document.querySelector('nav ul')
    navMenu.classList.toggle('hide')
});
