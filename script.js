// Main JavaScript for Luxury Motors Website

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    initCarData();
    initEventListeners();
    initModals();
    
    // Load initial car data
    loadCars();
});

// Initialize navigation functionality
function initNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Initialize car data in localStorage if not already present
function initCarData() {
    if (!localStorage.getItem('luxuryMotorsCars')) {
        // Sample car data
        const sampleCars = [
            {
                id: 1,
                name: "Porsche 911 Turbo S",
                brand: "Porsche",
                model: "911 Turbo S",
                year: 2023,
                price: 215000,
                engine: "3.8L Twin-Turbo Flat-6",
                transmission: "8-Speed PDK",
                mileage: 1200,
                fuel: "Gasoline",
                shortDesc: "The pinnacle of performance and luxury.",
                longDesc: "The Porsche 911 Turbo S combines breathtaking performance with everyday usability. With 640 horsepower and all-wheel drive, it accelerates from 0-60 mph in just 2.6 seconds.",
                images: [
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
                    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                ],
                availability: "In Stock",
                featured: true
            },
            {
                id: 2,
                name: "Lamborghini Huracan EVO",
                brand: "Lamborghini",
                model: "Huracan EVO",
                year: 2022,
                price: 325000,
                engine: "5.2L V10",
                transmission: "7-Speed Dual-Clutch",
                mileage: 3500,
                fuel: "Gasoline",
                shortDesc: "Exotic supercar with stunning design.",
                longDesc: "The Lamborghini Huracan EVO represents the perfect combination of technology and design. Its V10 engine produces 640 horsepower, delivering an unforgettable driving experience.",
                images: [
                    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                ],
                availability: "In Stock",
                featured: true
            },
            {
                id: 3,
                name: "Mercedes-Benz S-Class",
                brand: "Mercedes-Benz",
                model: "S 580",
                year: 2023,
                price: 125000,
                engine: "4.0L V8 Biturbo",
                transmission: "9-Speed Automatic",
                mileage: 500,
                fuel: "Gasoline",
                shortDesc: "The ultimate luxury sedan.",
                longDesc: "The Mercedes-Benz S-Class redefines automotive luxury with its cutting-edge technology, exquisite craftsmanship, and unparalleled comfort. The epitome of executive travel.",
                images: [
                    "https://images.unsplash.com/photo-1563720223484-21c6c2d0c4c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
                    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                ],
                availability: "In Stock",
                featured: false
            },
            {
                id: 4,
                name: "BMW M8 Competition",
                brand: "BMW",
                model: "M8 Competition",
                year: 2022,
                price: 145000,
                engine: "4.4L V8 Twin-Turbo",
                transmission: "8-Speed Automatic",
                mileage: 8500,
                fuel: "Gasoline",
                shortDesc: "High-performance grand tourer.",
                longDesc: "The BMW M8 Competition combines luxury, technology, and breathtaking performance. With 617 horsepower, it delivers exceptional dynamics without compromising on comfort.",
                images: [
                    "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1555353540-64580b51c258?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                ],
                availability: "Sold",
                featured: false
            },
            {
                id: 5,
                name: "Audi R8 V10 Performance",
                brand: "Audi",
                model: "R8 V10 Performance",
                year: 2023,
                price: 198000,
                engine: "5.2L V10",
                transmission: "7-Speed Dual-Clutch",
                mileage: 1200,
                fuel: "Gasoline",
                shortDesc: "German engineering at its finest.",
                longDesc: "The Audi R8 V10 Performance offers an exceptional supercar experience with everyday usability. Its naturally aspirated V10 engine produces 602 horsepower and delivers an exhilarating soundtrack.",
                images: [
                    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
                    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                ],
                availability: "In Stock",
                featured: true
            },
            {
                id: 6,
                name: "Ferrari F8 Tributo",
                brand: "Ferrari",
                model: "F8 Tributo",
                year: 2022,
                price: 345000,
                engine: "3.9L V8 Twin-Turbo",
                transmission: "7-Speed Dual-Clutch",
                mileage: 4200,
                fuel: "Gasoline",
                shortDesc: "The ultimate expression of Ferrari excellence.",
                longDesc: "The Ferrari F8 Tributo is the most powerful V8-powered Ferrari ever built. With 710 horsepower, it represents the pinnacle of mid-rear-engined sports car technology.",
                images: [
                    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80"
                ],
                availability: "In Stock",
                featured: true
            }
        ];
        
        // Store sample data
        localStorage.setItem('luxuryMotorsCars', JSON.stringify(sampleCars));
    }
    
    // Initialize orders if not present
    if (!localStorage.getItem('luxuryMotorsOrders')) {
        localStorage.setItem('luxuryMotorsOrders', JSON.stringify([]));
    }
}

// Initialize event listeners for search and filters
function initEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterAndSearchCars(searchTerm);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            filterAndSearchCars(searchTerm);
        }
    });
    
    // Filter functionality
    const priceFilter = document.getElementById('priceFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    priceFilter.addEventListener('change', filterAndSearchCars);
    availabilityFilter.addEventListener('change', filterAndSearchCars);
    
    // View all button
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            searchInput.value = '';
            priceFilter.value = '';
            availabilityFilter.value = '';
            loadCars();
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Inquiry submitted successfully! We will contact you soon.');
            this.reset();
        });
    }
}

// Initialize modal functionality
function initModals() {
    // Car details modal
    const carModalOverlay = document.getElementById('carModalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            carModalOverlay.classList.remove('active');
        });
    }
    
    // Order modal
    const orderModalOverlay = document.getElementById('orderModalOverlay');
    const orderModalClose = document.getElementById('orderModalClose');
    
    if (orderModalClose) {
        orderModalClose.addEventListener('click', () => {
            orderModalOverlay.classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === carModalOverlay) {
            carModalOverlay.classList.remove('active');
        }
        if (e.target === orderModalOverlay) {
            orderModalOverlay.classList.remove('active');
        }
    });
}

// Load cars from localStorage and display them
function loadCars() {
    const carsGrid = document.getElementById('carsGrid');
    if (!carsGrid) return;
    
    // Get cars from localStorage
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    
    // Clear current grid
    carsGrid.innerHTML = '';
    
    // Display each car
    cars.forEach((car, index) => {
        const carCard = createCarCard(car, index);
        carsGrid.appendChild(carCard);
    });
}

// Create a car card element
function createCarCard(car, index) {
    const carCard = document.createElement('div');
    carCard.className = `car-card ${car.availability === 'Sold' ? 'sold' : ''}`;
    carCard.style.animationDelay = `${index * 0.1}s`;
    
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(car.price);
    
    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage);
    
    carCard.innerHTML = `
        <div class="car-image">
            <img src="${car.images[0]}" alt="${car.name}">
        </div>
        <div class="car-content">
            <div class="car-brand">${car.brand}</div>
            <h3 class="car-title">${car.name}</h3>
            <div class="car-price">${formattedPrice}</div>
            <div class="car-specs">
                <div class="car-spec"><i class="fas fa-calendar-alt"></i> ${car.year}</div>
                <div class="car-spec"><i class="fas fa-tachometer-alt"></i> ${formattedMileage} mi</div>
                <div class="car-spec"><i class="fas fa-gas-pump"></i> ${car.fuel}</div>
                <div class="car-spec"><i class="fas fa-cog"></i> ${car.transmission}</div>
            </div>
            <p class="car-description">${car.shortDesc}</p>
            <div class="car-actions">
                <button class="view-details" data-car-id="${car.id}">View Details</button>
                <button class="order-car" data-car-id="${car.id}" ${car.availability === 'Sold' ? 'disabled' : ''}>
                    ${car.availability === 'Sold' ? 'Sold Out' : 'Order Now'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const viewDetailsBtn = carCard.querySelector('.view-details');
    const orderCarBtn = carCard.querySelector('.order-car');
    
    viewDetailsBtn.addEventListener('click', () => showCarDetails(car.id));
    if (car.availability !== 'Sold') {
        orderCarBtn.addEventListener('click', () => showOrderForm(car.id, car.name));
    }
    
    return carCard;
}

// Filter and search cars based on user input
function filterAndSearchCars(searchTerm = '') {
    const carsGrid = document.getElementById('carsGrid');
    if (!carsGrid) return;
    
    // If searchTerm is an event object (from filter change), get the value from inputs
    if (typeof searchTerm === 'object') {
        const searchInput = document.getElementById('searchInput');
        searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    }
    
    // Get filter values
    const priceFilter = document.getElementById('priceFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    const priceValue = priceFilter ? priceFilter.value : '';
    const availabilityValue = availabilityFilter ? availabilityFilter.value : '';
    
    // Get all cars
    const allCars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    
    // Filter cars
    const filteredCars = allCars.filter(car => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            car.name.toLowerCase().includes(searchTerm) ||
            car.brand.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm);
        
        // Price filter
        let matchesPrice = true;
        if (priceValue) {
            if (priceValue === '500000+') {
                matchesPrice = car.price >= 500000;
            } else {
                const [min, max] = priceValue.split('-').map(Number);
                matchesPrice = car.price >= min && car.price <= max;
            }
        }
        
        // Availability filter
        const matchesAvailability = availabilityValue === '' || car.availability === availabilityValue;
        
        return matchesSearch && matchesPrice && matchesAvailability;
    });
    
    // Clear current grid
    carsGrid.innerHTML = '';
    
    // Display filtered cars
    if (filteredCars.length === 0) {
        carsGrid.innerHTML = `
            <div class="no-cars-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <h3 style="color: var(--primary-gold); margin-bottom: 15px;">No vehicles found</h3>
                <p style="color: var(--medium-gray);">Try adjusting your search or filter criteria</p>
                <button class="btn-secondary" id="resetFilters" style="margin-top: 20px;">Reset Filters</button>
            </div>
        `;
        
        // Add event listener to reset button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('searchInput').value = '';
                if (priceFilter) priceFilter.value = '';
                if (availabilityFilter) availabilityFilter.value = '';
                loadCars();
            });
        }
    } else {
        filteredCars.forEach((car, index) => {
            const carCard = createCarCard(car, index);
            carsGrid.appendChild(carCard);
        });
    }
}

// Show car details in modal
function showCarDetails(carId) {
    const carModalOverlay = document.getElementById('carModalOverlay');
    const carModalContent = document.getElementById('carModalContent');
    
    if (!carModalOverlay || !carModalContent) return;
    
    // Get car data
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    const car = cars.find(c => c.id === carId);
    
    if (!car) return;
    
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(car.price);
    
    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage);
    
    // Create car details HTML
    carModalContent.innerHTML = `
        <div class="car-details">
            <div class="car-details-images">
                <div class="car-details-main-image">
                    <img src="${car.images[0]}" alt="${car.name}" id="mainCarImage">
                </div>
                <div class="car-details-thumbnails">
                    ${car.images.map((img, index) => `
                        <div class="car-details-thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}">
                            <img src="${img}" alt="${car.name}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="car-details-info">
                <div class="car-details-brand">${car.brand}</div>
                <h2>${car.name}</h2>
                <div class="car-details-price">${formattedPrice}</div>
                <div class="car-details-specs">
                    <div class="car-details-spec">
                        <div class="car-details-spec-label">Year</div>
                        <div class="car-details-spec-value">${car.year}</div>
                    </div>
                    <div class="car-details-spec">
                        <div class="car-details-spec-label">Engine</div>
                        <div class="car-details-spec-value">${car.engine}</div>
                    </div>
                    <div class="car-details-spec">
                        <div class="car-details-spec-label">Transmission</div>
                        <div class="car-details-spec-value">${car.transmission}</div>
                    </div>
                    <div class="car-details-spec">
                        <div class="car-details-spec-label">Mileage</div>
                        <div class="car-details-spec-value">${formattedMileage} mi</div>
                    </div>
                    <div class="car-details-spec">
                        <div class="car-details-spec-label">Fuel Type</div>
                        <div class="car-details-spec-value">${car.fuel}</div>
                    </div>
                    <div class="car-details-spec">
                        <div class="car-details-spec-label">Availability</div>
                        <div class="car-details-spec-value" style="color: ${car.availability === 'In Stock' ? '#2ecc71' : '#e74c3c'}">${car.availability}</div>
                    </div>
                </div>
                <div class="car-details-description">
                    <h3>Description</h3>
                    <p>${car.longDesc}</p>
                </div>
                <div class="car-details-actions">
                    <button class="btn-secondary" id="closeCarDetails">Close</button>
                    <button class="btn-primary" id="orderThisCar" ${car.availability === 'Sold' ? 'disabled' : ''}>
                        ${car.availability === 'Sold' ? 'Sold Out' : 'Order This Car'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for image thumbnails
    const thumbnails = carModalContent.querySelectorAll('.car-details-thumbnail');
    const mainImage = carModalContent.getElementById('mainCarImage');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumb.classList.add('active');
            
            // Update main image
            const imageIndex = thumb.getAttribute('data-image-index');
            mainImage.src = car.images[imageIndex];
        });
    });
    
    // Add event listener to close button
    const closeBtn = carModalContent.getElementById('closeCarDetails');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            carModalOverlay.classList.remove('active');
        });
    }
    
    // Add event listener to order button
    const orderBtn = carModalContent.getElementById('orderThisCar');
    if (orderBtn && car.availability !== 'Sold') {
        orderBtn.addEventListener('click', () => {
            carModalOverlay.classList.remove('active');
            showOrderForm(carId, car.name);
        });
    }
    
    // Show modal
    carModalOverlay.classList.add('active');
}

// Show order form modal
function showOrderForm(carId, carName) {
    const orderModalOverlay = document.getElementById('orderModalOverlay');
    const orderCarId = document.getElementById('orderCarId');
    const orderCarName = document.getElementById('orderCarName');
    
    if (!orderModalOverlay || !orderCarId || !orderCarName) return;
    
    // Set car ID and name in form
    orderCarId.value = carId;
    orderCarName.value = carName;
    
    // Add event listener to order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.removeEventListener('submit', handleOrderSubmit); // Remove existing listener
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // Show modal
    orderModalOverlay.classList.add('active');
}

// Handle order form submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const carId = document.getElementById('orderCarId').value;
    const carName = document.getElementById('orderCarName').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value || 'Not provided';
    const customerMessage = document.getElementById('customerMessage').value || 'No message';
    
    // Create order object
    const order = {
        id: Date.now(), // Simple unique ID
        carId: parseInt(carId),
        carName: carName,
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        customerMessage: customerMessage,
        timestamp: new Date().toISOString(),
        status: 'New',
        read: false
    };
    
    // Get existing orders
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    
    // Add new order
    orders.push(order);
    
    // Save to localStorage
    localStorage.setItem('luxuryMotorsOrders', JSON.stringify(orders));
    
    // Close modal
    const orderModalOverlay = document.getElementById('orderModalOverlay');
    orderModalOverlay.classList.remove('active');
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showToast('Order submitted successfully! The owner will contact you soon.');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('successToast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Enhanced Main JavaScript with Animations and Security

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components with page transition
    initPageTransition();
    initNavigation();
    initAnimations();
    initCarData();
    initEventListeners();
    initModals();
    
    // Load initial car data with loading animation
    showLoading();
    setTimeout(() => {
        loadCars();
        hideLoading();
    }, 1000);
});

// Initialize page transition
function initPageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    // Animate in
    setTimeout(() => {
        transition.style.transition = 'transform 0.8s ease';
        transition.style.transform = 'translateY(-100%)';
        
        // Remove after animation completes
        setTimeout(() => {
            transition.remove();
        }, 1000);
    }, 100);
}

// Initialize animations
function initAnimations() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add typewriter effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.classList.add('typewriter');
    }
    
    // Add floating animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(btn => {
        if (!btn.closest('.modal')) { // Don't add to modal buttons
            btn.style.animationDelay = Math.random() * 2 + 's';
        }
    });
    
    // Add pulse to admin button
    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) {
        adminBtn.classList.add('pulse');
    }
}

// Initialize scroll animations for sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Animate child elements with delay
                const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

// Show loading spinner
function showLoading() {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.className = 'loading-spinner';
        document.body.appendChild(spinner);
    }
    spinner.style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Enhanced car card creation with animations
function createCarCard(car, index) {
    const carCard = document.createElement('div');
    carCard.className = `car-card animate-on-scroll ${car.availability === 'Sold' ? 'sold' : ''}`;
    carCard.style.animationDelay = `${index * 0.1}s`;
    
    // Add hover animation class
    if (car.availability !== 'Sold') {
        carCard.classList.add('has-hover-animation');
    }
    
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(car.price);
    
    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage);
    
    carCard.innerHTML = `
        <div class="car-image">
            <img src="${car.images[0]}" alt="${car.name}" loading="lazy">
            ${car.availability === 'In Stock' ? '<div class="available-badge pulse">Available</div>' : ''}
        </div>
        <div class="car-content">
            <div class="car-brand">${car.brand}</div>
            <h3 class="car-title">${car.name}</h3>
            <div class="car-price">${formattedPrice}</div>
            <div class="car-specs">
                <div class="car-spec"><i class="fas fa-calendar-alt"></i> ${car.year}</div>
                <div class="car-spec"><i class="fas fa-tachometer-alt"></i> ${formattedMileage} mi</div>
                <div class="car-spec"><i class="fas fa-gas-pump"></i> ${car.fuel}</div>
                <div class="car-spec"><i class="fas fa-cog"></i> ${car.transmission}</div>
            </div>
            <p class="car-description">${car.shortDesc}</p>
            <div class="car-actions">
                <button class="view-details" data-car-id="${car.id}">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="order-car" data-car-id="${car.id}" ${car.availability === 'Sold' ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${car.availability === 'Sold' ? 'Sold Out' : 'Order Now'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons with animation
    const viewDetailsBtn = carCard.querySelector('.view-details');
    const orderCarBtn = carCard.querySelector('.order-car');
    
    viewDetailsBtn.addEventListener('click', (e) => {
        animateButtonClick(e.target);
        setTimeout(() => showCarDetails(car.id), 300);
    });
    
    if (car.availability !== 'Sold') {
        orderCarBtn.addEventListener('click', (e) => {
            animateButtonClick(e.target);
            setTimeout(() => showOrderForm(car.id, car.name), 300);
        });
    }
    
    return carCard;
}

// Button click animation
function animateButtonClick(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 300);
}

// Enhanced showCarDetails with image gallery animations
function showCarDetails(carId) {
    const carModalOverlay = document.getElementById('carModalOverlay');
    const carModalContent = document.getElementById('carModalContent');
    
    if (!carModalOverlay || !carModalContent) return;
    
    // Add entrance animation
    carModalOverlay.style.opacity = '0';
    carModalOverlay.classList.add('active');
    
    // Animate in
    setTimeout(() => {
        carModalOverlay.style.transition = 'opacity 0.3s ease';
        carModalOverlay.style.opacity = '1';
    }, 10);
    
    // Get car data
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    const car = cars.find(c => c.id === carId);
    
    if (!car) return;
    
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(car.price);
    
    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage);
    
    // Create car details HTML with animation classes
    carModalContent.innerHTML = `
        <div class="car-details">
            <div class="car-details-images">
                <div class="car-details-main-image animate-on-scroll">
                    <img src="${car.images[0]}" alt="${car.name}" id="mainCarImage" class="zoomable">
                    <div class="image-overlay">
                        <button class="zoom-btn" id="zoomImage"><i class="fas fa-search-plus"></i></button>
                    </div>
                </div>
                <div class="car-details-thumbnails">
                    ${car.images.map((img, index) => `
                        <div class="car-details-thumbnail animate-on-scroll ${index === 0 ? 'active' : ''}" 
                             data-image-index="${index}"
                             style="animation-delay: ${index * 0.1}s">
                            <img src="${img}" alt="${car.name}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="car-details-info">
                <div class="car-details-brand animate-on-scroll">${car.brand}</div>
                <h2 class="animate-on-scroll">${car.name}</h2>
                <div class="car-details-price animate-on-scroll">${formattedPrice}</div>
                <div class="car-details-specs">
                    ${['Year', 'Engine', 'Transmission', 'Mileage', 'Fuel Type', 'Availability'].map((label, i) => {
                        let value;
                        switch(label) {
                            case 'Year': value = car.year; break;
                            case 'Engine': value = car.engine; break;
                            case 'Transmission': value = car.transmission; break;
                            case 'Mileage': value = `${formattedMileage} mi`; break;
                            case 'Fuel Type': value = car.fuel; break;
                            case 'Availability': 
                                value = car.availability;
                                const color = car.availability === 'In Stock' ? '#2ecc71' : '#e74c3c';
                                return `
                                    <div class="car-details-spec animate-on-scroll" style="animation-delay: ${i * 0.1}s">
                                        <div class="car-details-spec-label">${label}</div>
                                        <div class="car-details-spec-value" style="color: ${color}">${value}</div>
                                    </div>
                                `;
                        }
                        return `
                            <div class="car-details-spec animate-on-scroll" style="animation-delay: ${i * 0.1}s">
                                <div class="car-details-spec-label">${label}</div>
                                <div class="car-details-spec-value">${value}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="car-details-description">
                    <h3 class="animate-on-scroll">Description</h3>
                    <p class="animate-on-scroll">${car.longDesc}</p>
                </div>
                <div class="car-details-actions">
                    <button class="btn-secondary animate-on-scroll" id="closeCarDetails">Close</button>
                    <button class="btn-primary animate-on-scroll gradient-border" id="orderThisCar" ${car.availability === 'Sold' ? 'disabled' : ''}>
                        ${car.availability === 'Sold' ? 'Sold Out' : 'Order This Car'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add animation to child elements
    setTimeout(() => {
        const animatedElements = carModalContent.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 50);
        });
    }, 100);
    
    // Add event listeners for image thumbnails with animation
    const thumbnails = carModalContent.querySelectorAll('.car-details-thumbnail');
    const mainImage = carModalContent.getElementById('mainCarImage');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Add click animation
            thumb.classList.add('clicked');
            setTimeout(() => thumb.classList.remove('clicked'), 300);
            
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumb.classList.add('active');
            
            // Update main image with fade transition
            mainImage.style.opacity = '0';
            setTimeout(() => {
                const imageIndex = thumb.getAttribute('data-image-index');
                mainImage.src = car.images[imageIndex];
                mainImage.style.opacity = '1';
            }, 200);
        });
    });
    
    // Zoom functionality
    const zoomBtn = carModalContent.getElementById('zoomImage');
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            mainImage.classList.toggle('zoomed');
            zoomBtn.innerHTML = mainImage.classList.contains('zoomed') 
                ? '<i class="fas fa-search-minus"></i>' 
                : '<i class="fas fa-search-plus"></i>';
        });
    }
    
    // Add event listener to close button
    const closeBtn = carModalContent.getElementById('closeCarDetails');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            carModalOverlay.style.opacity = '0';
            setTimeout(() => {
                carModalOverlay.classList.remove('active');
            }, 300);
        });
    }
    
    // Add event listener to order button
    const orderBtn = carModalContent.getElementById('orderThisCar');
    if (orderBtn && car.availability !== 'Sold') {
        orderBtn.addEventListener('click', () => {
            animateButtonClick(orderBtn);
            setTimeout(() => {
                carModalOverlay.style.opacity = '0';
                setTimeout(() => {
                    carModalOverlay.classList.remove('active');
                    showOrderForm(carId, car.name);
                }, 300);
            }, 300);
        });
    }
}

// Enhanced showToast with better animation
function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Set message and type
    toastMessage.textContent = message;
    
    // Change icon based on type
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle toast-icon';
        toast.style.backgroundColor = '#e74c3c';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle toast-icon';
        toast.style.backgroundColor = '#f39c12';
    } else {
        toastIcon.className = 'fas fa-check-circle toast-icon';
        toast.style.backgroundColor = '#2ecc71';
    }
    
    // Show with animation
    toast.classList.add('show');
    toast.style.animation = 'slideInRight 0.5s ease-out';
    
    // Hide after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => {
            toast.classList.remove('show');
            toast.style.animation = '';
        }, 500);
    }, 5000);
}

// Add to the existing CSS for new animations
const additionalAnimations = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(100%);
    }
}

.available-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #2ecc71;
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2;
}

.zoomable {
    cursor: zoom-in;
    transition: transform 0.3s ease;
}

.zoomable.zoomed {
    transform: scale(1.5);
    cursor: zoom-out;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.car-details-main-image:hover .image-overlay {
    opacity: 1;
}

.zoom-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    color: #333;
    transition: transform 0.3s ease;
}

.zoom-btn:hover {
    transform: scale(1.1);
}

.clicked {
    animation: buttonClick 0.3s ease;
}

@keyframes buttonClick {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.95);
    }
    100% {
        transform: scale(1);
    }
}

.has-hover-animation:hover {
    animation: cardHover 0.3s ease-out forwards;
}
`;

// Add additional animations to CSS
const additionalStyleSheet = document.createElement("style");
additionalStyleSheet.textContent = additionalAnimations;
document.head.appendChild(additionalStyleSheet);

// Test Drive Form Handling
function initTestDriveForm() {
    const testDriveForm = document.getElementById('testDriveForm');
    if (!testDriveForm) return;
    
    // Set minimum date to today
    const dateInput = document.getElementById('testDriveDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default to 2 days from today
        const twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);
        dateInput.value = twoDaysLater.toISOString().split('T')[0];
    }
    
    // Form submission
    testDriveForm.addEventListener('submit', handleTestDriveSubmit);
    
    // Form validation
    const phoneInput = document.getElementById('testDrivePhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumberInput);
    }
}

// Handle test drive submission
function handleTestDriveSubmit(e) {
    e.preventDefault();
    
    console.log('Test drive form submitted');
    
    // Get form values
    const formData = {
        name: document.getElementById('testDriveName').value.trim(),
        phone: document.getElementById('testDrivePhone').value.trim(),
        email: document.getElementById('testDriveEmail').value.trim(),
        carInterest: document.getElementById('testDriveCar').value,
        preferredDate: document.getElementById('testDriveDate').value,
        preferredTime: document.getElementById('testDriveTime').value,
        message: document.getElementById('testDriveMessage').value.trim(),
        type: 'test_drive',
        timestamp: new Date().toISOString(),
        status: 'pending',
        read: false,
        id: Date.now()
    };
    
    console.log('Form data:', formData);
    
    // Show loading state
    const submitBtn = document.getElementById('submitTestDrive');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    btnText.textContent = 'Scheduling...';
    btnSpinner.style.display = 'block';
    submitBtn.disabled = true;
    
    // Validate phone number
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showFormError('Please enter a valid 10-digit phone number');
        resetButtonState();
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormError('Please enter a valid email address');
        resetButtonState();
        return;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showFormError('Please select a future date for your test drive');
        resetButtonState();
        return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
        try {
            // Save test drive request
            saveTestDriveRequest(formData);
            
            // Send notification to admin
            sendAdminNotification(formData);
            
            // Show success message
            showTestDriveSuccess(formData);
            
            // Reset form
            resetTestDriveForm();
            resetButtonState();
            
            console.log('Test drive request completed successfully');
        } catch (error) {
            console.error('Error submitting test drive:', error);
            showFormError('An error occurred. Please try again.');
            resetButtonState();
        }
    }, 1500);
    
    function resetButtonState() {
        btnText.textContent = 'Schedule Test Drive';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Format phone number as user types
function formatPhoneNumberInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substring(0, 10);
    
    if (value.length >= 6) {
        value = `(${value.substring(0,3)}) ${value.substring(3,6)}-${value.substring(6)}`;
    } else if (value.length >= 3) {
        value = `(${value.substring(0,3)}) ${value.substring(3)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    
    e.target.value = value;
}

// Handle test drive submission
function handleTestDriveSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('testDriveName').value.trim(),
        phone: document.getElementById('testDrivePhone').value.trim(),
        email: document.getElementById('testDriveEmail').value.trim(),
        carInterest: document.getElementById('testDriveCar').value,
        preferredDate: document.getElementById('testDriveDate').value,
        preferredTime: document.getElementById('testDriveTime').value,
        message: document.getElementById('testDriveMessage').value.trim(),
        type: 'test_drive',
        timestamp: new Date().toISOString(),
        status: 'pending',
        read: false,
        id: Date.now()
    };
    
    // Show loading state
    const submitBtn = document.getElementById('submitTestDrive');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    btnText.textContent = 'Scheduling...';
    btnSpinner.style.display = 'block';
    submitBtn.disabled = true;
    
    // Validate phone number
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showFormError('Please enter a valid 10-digit phone number');
        resetButtonState();
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormError('Please enter a valid email address');
        resetButtonState();
        return;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showFormError('Please select a future date for your test drive');
        resetButtonState();
        return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
        // Save test drive request
        saveTestDriveRequest(formData);
        
        // Send notification to admin
        sendAdminNotification(formData);
        
        // Show success message
        showTestDriveSuccess(formData);
        
        // Reset form
        resetTestDriveForm();
        resetButtonState();
    }, 1500);
    
    function resetButtonState() {
        btnText.textContent = 'Schedule Test Drive';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Show form error
function showFormError(message) {
    // Create error toast
    const errorToast = document.createElement('div');
    errorToast.className = 'error-toast';
    errorToast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; 
             padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
             z-index: 9998; animation: slideInRight 0.5s ease-out; max-width: 300px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <i class="fas fa-exclamation-circle"></i>
                <strong>Error</strong>
            </div>
            <p style="margin: 0; font-size: 0.9rem;">${message}</p>
        </div>
    `;
    
    document.body.appendChild(errorToast);
    
    setTimeout(() => {
        errorToast.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => errorToast.remove(), 500);
    }, 5000);
}

// Save test drive request to localStorage
function saveTestDriveRequest(data) {
    // Get existing test drives
    let testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    
    // Add new test drive
    testDrives.push(data);
    
    // Save to localStorage
    localStorage.setItem('luxuryMotorsTestDrives', JSON.stringify(testDrives));
    
    // Also save to general inquiries for admin panel
    let inquiries = JSON.parse(localStorage.getItem('luxuryMotorsInquiries')) || [];
    inquiries.push({
        ...data,
        id: Date.now(),
        notificationType: 'test_drive'
    });
    localStorage.setItem('luxuryMotorsInquiries', JSON.stringify(inquiries));
}

// Send notification to admin
function sendAdminNotification(data) {
    // Get existing notifications
    let notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    
    // Create notification
    const notification = {
        id: Date.now(),
        type: 'test_drive',
        title: 'New Test Drive Request',
        message: `${data.name} wants to test drive a ${data.carInterest}`,
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email,
        carInterest: data.carInterest,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high'
    };


    // Send notification to admin
function sendAdminNotification(data) {
    // Get existing notifications
    let notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    
    // Create notification
    const notification = {
       // id: Date.now(),
       // type: 'test_drive',
        //title: 'New Test Drive Request',
       // message: `${data.name} wants to test drive a ${data.carInterest}`,
       // customerName: data.name,
       // customerPhone: data.phone,
       // customerEmail: data.email,
       // carInterest: data.carInterest,
        //preferredDate: data.preferredDate,
       // preferredTime: data.preferredTime,
        //customerMessage: data.message,
       // timestamp: new Date().toISOString(),
       // read: false,
        //priority: 'high',
        //source: 'test_drive_form'
    };
    
    // Add notification to beginning of array (newest first)
    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
    }
    
    // Save notifications
    localStorage.setItem('luxuryMotorsNotifications', JSON.stringify(notifications));
    
    // Also save to test drives collection
    saveTestDriveToCollection(data);
    
    // Update admin badge count
    updateAdminNotificationBadge();
    
    console.log('Test drive notification sent to admin:', notification);
}

// Save test drive to separate collection
function saveTestDriveToCollection(data) {
    // Get existing test drives
    let testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    
    // Create test drive object
    const testDrive = {
        id: Date.now(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        carInterest: data.carInterest,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        message: data.message,
        status: 'pending',
        read: false,
        timestamp: new Date().toISOString(),
        notificationId: Date.now() + 1 // Link to notification
    };
    
    // Add to beginning of array
    testDrives.unshift(testDrive);
    
    // Keep only last 200 test drives
    if (testDrives.length > 200) {
        testDrives = testDrives.slice(0, 200);
    }
    
    // Save test drives
    localStorage.setItem('luxuryMotorsTestDrives', JSON.stringify(testDrives));
    
    console.log('Test drive saved to collection:', testDrive);
}

// Update admin notification badge
function updateAdminNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Store in localStorage for admin panel to access
    localStorage.setItem('luxuryMotorsUnreadNotifications', unreadCount.toString());
    
    // If admin panel is open in another tab, trigger update
    try {
        // Broadcast to other tabs using localStorage event
        localStorage.setItem('luxuryMotorsLastUpdate', Date.now().toString());
    } catch (e) {
        console.log('Could not broadcast update:', e);
    }
    
    console.log('Unread notifications:', unreadCount);
}
    
    // Add notification
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    // Save notifications
    localStorage.setItem('luxuryMotorsNotifications', JSON.stringify(notifications));
    
    // Update admin badge count
    updateAdminNotificationBadge();
}

// Update admin notification badge
function updateAdminNotificationBadge() {
    // This will be used by admin panel
    const notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Store count for admin panel to access
    localStorage.setItem('luxuryMotorsUnreadNotifications', unreadCount.toString());
    
    // If admin page is open, trigger update
    if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
    }
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.getElementById('orderNotificationBadge');
    if (!badge) return;
    
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const newOrders = orders.filter(order => !order.read).length;
    
    const testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    const newTestDrives = testDrives.filter(td => !td.read).length;
    
    const totalNew = newOrders + newTestDrives;
    
    if (totalNew > 0) {
        badge.textContent = totalNew;
        badge.style.display = 'inline-block';
        
        // Add pulse animation
        badge.classList.add('pulse');
    } else {
        badge.style.display = 'none';
        badge.classList.remove('pulse');
    }
}
// Show test drive success modal
function showTestDriveSuccess(data) {
    // Format date for display
    const date = new Date(data.preferredDate);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Format phone for display
    const formattedPhone = data.phone;
    
    // Create success modal
    const modalHTML = `
        <div class="test-drive-success">
            <i class="fas fa-check-circle"></i>
            <h3>Test Drive Scheduled Successfully!</h3>
            <p>We have received your test drive request. Our team will contact you within 1 hour to confirm your appointment.</p>
            
            <div class="test-drive-details">
                <div class="test-drive-detail">
                    <strong>Name:</strong>
                    <span>${data.name}</span>
                </div>
                <div class="test-drive-detail">
                    <strong>Phone:</strong>
                    <span>${formattedPhone}</span>
                </div>
                <div class="test-drive-detail">
                    <strong>Car:</strong>
                    <span>${data.carInterest}</span>
                </div>
                <div class="test-drive-detail">
                    <strong>Date:</strong>
                    <span>${formattedDate}</span>
                </div>
                <div class="test-drive-detail">
                    <strong>Time:</strong>
                    <span>${data.preferredTime}</span>
                </div>
            </div>
            
            <p style="font-size: 0.9rem; color: var(--primary-gold);">
                <i class="fas fa-clock"></i> Please keep your phone available for our call.
            </p>
            
            <button class="btn-primary" id="closeTestDriveSuccess" style="margin-top: 20px;">
                Done
            </button>
        </div>
    `;
    
    // Create modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay active';
    modalOverlay.id = 'testDriveSuccessOverlay';
    modalOverlay.innerHTML = `
        <div class="modal" style="max-width: 500px;">
            <button class="modal-close" id="closeTestDriveModal">&times;</button>
            <div class="modal-content">
                ${modalHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    document.getElementById('closeTestDriveModal').addEventListener('click', closeTestDriveSuccess);
    document.getElementById('closeTestDriveSuccess').addEventListener('click', closeTestDriveSuccess);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeTestDriveSuccess();
        }
    });
}

// Close test drive success modal
function closeTestDriveSuccess() {
    const modal = document.getElementById('testDriveSuccessOverlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Reset test drive form
function resetTestDriveForm() {
    const form = document.getElementById('testDriveForm');
    if (form) {
        form.reset();
        
        // Reset date to 2 days from today
        const dateInput = document.getElementById('testDriveDate');
        if (dateInput) {
            const twoDaysLater = new Date();
            twoDaysLater.setDate(twoDaysLater.getDate() + 2);
            dateInput.value = twoDaysLater.toISOString().split('T')[0];
        }
    }
}

// Initialize test drive form
document.addEventListener('DOMContentLoaded', function() {
    initTestDriveForm();
});

// Add this to showToast function
function showToast(message, type = 'success') {
    // ... existing code ...
    
    // Also trigger admin notification update if admin page is open
    if (typeof updateNotifications === 'function') {
        setTimeout(updateNotifications, 1000);
    }
}

// Simple Test Drive Form Handler
function initTestDriveForm() {
    const testDriveForm = document.getElementById('testDriveForm');
    if (!testDriveForm) return;
    
    testDriveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const testDriveData = {
            id: Date.now(),
            name: document.getElementById('testDriveName').value.trim(),
            phone: document.getElementById('testDrivePhone').value.trim(),
            email: document.getElementById('testDriveEmail').value.trim(),
            car: document.getElementById('testDriveCar').value,
            date: document.getElementById('testDriveDate').value,
            time: document.getElementById('testDriveTime').value,
            message: document.getElementById('testDriveMessage').value.trim(),
            status: 'New',
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Save to localStorage
        saveTestDrive(testDriveData);
        
        // Show success message
        showToast('Test drive scheduled! Admin will contact you soon.', 'success');
        
        // Reset form
        testDriveForm.reset();
        
        // Set default date to 2 days from now
        const dateInput = document.getElementById('testDriveDate');
        if (dateInput) {
            const twoDaysLater = new Date();
            twoDaysLater.setDate(twoDaysLater.getDate() + 2);
            dateInput.value = twoDaysLater.toISOString().split('T')[0];
        }
    });
    
    // Set default date
    const dateInput = document.getElementById('testDriveDate');
    if (dateInput) {
        const twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);
        dateInput.value = twoDaysLater.toISOString().split('T')[0];
    }
}

// Save test drive to localStorage
function saveTestDrive(data) {
    // Get existing test drives
    let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Add new test drive
    testDrives.push(data);
    
    // Save back to localStorage
    localStorage.setItem('testDrives', JSON.stringify(testDrives));
    
    // Also add to admin notifications
    addAdminNotification(data);
    
    console.log('Test drive saved:', data);
}

// Add notification for admin
function addAdminNotification(testDrive) {
    // Get existing notifications
    let notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    
    // Create notification
    const notification = {
        id: Date.now(),
        type: 'test_drive',
        title: 'New Test Drive Request',
        message: `${testDrive.name} wants to test drive ${testDrive.car}`,
        customerName: testDrive.name,
        customerPhone: testDrive.phone,
        details: testDrive,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Add to notifications
    notifications.push(notification);
    
    // Save notifications
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    console.log('Admin notification added:', notification);
}

// Simple Test Drive Form Handler with Confirmation
function initTestDriveForm() {
    const testDriveForm = document.getElementById('testDriveForm');
    if (!testDriveForm) return;
    
    testDriveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const testDriveData = {
            id: Date.now(),
            name: document.getElementById('testDriveName').value.trim(),
            phone: document.getElementById('testDrivePhone').value.trim(),
            email: document.getElementById('testDriveEmail').value.trim(),
            car: document.getElementById('testDriveCar').value,
            date: document.getElementById('testDriveDate').value,
            time: document.getElementById('testDriveTime').value,
            message: document.getElementById('testDriveMessage').value.trim(),
            status: 'New',
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Validate required fields
        if (!testDriveData.name || !testDriveData.phone || !testDriveData.email) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }
        
        // Show loading state
        showFormMessage('Submitting your request...', 'loading');
        
        // Simulate submission delay
        setTimeout(() => {
            // Save to localStorage
            saveTestDrive(testDriveData);
            
            // Show success message
            showFormMessage('Test drive scheduled successfully! We will contact you soon.', 'success');
            
            // Reset form
            testDriveForm.reset();
            
            // Set default date to 2 days from now
            const dateInput = document.getElementById('testDriveDate');
            if (dateInput) {
                const twoDaysLater = new Date();
                twoDaysLater.setDate(twoDaysLater.getDate() + 2);
                dateInput.value = twoDaysLater.toISOString().split('T')[0];
            }
            
            // Remove message after 5 seconds
            setTimeout(() => {
                clearFormMessage();
            }, 5000);
            
        }, 1500); // 1.5 second delay
    });
    
    // Set default date
    const dateInput = document.getElementById('testDriveDate');
    if (dateInput) {
        const twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);
        dateInput.value = twoDaysLater.toISOString().split('T')[0];
    }
}

// Show form message
function showFormMessage(message, type = 'info') {
    // Remove existing message
    clearFormMessage();
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'formMessage';
    
    // Set styles based on type
    let backgroundColor, icon, color;
    
    switch(type) {
        case 'success':
            backgroundColor = '#2ecc71';
            icon = '✓';
            color = 'white';
            break;
        case 'error':
            backgroundColor = '#e74c3c';
            icon = '✗';
            color = 'white';
            break;
        case 'loading':
            backgroundColor = '#3498db';
            icon = '⏳';
            color = 'white';
            break;
        default:
            backgroundColor = '#f39c12';
            icon = 'ℹ';
            color = 'black';
    }
    
    messageDiv.innerHTML = `
        <div style="
            background: ${backgroundColor};
            color: ${color};
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        ">
            <span style="
                font-size: 1.2rem;
                font-weight: bold;
            ">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    // Insert after the form title or before the form
    const form = document.getElementById('testDriveForm');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    }
}

// Clear form message
function clearFormMessage() {
    const existingMessage = document.getElementById('formMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Save test drive to localStorage
function saveTestDrive(data) {
    // Get existing test drives
    let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Add new test drive
    testDrives.push(data);
    
    // Save back to localStorage
    localStorage.setItem('testDrives', JSON.stringify(testDrives));
    
    // Also add to admin notifications
    addAdminNotification(data);
    
    console.log('Test drive saved:', data);
}

// Add notification for admin
function addAdminNotification(testDrive) {
    // Get existing notifications
    let notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    
    // Create notification
    const notification = {
        id: Date.now(),
        type: 'test_drive',
        title: 'New Test Drive Request',
        message: `${testDrive.name} wants to test drive ${testDrive.car}`,
        customerName: testDrive.name,
        customerPhone: testDrive.phone,
        details: testDrive,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Add to notifications
    notifications.push(notification);
    
    // Save notifications
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    console.log('Admin notification added:', notification);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initTestDriveForm();
});

// Better delete confirmation
function showDeleteConfirmation(id, name, car) {
    const confirmationHTML = `
        <div class="delete-confirmation" id="deleteConfirmation">
            <div class="confirmation-box">
                <h3><i class="fas fa-exclamation-triangle"></i> Delete Test Drive Request</h3>
                <p>Are you sure you want to delete the test drive request from <strong>${name}</strong> for <strong>${car}</strong>?</p>
                <p style="color: #e74c3c; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> This action cannot be undone.
                </p>
                <div class="confirmation-buttons">
                    <button class="confirm-delete" onclick="confirmDelete(${id})">
                        <i class="fas fa-trash"></i> Yes, Delete
                    </button>
                    <button class="cancel-delete" onclick="cancelDelete()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
}

function confirmDelete(id) {
    const confirmation = document.getElementById('deleteConfirmation');
    if (confirmation) confirmation.remove();
    deleteTestDrive(id);
}

function cancelDelete() {
    const confirmation = document.getElementById('deleteConfirmation');
    if (confirmation) confirmation.remove();
}

// Update the delete button to use better confirmation
// In the table row, change the delete button to:
// <button class="action-btn delete-btn" onclick="showDeleteConfirmation(${drive.id}, '${drive.name}', '${drive.car}')" title="Delete Request">

// Simple test drive submission
function handleTestDriveSubmit(e) {
    e.preventDefault();
    
    const testDriveData = {
        id: Date.now(), // Important: Each needs a unique ID
        name: document.getElementById('testDriveName').value,
        phone: document.getElementById('testDrivePhone').value,
        email: document.getElementById('testDriveEmail').value,
        car: document.getElementById('testDriveCar').value,
        date: document.getElementById('testDriveDate').value,
        time: document.getElementById('testDriveTime').value,
        message: document.getElementById('testDriveMessage').value,
        status: "New",
        timestamp: new Date().toISOString()
    };
    
    // Get existing test drives
    let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Add new test drive
    testDrives.push(testDriveData);
    
    // Save to localStorage
    localStorage.setItem('testDrives', JSON.stringify(testDrives));
    
    // Show success message
    alert('Test drive scheduled! Admin will contact you.');
    
    // Reset form
    e.target.reset();
    
    console.log('Test drive saved:', testDriveData);
}