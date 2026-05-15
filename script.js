/* HEADER SCROLL */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

/* BURGER MENU */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

function toggleMenu(open) {
    burger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

burger.addEventListener('click', () => {
    toggleMenu(!mobileNav.classList.contains('open'));
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

/* SCROLL REVEAL */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
    revealObserver.observe(el);
});

/* PRODUCT CARD REVEAL */
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 130);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card').forEach(card => cardObserver.observe(card));

/* FILTER BUTTONS */
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        productCards.forEach(card => {
            const match = filter === 'all' || card.getAttribute('data-category') === filter;
            if (match) {
                card.style.display = '';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                setTimeout(() => { card.style.display = 'none'; }, 350);
            }
        });
    });
});

/* WHATSAPP ORDER */
function orderWhatsApp(productName) {
    const message = `Bonjour Layali Perles 👋\n\nJe souhaite commander : *${productName}*\n\nMerci de me confirmer la disponibilité et les modalités de commande. 🙏`;
    window.open(`https://wa.me/2290158413277?text=${encodeURIComponent(message)}`, '_blank');
}

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* MODAL */
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close');

if (modal) {
    document.querySelectorAll('.img-container').forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            modalImg.src = img.src;
            modal.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}