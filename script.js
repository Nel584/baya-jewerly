/* HERO SLIDER */
const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

/* HEADER SCROLL */
const header = document.getElementById('header');
if (header) {
    const isLightHeader = header.classList.contains('header-light');
    if ((document.body.classList.contains('page-inner') && !isLightHeader) || header.classList.contains('header-solid')) {
        header.classList.add('scrolled');
    }
    window.addEventListener('scroll', () => {
        const shouldScroll = window.scrollY > 60 || (header.classList.contains('header-solid') && !isLightHeader);
        header.classList.toggle('scrolled', shouldScroll);
    });
}

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
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
    revealObserver.observe(el);
});

/* PRODUCT CARD REVEAL */
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });

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
            const categories = (card.getAttribute('data-category') || '').split(' ');
            const match = filter === 'all' || categories.includes(filter);
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

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* PRODUCT ZOOM MODAL */
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close');

if (modal) {
    document.querySelectorAll('.img-container').forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            modalImg.src = img.src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* STATE MANAGEMENT FOR CART */
let cart = JSON.parse(localStorage.getItem('layali_cart')) || [];

/* ELEMENTS FOR CART */
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

// Helper formatting function
function formatPrice(number) {
    return number.toLocaleString('fr-FR') + ' FCFA';
}

// Update cart badge UI
function updateCartBadge() {
    if (!cartBadge) return;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalQty;
    if (totalQty > 0) {
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Toggle drawer
function toggleCart(isOpen) {
    if (!cartDrawer) return;
    if (isOpen) {
        cartDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Save cart to local storage and update UI
function saveCart() {
    localStorage.setItem('layali_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// Add item to cart
function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    saveCart();
    // Open cart drawer so user sees it added
    toggleCart(true);
}

// Expose globally for HTML onclick inline attributes
window.addToCart = addToCart;

// Update quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        saveCart();
    }
}

// Remove item entirely
function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
}

// Render cart items inside drawer
function renderCart() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty-message">Votre panier est vide.</div>';
        if (cartTotal) cartTotal.textContent = '0 FCFA';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-qty-actions">
                    <button class="qty-btn minus" aria-label="Diminuer">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn plus" aria-label="Augmenter">+</button>
                </div>
            </div>
            <button class="cart-item-remove" aria-label="Supprimer"><i class="fas fa-trash-alt"></i></button>
        `;

        // Wire event listeners for quantity adjustment and removal
        cartItemEl.querySelector('.qty-btn.minus').addEventListener('click', () => updateQuantity(item.name, -1));
        cartItemEl.querySelector('.qty-btn.plus').addEventListener('click', () => updateQuantity(item.name, 1));
        cartItemEl.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.name));

        cartItemsContainer.appendChild(cartItemEl);
    });

    if (cartTotal) cartTotal.textContent = formatPrice(total);
}

// Checkout on WhatsApp
function checkoutCart() {
    if (cart.length === 0) {
        alert('Votre panier est vide.');
        return;
    }

    let message = `Bonjour Layali Perles 👋\n`;
    message += `Je souhaite commander les articles suivants :\n\n`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `- *${item.quantity}x* ${item.name} (${formatPrice(item.price)})\n`;
    });

    message += `\n*Total : ${formatPrice(total)}*\n\n`;
    message += `Mes tailles estimées (à préciser) :\n- Tour de taille : ______ cm\n- Emplacement de port : (Taille Haute / Nombril / Hanches)\n\n`;
    message += `Merci de me confirmer la disponibilité et les modalités de paiement/livraison. 🙏`;

    window.open(`https://wa.me/2290192211895?text=${encodeURIComponent(message)}`, '_blank');
}

// Set up cart listeners
if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => toggleCart(true));
if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', () => toggleCart(false));
if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', checkoutCart);

// Initial call to load cart state
updateCartBadge();
renderCart();


/* SIZE SIMULATOR LOGIC */
const sizeData = {
    haute: {
        title: "Taille Haute",
        desc: "Le style élégant et discret. Le baya est positionné au-dessus du nombril. Idéal pour être porté sous les vêtements de tous les jours ou pour sculpter délicatement la silhouette.",
        effect: "Subtil & Galbant",
        range: "60 - 75 cm"
    },
    nombril: {
        title: "Nombril / Médian",
        desc: "Le port le plus populaire et polyvalent. Il se place juste au niveau du nombril et s'associe magnifiquement avec des vêtements courts, des crop-tops ou à la plage.",
        effect: "Élégant & Classique",
        range: "70 - 85 cm"
    },
    hanches: {
        title: "Hanches / Taille Basse",
        desc: "Le style traditionnel le plus sensuel. Le baya repose bas sur les hanches, accentuant les courbes naturelles et le bassin avec beaucoup de grâce et de féminité.",
        effect: "Sensuel & Traditionnel",
        range: "80 - 105 cm"
    }
};

const simBtns = document.querySelectorAll('.sim-btn');
const waistLines = document.querySelectorAll('.waist-line');
const simDetails = document.getElementById('simDetails');
const simTitle = document.getElementById('simTitle');
const simDesc = document.getElementById('simDesc');
const simEffect = document.getElementById('simEffect');
const simRange = document.getElementById('simRange');

if (simBtns.length > 0) {
    simBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            simBtns.forEach(b => b.classList.remove('active'));
            // Add active to current button
            btn.classList.add('active');

            const position = btn.getAttribute('data-position');

            // Remove active from all silhouette waistlines
            waistLines.forEach(line => line.classList.remove('active'));
            // Add active to matching waistline
            const targetLine = document.querySelector(`.waist-line.${position}`);
            if (targetLine) targetLine.classList.add('active');

            // Animate transition for details
            if (simDetails) {
                simDetails.classList.add('fade-out');
                setTimeout(() => {
                    if (sizeData[position]) {
                        if (simTitle) simTitle.textContent = sizeData[position].title;
                        if (simDesc) simDesc.textContent = sizeData[position].desc;
                        if (simEffect) simEffect.textContent = sizeData[position].effect;
                        if (simRange) simRange.textContent = sizeData[position].range;
                    }
                    simDetails.classList.remove('fade-out');
                }, 300); // matches the css fade animation duration
            }
        });
    });
}

/* CONTACT FORM */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameEl = document.getElementById('contactName');
        const emailEl = document.getElementById('contactEmail');
        const phoneEl = document.getElementById('contactPhone');
        const messageEl = document.getElementById('contactMessage');

        [emailEl, phoneEl, messageEl].forEach(el => el.classList.remove('invalid'));

        const email = emailEl.value.trim();
        const phone = phoneEl.value.trim();
        const message = messageEl.value.trim();
        const name = nameEl.value.trim();

        let valid = true;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailEl.classList.add('invalid');
            valid = false;
        }
        if (!phone) {
            phoneEl.classList.add('invalid');
            valid = false;
        }
        if (!message) {
            messageEl.classList.add('invalid');
            valid = false;
        }
        if (!valid) return;

        let waMessage = `Bonjour Layali Perles 👋\n\n`;
        waMessage += `*Nouveau message depuis le site*\n\n`;
        if (name) waMessage += `*Nom :* ${name}\n`;
        waMessage += `*Email :* ${email}\n`;
        waMessage += `*Téléphone :* ${phone}\n\n`;
        waMessage += `*Message :*\n${message}`;

        window.open(`https://wa.me/2290192211895?text=${encodeURIComponent(waMessage)}`, '_blank');
    });
}
