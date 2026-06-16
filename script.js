/* ========== 粒子背景 ========== */
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;
    const CONNECT_DIST = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            // 鼠标吸引
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.vx += dx * 0.00008;
                    this.vy += dy * 0.00008;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark
                ? `rgba(96, 165, 250, ${this.alpha})`
                : `rgba(37, 99, 235, ${this.alpha * 0.8})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });

        // 连线
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.15;
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = isDark
                        ? `rgba(96, 165, 250, ${alpha})`
                        : `rgba(37, 99, 235, ${alpha * 0.8})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ========== 主题切换 ========== */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* ========== 导航栏滚动 ========== */
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
});

/* ========== 移动端菜单 ========== */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMenu() {
    nav.classList.toggle('open');
    menuToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);
mobileOverlay.addEventListener('click', toggleMenu);

nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('open')) toggleMenu();
    });
});

/* ========== 打字效果 ========== */
const typingEl = document.getElementById('typingText');
const fullText = '升达网络技术工作室';
let charIndex = 0;

function typeWriter() {
    if (charIndex <= fullText.length) {
        typingEl.textContent = fullText.substring(0, charIndex);
        charIndex++;
        setTimeout(typeWriter, 150);
    } else {
        // 打完后隐藏光标
        setTimeout(() => {
            document.querySelector('.typing-cursor').style.display = 'none';
        }, 1500);
    }
}
// 延迟启动打字
setTimeout(typeWriter, 600);

/* ========== 数字滚动 ========== */
function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.floor(ease * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}
// 页面加载后触发
setTimeout(animateCounters, 1200);

/* ========== 滚动入场 ========== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.style.getPropertyValue('--delay');
            if (delay) {
                entry.target.style.transitionDelay = `${parseInt(delay) * 0.1}s`;
            }
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ========== 导航高亮 ========== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

/* ========== 时间线拖拽滑动 ========== */
const timelineWrap = document.querySelector('.timeline-scroll-wrap');
if (timelineWrap) {
    let isDown = false, startX, scrollLeft;

    timelineWrap.addEventListener('mousedown', e => {
        isDown = true; startX = e.pageX - timelineWrap.offsetLeft;
        scrollLeft = timelineWrap.scrollLeft;
    });
    timelineWrap.addEventListener('mouseleave', () => isDown = false);
    timelineWrap.addEventListener('mouseup', () => isDown = false);
    timelineWrap.addEventListener('mousemove', e => {
        if (!isDown) return; e.preventDefault();
        const x = e.pageX - timelineWrap.offsetLeft;
        timelineWrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    // 默认滚动到最新年份（右侧）
    timelineWrap.scrollLeft = timelineWrap.scrollWidth;
}

/* ========== 回到顶部 ========== */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== 平滑锚点 ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
