const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.18 });
reveals.forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
  observer.observe(el);
});

const transition = document.querySelector('.page-transition');
document.querySelectorAll('a[href$=".html"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === location.pathname.split('/').pop()) return;
    e.preventDefault();
    transition.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 300);
  });
});

window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax').forEach((section) => {
    const offset = window.scrollY * 0.2;
    section.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  });
});
