document.addEventListener("DOMContentLoaded", () => {
   // Mobile Navigation Toggle
   const navToggle = document.getElementById('nav-toggle');
   const navMenu = document.getElementById('nav-menu');

   if (navToggle) {
      navToggle.addEventListener('click', () => {
         navMenu.classList.toggle('max-md:top-16');
      });
   }

   const navLinks = document.querySelectorAll('#nav-menu a');
   navLinks.forEach(link => {
      link.addEventListener('click', () => {
         navMenu.classList.remove('max-md:top-16');
      });
   });

   // Intersection Observer for Scroll Animations
   const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: "0px"
   };

   const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('visible');
         }
      });
   }, observerOptions);

   document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
   });
});