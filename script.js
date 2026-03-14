const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links'); // sau nav ul

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});