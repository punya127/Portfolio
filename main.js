/**
 * Vadaga Punyavathi - Digital Portfolio
 * Core Interactive Scripts & Micro-animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypingEffect();
  initNavbarScroll();
  initThemeToggle();
  initProjectFilters();
  initSkillBars();
  initContactForm();
  initCopyButtons();
  initProjectModals();
  initResumeModal();
  initTerminalActions();
});

/* ----------------------------------------------------
   1. Interactive Constellation / Neural Network Canvas
   ---------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Generate nodes
  const particleCount = Math.floor((width * height) / 18000);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }
  }

  for (let i = 0; i < Math.min(particleCount, 80); i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#8b5cf6';
          ctx.globalAlpha = (1 - dist / 120) * 0.25;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ----------------------------------------------------
   2. Dynamic Typing Text Effect
   ---------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const roles = [
    'AI & Machine Learning Engineer',
    'Full-Stack Python Developer',
    'IoT & Embedded System Innovator',
    'Deep Learning & LLM Explorer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const delayBetween = 1800;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      typingElement.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingElement.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let timeout = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === current.length) {
      timeout = delayBetween;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      timeout = 400;
    }

    setTimeout(type, timeout);
  }

  type();
}

/* ----------------------------------------------------
   3. Navbar Scroll & Active Scrollspy
   ---------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
      });
    });
  }
}

/* ----------------------------------------------------
   4. Theme Toggle (Dark & Light)
   ---------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('punya_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('punya_portfolio_theme', nextTheme);
    updateThemeIcon(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Cyber Dark' : 'Clean Light'} theme`);
  });

  function updateThemeIcon(theme) {
    const icon = toggleBtn.querySelector('i');
    if (!icon) return;
    if (theme === 'light') {
      icon.className = 'fa-solid fa-moon';
    } else {
      icon.className = 'fa-solid fa-sun';
    }
  }
}

/* ----------------------------------------------------
   5. Project Filter Tabs
   ---------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ----------------------------------------------------
   6. Animated Skill Bars On Scroll
   ---------------------------------------------------- */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-level') || '85%';
          entry.target.style.width = width;
        }
      });
    },
    { threshold: 0.2 }
  );

  skillBars.forEach((bar) => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

/* ----------------------------------------------------
   7. Copy to Clipboard Utility
   ---------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast(`Copied to clipboard: "${textToCopy}"`);

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2200);
      });
    });
  });
}

/* ----------------------------------------------------
   8. Project Details Modal System
   ---------------------------------------------------- */
const projectData = {
  secureparcel: {
    title: 'SecureParcel — Smart & Secure Parcel Anti-Tamper & Fleet Telemetry',
    subtitle: 'Enterprise Full-Stack Python/Django & AI Anomaly Detection Engine',
    category: 'AI & Machine Learning / Full-Stack',
    stats: [
      { label: 'Dataset Size', val: '2,500+ records' },
      { label: 'ML Algorithm', val: 'Isolation Forest' },
      { label: 'Response Latency', val: '< 120ms' },
      { label: 'Telemetry Stream', val: 'Live GPS OBD-II' }
    ],
    overview:
      'SecureParcel is an end-to-end intelligent logistics security ecosystem designed to combat high-value transit theft and cargo tampering. By combining real-time vehicle GPS telemetry with machine learning anomaly detection and dynamic QR authentication, the system flags suspicious deviations before delivery completion.',
    features: [
      '<strong>Isolation Forest Anomaly Detection</strong>: Unsupervised machine learning model detecting spatial route deviations, unexpected dwell stops, and speed anomalies.',
      '<strong>Interactive Map Dashboard</strong>: Real-time telemetry visualization utilizing OpenStreetMap and Leaflet.js with live vehicle corridor tracking.',
      '<strong>Dynamic QR Code Tokenization</strong>: Cryptographically generated one-time QR codes for driver/recipient handshake with camera-based HTML5 scanner.',
      '<strong>Comprehensive Fleet Registry</strong>: Full relational CRUD architecture managing drivers, secure PIN credentials, vehicles, and audit trails.'
    ],
    stack: ['Python', 'Django', 'Scikit-Learn', 'Isolation Forest', 'Leaflet.js', 'SQLite', 'HTML5 Camera API', 'OpenStreetMap'],
    github: 'https://github.com/vadaga-punyavathi/secure_parcel'
  },
  bikesafety: {
    title: 'Sensor-Based Bike Safety Detection System',
    subtitle: 'Design Thinking Innovation — Hardware & Embedded Safety Prototype',
    category: 'IoT & Embedded Systems',
    stats: [
      { label: 'Microcontroller', val: 'Arduino Uno' },
      { label: 'Sensor Type', val: 'HC-SR04 Ultrasonic' },
      { label: 'Feedback Mode', val: 'Dual (Audio + Haptic)' },
      { label: 'Safety Intervention', val: 'RPM Auto Slowdown' }
    ],
    overview:
      'Designed and prototyped to drastically reduce blind-spot collisions and rear/side impact accidents for two-wheeler commuters. The device continuously computes obstacle proximity and delivers dual sensory warnings to the rider while actively triggering motor rpm slowdown when a hazard breach is imminent.',
    features: [
      '<strong>Real-Time Ultrasonic Distance Sensing</strong>: High-frequency sonar sweep measuring distances to nearby obstacles with sub-centimeter precision.',
      '<strong>Haptic & Acoustic Alert Array</strong>: Dual alert system triggering tactile handlebar vibrations and acoustic frequency tones.',
      '<strong>Automated Speed Interlock</strong>: Simulated RPM motor throttling to safely de-escalate vehicle velocity in panic proximity zones.',
      '<strong>Tinkercad Simulation & Arduino Architecture</strong>: End-to-end circuit schematics and embedded C/C++ firmware tested against dynamic real-world scenarios.'
    ],
    stack: ['Arduino Uno', 'C/C++ Embedded', 'HC-SR04 Ultrasonic', 'Haptic Actuator', 'Autodesk Tinkercad', 'PWM Motor Control']
  },
  genai_intern: {
    title: 'Generative AI & LLM Exploration Suite',
    subtitle: 'AICTE Virtual Internship — Edu Skills',
    category: 'AI & Machine Learning',
    stats: [
      { label: 'Specialization', val: 'LLMs & Generative AI' },
      { label: 'Focus Area', val: 'Transformer Architectures' },
      { label: 'Frameworks', val: 'PyTorch, Hugging Face' },
      { label: 'Platform', val: 'Google Colab' }
    ],
    overview:
      'In-depth hands-on research and applied engineering lab covering modern foundation models, prompt engineering, attention mechanisms, fine-tuning, and neural network optimization.',
    features: [
      'Explored transformer-based foundation architectures and multi-head attention mechanisms.',
      'Constructed prompt engineering pipelines and domain-specific context retrieval workflows.',
      'Analyzed embeddings and semantic vector spaces for text classification and summarization.',
      'Evaluated model hallucination mitigation and responsible AI safety principles.'
    ],
    stack: ['Python', 'Large Language Models', 'Deep Learning', 'Transformers', 'Google Colab', 'NLP']
  },
  google_aiml: {
    title: 'Google AI-ML Data & Predictive Pipeline',
    subtitle: 'Google AI-ML Virtual Internship',
    category: 'AI & Machine Learning',
    stats: [
      { label: 'Curriculum', val: 'Google AI-ML' },
      { label: 'Pipeline', val: 'ETL + Model Training' },
      { label: 'Data Cleaning', val: 'Automated Imputation' },
      { label: 'Evaluation', val: 'Precision, Recall, ROC' }
    ],
    overview:
      'Intensive training track covering modern data science workflows, robust feature engineering, statistical modeling, and deploying predictive machine learning algorithms to solve real-world problems.',
    features: [
      'Hands-on data preprocessing: normalization, encoding, outlier mitigation, and missing value imputation.',
      'Supervised and unsupervised model training and cross-validation benchmarking.',
      'Feature importance analysis and mathematical performance optimization.'
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Data Visualization', 'Model Benchmark']
  },
  landacquisition: {
    title: 'Integrated Land Acquisition System',
    subtitle: '🥇 1st Prize Winner — Project Expo | Lendi Institute of Engineering & Technology (Engineer\'s Day)',
    category: 'Award-Winning Full-Stack & GIS System',
    stats: [
      { label: 'Award', val: '1st Prize (Gold)' },
      { label: 'Organized By', val: 'Lendi IET' },
      { label: 'Occasion', val: "Engineer's Day" },
      { label: 'Core Tech', val: 'GIS & Automation' }
    ],
    overview:
      'The Integrated Land Acquisition System was engineered to eliminate bureaucratic bottlenecks, legal disputes, and mapping inaccuracies during public and industrial land acquisition. Designed with transparent geospatial boundary demarcation, automated market-rate compensation formulas, and stakeholder audit trails, this solution secured 1st Prize at the prestigious Lendi Institute Project Expo on the occasion of Engineer\'s Day.',
    features: [
      '<strong>Geospatial Survey & Boundary Demarcation</strong>: Integrated GIS mapping coordinates to visualize parcel boundaries and eradicate overlapping ownership claims.',
      '<strong>Automated Compensation Engine</strong>: Algorithmic calculation factoring in market valuations, solatium, asset assessments, and transparent rehabilitation disbursals.',
      '<strong>Multi-Tier Stakeholder Workflow</strong>: Secure role-based portal for land owners, revenue survey officers, and administrative clearing authorities.',
      '<strong>Tamper-Resistant Digital Audit Trail</strong>: Traceable logging of survey revisions, citizen grievance resolutions, and disbursement milestone approvals.'
    ],
    stack: ['Python', 'GIS Spatial Mapping', 'Database Architecture', 'Automated Valuation Engine', 'Web Application', 'Workflow Automation']
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalBody = modal.querySelector('.modal-content-area');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const openButtons = document.querySelectorAll('[data-project-id]');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      const data = projectData[id];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span class="section-tag" style="margin-bottom: 0.5rem;">${data.category}</span>
          <h2 style="font-size: 1.6rem; color: var(--text-primary); margin-bottom: 0.35rem;">${data.title}</h2>
          <p style="color: var(--text-accent); font-weight: 600; font-size: 0.95rem;">${data.subtitle}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.8rem; margin-bottom: 1.8rem;">
          ${data.stats
            .map(
              (s) => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.8rem; text-align: center;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">${s.label}</div>
              <div style="font-size: 1.05rem; font-weight: 700; color: var(--accent-cyan);">${s.val}</div>
            </div>
          `
            )
            .join('')}
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.6rem;">Project Overview</h4>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">${data.overview}</p>
        </div>

        <div style="margin-bottom: 1.8rem;">
          <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.8rem;">Key Architecture & Innovations</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem;">
            ${data.features
              .map(
                (f) => `
              <li style="display: flex; gap: 0.6rem; color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">
                <span style="color: var(--accent-purple); font-weight: bold;">▹</span>
                <div>${f}</div>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.6rem;">Technologies Applied</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${data.stack
              .map(
                (tech) => `
              <span class="tech-pill" style="font-size: 0.8rem; padding: 0.35rem 0.8rem; background: rgba(139, 92, 246, 0.12); color: var(--accent-cyan); border-color: rgba(139, 92, 246, 0.25);">${tech}</span>
            `
              )
              .join('')}
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ----------------------------------------------------
   9. Resume Viewer Modal
   ---------------------------------------------------- */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  if (!resumeModal || !openResumeBtns.length) return;

  const closeBtn = resumeModal.querySelector('.modal-close-btn');

  openResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* ----------------------------------------------------
   10. Interactive Developer Terminal
   ---------------------------------------------------- */
function initTerminalActions() {
  const copyCodeBtn = document.getElementById('term-copy-btn');
  if (!copyCodeBtn) return;

  copyCodeBtn.addEventListener('click', () => {
    const code = `{
  "developer": "Vadaga Punyavathi",
  "specialization": "AI & Machine Learning",
  "degree": "B.Tech CSE (AI & ML)",
  "cgpa": 9.0,
  "top_skills": ["Python", "Java", "DSA", "Isolation Forest", "Generative AI", "Django"],
  "status": "Available for Software & AI/ML opportunities",
  "email": "punyavathi127@gmail.com",
  "phone": "+91 9346299053"
}`;
    navigator.clipboard.writeText(code).then(() => {
      showToast('Developer profile JSON copied!');
    });
  });
}

/* ----------------------------------------------------
   11. Contact Form Handling
   ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    // Compose mailto
    const mailtoUrl = `mailto:punyavathi127@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${subject || 'Collaboration Opportunity'}`
    )}&body=${encodeURIComponent(
      `Hi Punyavathi,\n\nMy name is ${name} (${email}).\n\n${message}\n\nSent from your digital portfolio.`
    )}`;

    window.open(mailtoUrl, '_blank');
    showToast('Drafting email to punyavathi127@gmail.com...');
    form.reset();
  });
}

/* ----------------------------------------------------
   12. Toast Notification Helper
   ---------------------------------------------------- */
function showToast(msg, type = 'info') {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
  const color = type === 'error' ? 'var(--accent-rose)' : 'var(--accent-emerald)';

  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.1rem;"></i> <span>${msg}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
