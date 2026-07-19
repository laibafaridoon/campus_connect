import React, { useEffect, useRef, useState } from 'react';
import profileImage from '../assets/profile.jpeg';
import './Portfolio.css';

export default function Portfolio() {
  const particleCanvasRef = useRef(null);
  const typingTextRef = useRef(null);
  const contactFormRef = useRef(null);
  const submitBtnRef = useRef(null);
  
  const [isNavActive, setIsNavActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // ============ CURSOR GLOW ============
    const glow = document.getElementById('cursorGlow');
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768 && glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ============ NAVBAR SCROLL ============
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Active Section Tracking
      const sections = document.querySelectorAll('.section, .hero');
      let current = 'home';
      sections.forEach((section) => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);

    // ============ PARTICLE CANVAS ============
    const canvas = particleCanvasRef.current;
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();

      const initParticles = () => {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
          });
        }
      };
      initParticles();

      const handleCanvasMouseMove = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
      });

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          if (mouse.x !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              p.x += dx * force * 0.02;
              p.y += dy * force * 0.02;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
        animationFrameId = requestAnimationFrame(animateParticles);
      };
      animateParticles();
    }

    // ============ TYPING EFFECT ============
    const words = [
      'Software Developer',
      'Full-Stack Developer',
      'Mobile App Developer',
      'UI/UX Enthusiast',
      'Problem Solver',
      'Tech Innovator',
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    const typeEffect = () => {
      const currentWord = words[wordIndex];
      const el = typingTextRef.current;
      if (!el) return;

      if (isDeleting) {
        charIndex--;
        el.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = currentWord.substring(0, charIndex);
      }

      let speed = isDeleting ? 50 : 80;
      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }
      typingTimeout = setTimeout(typeEffect, speed);
    };
    typeEffect();

    // ============ SCROLL OBSERVERS ============
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    scrollElements.forEach((el) => scrollObserver.observe(el));

    const fillElements = document.querySelectorAll('.skill-fill');
    const fillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.3 }
    );
    fillElements.forEach((fill) => fillObserver.observe(fill));

    let counterAnimated = false;
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counterAnimated) {
            counterAnimated = true;
            counters.forEach((counter) => {
              const target = +counter.getAttribute('data-target');
              const duration = 2000;
              const startTime = performance.now();
              const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.textContent = target;
                }
              };
              requestAnimationFrame(updateCounter);
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(typingTimeout);
      scrollObserver.disconnect();
      fillObserver.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  // ============ CONTACT FORM SUBMIT ============
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const btn = submitBtnRef.current;
    if (!btn) return;

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        contactFormRef.current.reset();
      }, 2500);
    }, 1500);
  };

  const smoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsNavActive(false);
  };

  return (
    <>
      <div class="cursor-glow" id="cursorGlow"></div>
      <canvas id="particleCanvas" ref={particleCanvasRef}></canvas>

      {/* Navigation */}
      <nav class={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div class="nav-container">
          <a href="#home" class="nav-logo" onClick={(e) => smoothScroll(e, 'home')}>
            <span class="logo-bracket">&lt;</span>LF<span class="logo-bracket">/&gt;</span>
          </a>
          <ul class={`nav-links ${isNavActive ? 'active' : ''}`} id="navLinks">
            <li><a href="#home" class={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'home')}>Home</a></li>
            <li><a href="#about" class={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'about')}>About</a></li>
            <li><a href="#skills" class={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'skills')}>Skills</a></li>
            <li><a href="#projects" class={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'projects')}>Projects</a></li>
            <li><a href="#contact" class={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'contact')}>Contact</a></li>
          </ul>
          <button class={`nav-toggle ${isNavActive ? 'active' : ''}`} id="navToggle" aria-label="Toggle navigation" onClick={() => setIsNavActive(!isNavActive)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button 
            class="theme-toggle" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <i class="fas fa-sun"></i>
            ) : (
              <i class="fas fa-moon"></i>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section class="hero" id="home">
        <div class="hero-content">
          <div class="hero-badge animate-on-scroll">
            <span class="badge-dot"></span>
            Available for Opportunities
          </div>
          <h1 class="hero-title animate-on-scroll">
            <span class="hero-greeting">Hello, I'm</span>
            <span class="hero-name">Laiba Faridoon</span>
          </h1>
          <div class="hero-role animate-on-scroll">
            <span class="role-prefix">I'm a </span>
            <span class="typing-text" ref={typingTextRef}></span>
            <span class="typing-cursor">|</span>
          </div>
          <p class="hero-description animate-on-scroll">
            Passionate software developer crafting innovative digital solutions. 
            I build modern, scalable, and user-centric applications that make a real impact.
          </p>
          <div class="hero-cta animate-on-scroll">
            <a href="#projects" class="btn btn-primary" onClick={(e) => smoothScroll(e, 'projects')}>
              <span>View My Work</span>
              <i class="fas fa-arrow-right"></i>
            </a>
            <a href="#contact" class="btn btn-outline" onClick={(e) => smoothScroll(e, 'contact')}>
              <span>Get In Touch</span>
              <i class="fas fa-paper-plane"></i>
            </a>
          </div>
          <div class="hero-stats animate-on-scroll">
            <div class="stat-item">
              <span class="stat-number" data-target="8">0</span><span class="stat-plus">+</span>
              <span class="stat-label">Projects</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number" data-target="10">0</span><span class="stat-plus">+</span>
              <span class="stat-label">Skills</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number" data-target="50">0</span><span class="stat-plus">+</span>
              <span class="stat-label">Commits</span>
            </div>
          </div>
        </div>
        <div class="hero-visual animate-on-scroll">
          <div class="hero-image-wrapper">
            <div class="hero-ring ring-1"></div>
            <div class="hero-ring ring-2"></div>
            <div class="hero-ring ring-3"></div>
            <div class="hero-avatar">
              <img src={profileImage} alt="Laiba Faridoon profile" />
            </div>
            <div class="orbit-icon orbit-1"><i class="fas fa-code"></i></div>
            <div class="orbit-icon orbit-2"><i class="fas fa-database"></i></div>
            <div class="orbit-icon orbit-3"><i class="fas fa-mobile-alt"></i></div>
            <div class="orbit-icon orbit-4"><i class="fas fa-palette"></i></div>
          </div>
        </div>
        <div class="scroll-indicator">
          <div class="mouse">
            <div class="mouse-wheel"></div>
          </div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* About Section */}
      <section class="section about" id="about">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <span class="section-tag">&lt;about&gt;</span>
            <h2 class="section-title">About <span class="gradient-text">Me</span></h2>
            <p class="section-subtitle">Get to know the developer behind the code</p>
          </div>
          <div class="about-grid">
            <div class="about-content animate-on-scroll">
              <div class="about-text">
                <p>
                  I'm <strong>Laiba Faridoon</strong>, a passionate and detail-oriented software developer 
                  with a deep love for building digital experiences that truly matter. I specialize in 
                  developing full-stack web and mobile applications, from sleek front-end interfaces to 
                  robust back-end architectures.
                </p>
                <p>
                  My journey in tech has been driven by curiosity and a constant desire to learn. I thrive 
                  on turning complex problems into elegant, user-friendly solutions. Whether it's a hospital 
                  management system, an e-commerce platform, or a campus networking app – I bring creativity, 
                  precision, and dedication to every project I undertake.
                </p>
                <p>
                  I believe in clean code, thoughtful design, and the power of technology to transform 
                  industries. When I'm not coding, you'll find me exploring new technologies, contributing 
                  to open-source, or brainstorming the next big idea.
                </p>
              </div>
              <div class="about-info-cards">
                <div class="info-card">
                  <i class="fas fa-envelope"></i>
                  <div>
                    <span class="info-label">Email</span>
                    <span class="info-value">laibafaridoon@gmail.com</span>
                  </div>
                </div>
                <div class="info-card">
                  <i class="fas fa-phone"></i>
                  <div>
                    <span class="info-label">Phone</span>
                    <span class="info-value">+923677777777</span>
                  </div>
                </div>
                <div class="info-card">
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <span class="info-label">Location</span>
                    <span class="info-value">Pakistan</span>
                  </div>
                </div>
                <div class="info-card">
                  <i class="fas fa-graduation-cap"></i>
                  <div>
                    <span class="info-label">Focus</span>
                    <span class="info-value">Software Development</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="about-visual animate-on-scroll">
              <div class="code-window">
                <div class="code-header">
                  <div class="code-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <span class="code-title">about_me.js</span>
                </div>
                <div class="code-body">
                  <pre><code><span class="code-keyword">const</span> <span class="code-variable">developer</span> = {'{\n'}
  <span class="code-property">  name</span>: <span class="code-string">"Laiba Faridoon"</span>,{"\n"}
  <span class="code-property">  role</span>: <span class="code-string">"Software Developer"</span>,{"\n"}
  <span class="code-property">  passion</span>: <span class="code-string">"Building Solutions"</span>,{"\n"}
  <span class="code-property">  loves</span>: [{"\n"}
    <span class="code-string">    "Clean Code"</span>,{"\n"}
    <span class="code-string">    "UI/UX Design"</span>,{"\n"}
    <span class="code-string">    "Problem Solving"</span>,{"\n"}
    <span class="code-string">    "Innovation"</span>{"\n"}
    ],{"\n"}
  <span class="code-property">  motto</span>: <span class="code-string">"Code with purpose, design with empathy."</span>{"\n"}
{'}'};</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section class="section experience" id="experience">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <span class="section-tag">// CAREER PATH</span>
            <h2 class="section-title"><span class="gradient-text">Experience</span></h2>
            <p class="section-subtitle">Where I've worked and what I've shipped along the way.</p>
          </div>

          <div class="experience-wrapper">
            <div class="experience-timeline animate-on-scroll">
              <div class="timeline-item">
                <div class="timeline-marker">
                  <span class="marker-dot"></span>
                </div>
                <div class="timeline-content">
                  <span class="timeline-year">2026- PRESENT</span>
                  <h3 class="timeline-title">Frontend &amp; UI/UX Specialist</h3>
                  <p class="timeline-company">TechNest</p>
                  <p class="timeline-description">
                    Engineering and designing high-performing web applications for live, production-ready client projects. Bridging the gap between design and development by crafting intuitive UI/UX layouts and coding them into reality.
                  </p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-marker">
                  <span class="marker-dot"></span>
                </div>
                <div class="timeline-content">
                  <span class="timeline-year">2025 - 2026</span>
                  <h3 class="timeline-title">UI/UX Design Intern</h3>
                  <p class="timeline-company">Syntechub</p>
                  <p class="timeline-description">
                    Designed intuitive user journeys, site maps, and user flows for web and mobile applications. Crafted visually appealing layouts and prepared clean design files for frontend engineering teams.
                  </p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-marker">
                  <span class="marker-dot"></span>
                </div>
                <div class="timeline-content">
                  <span class="timeline-year">2025 - 2026</span>
                  <h3 class="timeline-title">UI/UX Design Intern</h3>
                  <p class="timeline-company">Elite Tech</p>
                  <p class="timeline-description">
                    Conducted user research and competitor analysis. Created low-fidelity wireframes and high-fidelity interactive prototypes using Figma. Assisted in building scalable design systems.
                  </p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-marker">
                  <span class="marker-dot"></span>
                </div>
                <div class="timeline-content">
                  <span class="timeline-year">2025 - 2026</span>
                  <h3 class="timeline-title">Frontend Developer Intern</h3>
                  <p class="timeline-company">MTech</p>
                  <p class="timeline-description">
                    Developed and deployed responsive web pages using HTML, CSS, JavaScript, and modern frameworks. Built reusable UI components and ensured cross-browser compatibility across all devices.
                  </p>
                </div>
              </div>
            </div>

            <div class="experience-sidebar animate-on-scroll">
              <div class="sidebar-card">
                <h4 class="sidebar-title">// QUICK FACTS</h4>
                <div class="sidebar-item">
                  <span class="sidebar-label">Location</span>
                  <span class="sidebar-value">Abbotabad Pakistan</span>
                </div>
                <div class="sidebar-item">
                  <span class="sidebar-label">Availability</span>
                  <span class="sidebar-value highlight">Open to offers</span>
                </div>
                <div class="sidebar-item">
                  <span class="sidebar-label">Preferred work</span>
                  <span class="sidebar-value">Remote / Hybrid</span>
                </div>
                <div class="sidebar-item">
                  <span class="sidebar-label">Languages</span>
                  <span class="sidebar-value">English, Urdu</span>
                </div>
                <div class="sidebar-item">
                  <span class="sidebar-label">Response time</span>
                  <span class="sidebar-value">&lt; 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section class="section skills" id="skills">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <span class="section-tag">&lt;skills&gt;</span>
            <h2 class="section-title">My <span class="gradient-text">Skills</span></h2>
            <p class="section-subtitle">Technologies and tools I work with</p>
          </div>
          <div class="skills-categories">
            {/* Frontend */}
            <div class="skill-category animate-on-scroll">
              <div class="category-header">
                <div class="category-icon"><i class="fas fa-laptop-code"></i></div>
                <h3>Frontend Development</h3>
              </div>
              <div class="skills-grid">
                {[
                  { name: 'HTML5', icon: 'fab fa-html5', fill: '90%' },
                  { name: 'CSS3', icon: 'fab fa-css3-alt', fill: '85%' },
                  { name: 'JavaScript', icon: 'fab fa-js-square', fill: '80%' },
                  { name: 'React', icon: 'fab fa-react', fill: '75%' },
                  { name: 'Bootstrap', icon: 'fab fa-bootstrap', fill: '70%' },
                ].map((skill, index) => (
                  <div class="skill-card" key={index}>
                    <div class="skill-icon"><i class={skill.icon}></i></div>
                    <span class="skill-name">{skill.name}</span>
                    <div class="skill-bar">
                      <div class="skill-fill" style={{ '--fill': skill.fill }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div class="skill-category animate-on-scroll">
              <div class="category-header">
                <div class="category-icon"><i class="fas fa-server"></i></div>
                <h3>Backend Development</h3>
              </div>
              <div class="skills-grid">
                {[
                  { name: 'Python', icon: 'fab fa-python', fill: '80%' },
                  { name: 'Java', icon: 'fab fa-java', fill: '75%' },
                  { name: 'Node.js', icon: 'fab fa-node-js', fill: '70%' },
                  { name: 'PHP', icon: 'fab fa-php', fill: '75%' },
                  { name: 'C#/.NET', icon: 'fas fa-gem', fill: '65%' },
                ].map((skill, index) => (
                  <div class="skill-card" key={index}>
                    <div class="skill-icon"><i class={skill.icon}></i></div>
                    <span class="skill-name">{skill.name}</span>
                    <div class="skill-bar">
                      <div class="skill-fill" style={{ '--fill': skill.fill }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database & Tools */}
            <div class="skill-category animate-on-scroll">
              <div class="category-header">
                <div class="category-icon"><i class="fas fa-database"></i></div>
                <h3>Database & Tools</h3>
              </div>
              <div class="skills-grid">
                {[
                  { name: 'MySQL', icon: 'fas fa-database', fill: '80%' },
                  { name: 'MongoDB', icon: 'fas fa-leaf', fill: '70%' },
                  { name: 'Git/GitHub', icon: 'fab fa-git-alt', fill: '85%' },
                  { name: 'Firebase', icon: 'fas fa-fire', fill: '70%' },
                  { name: 'Docker', icon: 'fab fa-docker', fill: '65%' },
                ].map((skill, index) => (
                  <div class="skill-card" key={index}>
                    <div class="skill-icon"><i class={skill.icon}></i></div>
                    <span class="skill-name">{skill.name}</span>
                    <div class="skill-bar">
                      <div class="skill-fill" style={{ '--fill': skill.fill }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile & Design */}
            <div class="skill-category animate-on-scroll">
              <div class="category-header">
                <div class="category-icon"><i class="fas fa-mobile-alt"></i></div>
                <h3>Mobile & Design</h3>
              </div>
              <div class="skills-grid">
                {[
                  { name: 'Android', icon: 'fab fa-android', fill: '75%' },
                  { name: 'Flutter', icon: 'fas fa-feather-alt', fill: '70%' },
                  { name: 'Figma', icon: 'fab fa-figma', fill: '80%' },
                  { name: 'UI/UX Design', icon: 'fas fa-paint-brush', fill: '70%' },
                  { name: 'REST APIs', icon: 'fas fa-cogs', fill: '75%' },
                ].map((skill, index) => (
                  <div class="skill-card" key={index}>
                    <div class="skill-icon"><i class={skill.icon}></i></div>
                    <span class="skill-name">{skill.name}</span>
                    <div class="skill-bar">
                      <div class="skill-fill" style={{ '--fill': skill.fill }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section class="section projects" id="projects">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <span class="section-tag">&lt;projects&gt;</span>
            <h2 class="section-title">Featured <span class="gradient-text">Projects</span></h2>
            <p class="section-subtitle">A showcase of my recent work and contributions</p>
          </div>
          <div class="projects-grid">
            {[
              { id: 'hospital', grad: 'gradient-1', icon: 'fas fa-hospital-alt', title: 'Smart Hospital Management System', tags: ['Python', 'MySQL', 'Healthcare'], desc: 'A comprehensive hospital management platform featuring patient records, appointment scheduling, doctor management, billing, pharmacy integration, and real-time analytics dashboard.' },
              { id: 'contact', grad: 'gradient-2', icon: 'fas fa-address-book', title: 'Contact Management System', tags: ['JavaScript', 'Node.js', 'MongoDB'], desc: 'A feature-rich CRM application with contact organization, search & filter, import/export functionality, group management, and activity tracking with clean UI.' },
              { id: 'food', grad: 'gradient-3', icon: 'fas fa-utensils', title: 'Food Delivery App', tags: ['React', 'Firebase', 'Stripe'], desc: 'A modern food ordering and delivery platform with restaurant listings, real-time order tracking, secure payments, ratings & reviews, and push notifications.' },
              { id: 'ecommerce', grad: 'gradient-4', icon: 'fas fa-shopping-cart', title: 'E-Commerce Platform', tags: ['PHP', 'MySQL', 'Bootstrap'], desc: 'A full-featured online shopping platform with product catalog, shopping cart, secure checkout, order management, admin dashboard, and inventory tracking.' },
              { id: 'campus', grad: 'gradient-5', icon: 'fas fa-university', title: 'Campus Connect', tags: ['React', 'Node.js', 'Socket.io'], desc: 'A campus social networking platform enabling students to connect, share resources, join study groups, access announcements, and collaborate on projects seamlessly.' },
              { id: 'event', grad: 'gradient-6', icon: 'fas fa-calendar-alt', title: 'Event Management System', tags: ['Flutter', 'Firebase', 'Dart'], desc: 'An intuitive event planning application with event creation, RSVP management, ticketing, venue booking, attendee analytics, and real-time notifications.' },
              { id: 'weather', grad: 'gradient-7', icon: 'fas fa-cloud-sun', title: 'Weather Dashboard', tags: ['JavaScript', 'API', 'CSS3'], desc: 'A dynamic weather application featuring real-time forecasts, interactive maps, location-based alerts, hourly/weekly predictions, and beautiful animated weather visualizations.' },
              { id: 'task', grad: 'gradient-8', icon: 'fas fa-tasks', title: 'Task Manager Pro', tags: ['React', 'Redux', 'MongoDB'], desc: 'A productivity-focused task management tool with Kanban boards, drag-and-drop, priority tagging, deadline reminders, team collaboration, and progress analytics.' },
            ].map((proj) => (
              <div class="project-card animate-on-scroll" id={`project-${proj.id}`} key={proj.id}>
                <div class="project-image">
                  <div class={`project-gradient ${proj.grad}`}>
                    <i class={`${proj.icon} project-bg-icon`}></i>
                  </div>
                  <div class="project-overlay">
                    <a href="https://github.com/laibafaridoon" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                  </div>
                </div>
                <div class="project-info">
                  <div class="project-tags">
                    {proj.tags.map((tag, tIdx) => <span class="tag" key={tIdx}>{tag}</span>)}
                  </div>
                  <h3 class="project-title">{proj.title}</h3>
                  <p class="project-desc">{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section class="section contact" id="contact">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <span class="section-tag">&lt;contact&gt;</span>
            <h2 class="section-title">Get In <span class="gradient-text">Touch</span></h2>
            <p class="section-subtitle">Have a project in mind? Let's build something amazing together</p>
          </div>
          <div class="contact-grid">
            <div class="contact-info animate-on-scroll">
              <h3 class="contact-heading">Let's Connect</h3>
              <p class="contact-text">
                I'm always excited to discuss new opportunities, creative ideas, or just have 
                a great conversation about tech. Feel free to reach out through any of the channels below!
              </p>
              <div class="contact-cards">
                <a href="mailto:laibafaridoon@gmail.com" class="contact-card" id="contact-email">
                  <div class="contact-card-icon"><i class="fas fa-envelope"></i></div>
                  <div class="contact-card-info">
                    <span class="contact-card-label">Email</span>
                    <span class="contact-card-value">laibafaridoon@gmail.com</span>
                  </div>
                  <i class="fas fa-arrow-right contact-card-arrow"></i>
                </a>
                <a href="tel:03163676887" class="contact-card" id="contact-phone">
                  <div class="contact-card-icon"><i class="fas fa-phone-alt"></i></div>
                  <div class="contact-card-info">
                    <span class="contact-card-label">Phone</span>
                    <span class="contact-card-value">+923677777777</span>
                  </div>
                  <i class="fas fa-arrow-right contact-card-arrow"></i>
                </a>
                <a href="https://github.com/laibafaridoon" target="_blank" rel="noopener noreferrer" class="contact-card" id="contact-github">
                  <div class="contact-card-icon"><i class="fab fa-github"></i></div>
                  <div class="contact-card-info">
                    <span class="contact-card-label">GitHub</span>
                    <span class="contact-card-value">github.com/laibafaridoon</span>
                  </div>
                  <i class="fas fa-arrow-right contact-card-arrow"></i>
                </a>
                <a href="https://www.linkedin.com/in/laiba-faridoon-0a3a46377" target="_blank" rel="noopener noreferrer" class="contact-card" id="contact-linkedin">
                  <div class="contact-card-icon"><i class="fab fa-linkedin-in"></i></div>
                  <div class="contact-card-info">
                    <span class="contact-card-label">LinkedIn</span>
                    <span class="contact-card-value">linkedin.com/in/laiba-faridoon</span>
                  </div>
                  <i class="fas fa-arrow-right contact-card-arrow"></i>
                </a>
              </div>
            </div>
            <div class="contact-form-wrapper animate-on-scroll">
              <form class="contact-form" id="contactForm" ref={contactFormRef} onSubmit={handleFormSubmit}>
                <div class="form-group">
                  <label htmlFor="formName">Your Name</label>
                  <div class="input-wrapper">
                    <i class="fas fa-user"></i>
                    <input type="text" id="formName" placeholder="Your Name" required />
                  </div>
                </div>
                <div class="form-group">
                  <label htmlFor="formEmail">Your Email</label>
                  <div class="input-wrapper">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="formEmail" placeholder="name@example.com" required />
                  </div>
                </div>
                <div class="form-group">
                  <label htmlFor="formSubject">Subject</label>
                  <div class="input-wrapper">
                    <i class="fas fa-tag"></i>
                    <input type="text" id="formSubject" placeholder="Project Discussion" required />
                  </div>
                </div>
                <div class="form-group">
                  <label htmlFor="formMessage">Message</label>
                  <div class="input-wrapper textarea-wrapper">
                    <i class="fas fa-comment-alt"></i>
                    <textarea id="formMessage" rows="5" placeholder="Tell me about your project..." required></textarea>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary btn-submit" id="submitBtn" ref={submitBtnRef}>
                  <span>Send Message</span>
                  <i class="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-logo">
              <span class="logo-bracket">&lt;</span>LF<span class="logo-bracket">/&gt;</span>
            </div>
            <div class="footer-socials">
              <a href="https://github.com/laibafaridoon" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub"><i class="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/laiba-faridoon-0a3a46377" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              <a href="mailto:laibafaridoon@gmail.com" class="social-link" aria-label="Email"><i class="fas fa-envelope"></i></a>
              <a href="tel:+923677777777" class="social-link" aria-label="Phone"><i class="fas fa-phone-alt"></i></a>
            </div>
            <p class="footer-copy">&copy; 2026 Laiba Faridoon. Crafted with <i class="fas fa-heart"></i> and lots of <i class="fas fa-coffee"></i></p>
          </div>
        </div>
      </footer>
    </>
  );
}