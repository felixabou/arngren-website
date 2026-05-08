/**
 * ARNGREN.NET REDESIGN
 * Main JavaScript - Interactivity & Cart Management
 * Author: Aboubakar Felix
 */

// ============================================================
// CART STATE MANAGEMENT (using localStorage in real apps)
// ============================================================
const Cart = {
    items: [],

    init() {
        // Load from sessionStorage if available
        // Note: returns null if never set, vs empty array if user emptied cart
        try {
            const saved = sessionStorage.getItem('arngrenCart');
            if (saved !== null) {
                this.items = JSON.parse(saved);
                this.hasUserInteracted = true;
            } else {
                this.items = [];
                this.hasUserInteracted = false;
            }
        } catch (e) {
            this.items = [];
            this.hasUserInteracted = false;
        }
        this.updateCartCount();
    },

    add(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += product.quantity || 1;
        } else {
            this.items.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        this.save();
        this.updateCartCount();
        showToast(`${product.name} added to cart`);
    },

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartCount();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
            this.updateCartCount();
        }
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    save() {
        try {
            sessionStorage.setItem('arngrenCart', JSON.stringify(this.items));
        } catch (e) {
            console.warn('Could not save cart to session storage');
        }
    },

    updateCartCount() {
        const countEl = document.querySelector('.nav__cart-count');
        if (countEl) {
            const count = this.getItemCount();
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
    const toggle = document.querySelector('.nav__menu-toggle');
    const links = document.querySelector('.nav__links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
        const expanded = toggle.classList.contains('open');
        toggle.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking a link (mobile)
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggle.classList.remove('open');
                links.classList.remove('open');
            }
        });
    });
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ============================================================
// ADD TO CART BUTTONS
// ============================================================
function initAddToCart() {
    document.querySelectorAll('[data-add-to-cart]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productData = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: parseFloat(button.dataset.productPrice),
                specs: button.dataset.productSpecs || '',
                image: button.dataset.productImage || ''
            };

            // Check for quantity input on product detail pages
            const qtyInput = document.querySelector('.quantity-input');
            if (qtyInput && button.classList.contains('add-to-cart-detail')) {
                productData.quantity = parseInt(qtyInput.value, 10) || 1;
            }

            Cart.add(productData);
        });
    });
}

// ============================================================
// QUANTITY CONTROLS
// ============================================================
function initQuantityControls() {
    document.querySelectorAll('.quantity-control').forEach(control => {
        const input = control.querySelector('.quantity-input');
        const minusBtn = control.querySelector('[data-action="decrement"]');
        const plusBtn = control.querySelector('[data-action="increment"]');

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                const current = parseInt(input.value, 10) || 1;
                input.value = Math.max(1, current - 1);
                input.dispatchEvent(new Event('change'));
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const current = parseInt(input.value, 10) || 1;
                input.value = current + 1;
                input.dispatchEvent(new Event('change'));
            });
        }

        if (input) {
            input.addEventListener('change', () => {
                const productId = input.dataset.productId;
                if (productId) {
                    Cart.updateQuantity(productId, parseInt(input.value, 10));
                    renderCart(); // Re-render cart page if applicable
                }
            });
        }
    });
}

// ============================================================
// PRODUCT GALLERY (Product Detail Page)
// ============================================================
function initProductGallery() {
    const mainImage = document.querySelector('.product-gallery__main img');
    const thumbs = document.querySelectorAll('.product-gallery__thumb');

    if (!mainImage || !thumbs.length) return;

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const newSrc = thumb.querySelector('img').src;
            mainImage.src = newSrc;
        });
    });
}

// ============================================================
// FILTER FUNCTIONALITY (Category Page)
// ============================================================
function initFilters() {
    const applyBtn = document.querySelector('[data-apply-filters]');
    if (!applyBtn) return;

    applyBtn.addEventListener('click', () => {
        const checked = document.querySelectorAll('.filter-option input:checked');
        const filters = Array.from(checked).map(cb => cb.dataset.filter);

        const products = document.querySelectorAll('.product-card');

        if (filters.length === 0) {
            products.forEach(p => p.style.display = '');
            updateProductCount(products.length);
            showToast('All filters cleared');
            return;
        }

        let visibleCount = 0;
        products.forEach(product => {
            const productFilters = (product.dataset.filters || '').split(',');
            const matches = filters.some(f => productFilters.includes(f));
            product.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });

        updateProductCount(visibleCount);
        showToast(`Showing ${visibleCount} products`);
    });
}

function updateProductCount(count) {
    const countEl = document.querySelector('.product-area__count strong');
    if (countEl) countEl.textContent = count;
}

// ============================================================
// CART PAGE RENDERING
// ============================================================
function renderCart() {
    const container = document.querySelector('.cart-items');
    const emptyState = document.querySelector('.cart-empty');
    const summary = document.querySelector('.order-summary');

    if (!container) return; // Not on cart page

    // On first visit (never interacted), keep the static demo items
    // and just attach event handlers to the existing HTML
    if (!Cart.hasUserInteracted) {
        attachCartEventHandlers();
        return;
    }

    if (Cart.items.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (summary) summary.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'block';
    if (summary) summary.style.display = 'block';

    // Render items
    const itemsHtml = Cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item__product">
                <div class="cart-item__image">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop'}" alt="${item.name}">
                </div>
                <div class="cart-item__details">
                    <h3>${item.name}</h3>
                    <p class="specs">${item.specs}</p>
                    <button class="cart-item__remove" data-remove="${item.id}">Remove</button>
                </div>
            </div>
            <div class="cart-item__price">€${item.price.toLocaleString()}</div>
            <div class="quantity-control">
                <button class="quantity-btn" data-action="decrement" data-id="${item.id}">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
                <button class="quantity-btn" data-action="increment" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item__total">€${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');

    // Keep header, replace items
    const header = container.querySelector('.cart-table-header');
    container.innerHTML = '';
    if (header) container.appendChild(header);
    container.insertAdjacentHTML('beforeend', itemsHtml);

    // Re-attach remove handlers
    container.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
            Cart.remove(btn.dataset.remove);
            renderCart();
            showToast('Item removed from cart');
        });
    });

    // Re-attach quantity handlers
    container.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = Cart.items.find(i => i.id === id);
            if (!item) return;
            const newQty = btn.dataset.action === 'increment' 
                ? item.quantity + 1 
                : Math.max(1, item.quantity - 1);
            Cart.updateQuantity(id, newQty);
            renderCart();
        });
    });

    container.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            Cart.updateQuantity(input.dataset.productId, parseInt(input.value, 10));
            renderCart();
        });
    });

    // Update summary totals
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = Cart.getTotal();
    const tax = subtotal * 0.25; // Norwegian VAT
    const total = subtotal + tax;

    const setText = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    };

    setText('[data-subtotal]', `€${subtotal.toLocaleString()}`);
    setText('[data-tax]', `€${tax.toFixed(2)}`);
    setText('[data-total]', `€${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
}

// Attach handlers to existing static cart items (used on first cart page visit)
function attachCartEventHandlers() {
    const container = document.querySelector('.cart-items');
    if (!container) return;

    // Static demo items - hardcoded prices for first-visit experience
    const demoData = {
        'urban-ebike-pro': { price: 1299, name: 'Urban E-Bike Pro' },
        'safety-helmet': { price: 49, name: 'Safety Helmet' }
    };

    container.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.cart-item');
            if (item) {
                item.style.transition = 'opacity 0.3s, transform 0.3s';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.remove();
                    showToast('Item removed from cart');
                    // Check if cart is now empty
                    if (container.querySelectorAll('.cart-item').length === 0) {
                        const emptyState = document.querySelector('.cart-empty');
                        const summary = document.querySelector('.order-summary');
                        container.style.display = 'none';
                        if (emptyState) emptyState.style.display = 'block';
                        if (summary) summary.style.display = 'none';
                    }
                }, 300);
            }
        });
    });

    container.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cartItem = btn.closest('.cart-item');
            const input = cartItem.querySelector('.quantity-input');
            const totalEl = cartItem.querySelector('.cart-item__total');
            const id = btn.dataset.id;
            const product = demoData[id];
            if (!product || !input) return;

            const current = parseInt(input.value, 10) || 1;
            const newQty = btn.dataset.action === 'increment' 
                ? current + 1 
                : Math.max(1, current - 1);
            input.value = newQty;

            if (totalEl) {
                totalEl.textContent = `€${(product.price * newQty).toLocaleString()}`;
            }
        });
    });
}

// ============================================================
// CHECKOUT BUTTON HANDLER
// ============================================================
function initCheckout() {
    const checkoutBtn = document.querySelector('[data-checkout]');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (Cart.items.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        showToast('Redirecting to checkout...');
        // In a real app, this would redirect to a checkout page
        setTimeout(() => {
            alert('This is a demo. In production, this would proceed to a secure checkout page.');
        }, 800);
    });
}

// ============================================================
// SEARCH (Visual feedback only - demo)
// ============================================================
function initSearch() {
    const searchInputs = document.querySelectorAll('.nav__search input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = input.value.trim();
                if (query) {
                    showToast(`Searching for "${query}"...`);
                    // In production, this would navigate to search results
                }
            }
        });
    });
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.category-card, .product-card, .value-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================================
// INITIALIZE EVERYTHING ON LOAD
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    initMobileMenu();
    initAddToCart();
    initQuantityControls();
    initProductGallery();
    initFilters();
    initCheckout();
    initSearch();
    initScrollAnimations();

    // Render cart if on cart page
    renderCart();

    // Set active nav link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        }
    });
});
