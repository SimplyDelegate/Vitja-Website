/* -------------------------------------------------------------
   Vitja Website - Triumph Industrial Services
   Client-Side Logic (main.js)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scrolled Header Effect
  const header = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      // Don't remove if we are on a legal subpage which defaults to scrolled look
      if (!document.body.classList.contains('legal-subpage')) {
        header.classList.remove('header-scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 4. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const handleActiveNav = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120; // offset header height
      const sectionId = section.getAttribute('id');
      const navLink = document.getElementById(`link-${sectionId}`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', handleActiveNav);

  // 5. Contact Form Mock Submission
  const inquiryForm = document.getElementById('inquiry-form');
  const formStatus = document.getElementById('form-status-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      
      if (!name || !email || !message) {
        showStatus('Bitte füllen Sie alle Pflichtfelder (*) aus.', 'error');
        return;
      }
      
      // Disable submit button and show sending state
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Wird gesendet...';
      
      // Simulate API network request
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        // Success
        showStatus('Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.', 'success');
        inquiryForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
          formStatus.className = 'form-status';
        }, 5000);
        
      }, 1500);
    });
  }

  function showStatus(message, type) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = 'block';
    }
  }

});
