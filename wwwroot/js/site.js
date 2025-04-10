// Aus-E-Mart Interactive JavaScript Features

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Animations for page elements
    initFadeAnimations();
    
    // Initialize interactive features
    initProductInteractions();
    initCartInteractions();
    initTooltips();
    
    // Navbar scroll behavior
    initScrollBehavior();
});

// Fade-in animation for elements
function initFadeAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Product interactions (Add to cart, view details)
function initProductInteractions() {
    // Product add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-outline-primary');
    
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productName = this.closest('.card-body').querySelector('.card-title').textContent;
                
                // Update cart badge
                const cartBadge = document.querySelector('.cart-badge');
                if (cartBadge) {
                    const currentCount = parseInt(cartBadge.textContent) || 0;
                    cartBadge.textContent = currentCount + 1;
                    cartBadge.classList.add('pulse-animation');
                    setTimeout(() => {
                        cartBadge.classList.remove('pulse-animation');
                    }, 1000);
                }
                
                // Show toast notification
                showToast(`${productName} added to cart!`);
            });
        });
    }
    
    // Product cards hover effects
    const productCards = document.querySelectorAll('.product-card');
    if (productCards) {
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// Cart interactions (quantity, remove items)
function initCartInteractions() {
    // Quantity buttons
    const quantityBtns = document.querySelectorAll('.input-group button');
    
    if (quantityBtns) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.closest('.input-group').querySelector('input');
                let value = parseInt(input.value);
                
                if (this.textContent === '+') {
                    input.value = value + 1;
                } else if (this.textContent === '-' && value > 1) {
                    input.value = value - 1;
                }
            });
        });
    }
    
    // Remove items from cart
    const removeButtons = document.querySelectorAll('.text-danger');
    
    if (removeButtons) {
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const cartItem = this.closest('.d-flex');
                
                // Add fade-out animation
                cartItem.style.opacity = '0';
                cartItem.style.height = cartItem.offsetHeight + 'px';
                
                setTimeout(() => {
                    cartItem.style.height = '0';
                    cartItem.style.padding = '0';
                    cartItem.style.margin = '0';
                    cartItem.style.overflow = 'hidden';
                }, 300);
                
                setTimeout(() => {
                    cartItem.remove();
                    updateCartSummary();
                }, 600);
            });
        });
    }
}

// Initialize Bootstrap tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Navbar scroll behavior
function initScrollBehavior() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// Helper function to show toast notifications
function showToast(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = 'toast show bg-success text-white';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // Toast content
    toastEl.innerHTML = `
        <div class="toast-header bg-success text-white">
            <strong class="me-auto">Aus-E-Mart</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toastEl);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toastEl.style.opacity = '0';
        setTimeout(() => {
            toastEl.remove();
        }, 300);
    }, 3000);
    
    // Close button functionality
    const closeBtn = toastEl.querySelector('.btn-close');
    closeBtn.addEventListener('click', function() {
        toastEl.style.opacity = '0';
        setTimeout(() => {
            toastEl.remove();
        }, 300);
    });
}

// Update cart summary totals
function updateCartSummary() {
    const subtotalEl = document.querySelector('.card-body .d-flex:first-child span:last-child');
    const totalEl = document.querySelector('.d-flex.justify-content-between.mb-4.fw-bold span:last-child');
    
    if (subtotalEl && totalEl) {
        // Recalculate subtotal based on remaining items
        let subtotal = 0;
        document.querySelectorAll('.d-flex.p-3').forEach(item => {
            const priceText = item.querySelector('.text-primary').textContent;
            const quantity = parseInt(item.querySelector('input').value) || 1;
            const price = parseFloat(priceText.replace('$', '')) || 0;
            subtotal += price * quantity;
        });
        
        // Update displayed values
        subtotalEl.textContent = '$' + subtotal.toFixed(2);
        
        // Calculate tax and total
        const tax = subtotal * 0.1;
        const shipping = 5.99;
        const total = subtotal + tax + shipping;
        
        // Update total
        totalEl.textContent = '$' + total.toFixed(2);
    }
}
