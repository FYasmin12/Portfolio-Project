document.addEventListener("DOMContentLoaded", () => {
   // --- Mobile Navigation Logic ---
   const navToggle = document.getElementById('nav-toggle');
   const navMenu = document.getElementById('nav-menu');
   const navIcon = navToggle ? navToggle.querySelector('i') : null;
   const navLinks = document.querySelectorAll('#nav-menu a');

   // Function to close mobile menu
   const closeMenu = () => {
      if (!navMenu) return;
      navMenu.classList.remove('right-0');
      navMenu.classList.add('-right-full');
      if (navIcon) {
         navIcon.classList.remove('ri-close-line');
         navIcon.classList.add('ri-menu-line');
      }
   };

   // Toggle mobile menu visibility
   if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
         e.stopPropagation();
         const isOpen = navMenu.classList.contains('right-0');

         if (isOpen) {
            closeMenu();
         } else {
            navMenu.classList.remove('-right-full');
            navMenu.classList.add('right-0');
            if (navIcon) {
               navIcon.classList.remove('ri-menu-line');
               navIcon.classList.add('ri-close-line');
            }
         }
      });
   }

   // Close menu when clicking any nav link
   navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
   });

   // Close menu when clicking outside of navbar
   document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('right-0')) {
         if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
         }
      }
   });

   // --- Intersection Observer for Scroll Animations ---
   const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: "0px"
   };

   const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Unobserve after animating once
            // observerInstance.unobserve(entry.target);
         }
      });
   }, observerOptions);

   const animatedElements = document.querySelectorAll('.animate-on-scroll');
   animatedElements.forEach(element => observer.observe(element));
});