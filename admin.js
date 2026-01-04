// Admin JavaScript for Luxury Motors Admin Dashboard

// Initialize the admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin components
    initAdminNavigation();
    loadDashboardStats();
    loadOrders();
    loadCarsTable();
    initCarForm();
    initEventListeners();
    
    // Update notification badge
    updateNotificationBadge();
});

// Listen for new test drive submissions
function setupTestDriveListener() {
    // Listen for localStorage changes from main site
    window.addEventListener('storage', function(e) {
        if (e.key === 'luxuryMotorsLastUpdate' || 
            e.key === 'luxuryMotorsNotifications' || 
            e.key === 'luxuryMotorsTestDrives') {
            console.log('Storage updated:', e.key);
            
            // Refresh the relevant sections
            if (typeof loadDashboardStats === 'function') {
                loadDashboardStats();
            }
            if (typeof loadTestDrives === 'function') {
                loadTestDrives();
            }
            if (typeof updateNotificationBadge === 'function') {
                updateNotificationBadge();
            }
            
            // Show notification toast
            showAdminToast('New test drive request received!', 'success');
        }
    });
    
    // Also check periodically for new data
    setInterval(checkForNewTestDrives, 5000);
}

// Check for new test drives
function checkForNewTestDrives() {
    const testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    const notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    
    const unreadTestDrives = testDrives.filter(td => !td.read).length;
    const unreadNotifications = notifications.filter(n => !n.read).length;
    
    // Update badge if needed
    updateNotificationBadge();
    
    // Update dashboard stats
    if (typeof loadDashboardStats === 'function') {
        loadDashboardStats();
    }
}

// Load test drives into table
function loadTestDrives() {
    const tableBody = document.getElementById('testDrivesTableBody');
    const noTestDrivesMessage = document.getElementById('noTestDrivesMessage');
    
    if (!tableBody) {
        console.log('Test drives table body not found');
        return;
    }
    
    // Get test drives data
    let testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    
    console.log('Loading test drives:', testDrives.length);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Show/hide no test drives message
    if (testDrives.length === 0) {
        if (noTestDrivesMessage) noTestDrivesMessage.style.display = 'block';
        return;
    } else {
        if (noTestDrivesMessage) noTestDrivesMessage.style.display = 'none';
    }
    
    // Sort by date (newest first)
    testDrives.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Add test drives to table
    testDrives.forEach((request, index) => {
        const row = document.createElement('tr');
        
        // Mark as unread if not read
        if (!request.read) {
            row.classList.add('unread-test-drive');
            row.style.backgroundColor = 'rgba(255, 179, 71, 0.05)';
        }
        
        // Format date
        let formattedDate = 'N/A';
        try {
            const requestDate = new Date(request.preferredDate);
            formattedDate = requestDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            console.log('Error formatting date:', e);
        }
        
        // Format phone (mask for privacy)
        const formattedPhone = maskPhoneNumber(request.phone || '');
        
        // Ensure all required fields exist
        const name = request.name || 'Unknown';
        const email = request.email || 'No email';
        const carInterest = request.carInterest || 'Not specified';
        const preferredTime = request.preferredTime || 'Not specified';
        const status = request.status || 'pending';
        
        row.innerHTML = `
            <td>
                <div class="customer-info">
                    <strong>${name}</strong>
                    <div class="customer-email" style="font-size: 0.85rem; color: #888;">${email}</div>
                </div>
            </td>
            <td>${formattedPhone}</td>
            <td>${carInterest}</td>
            <td>${formattedDate}</td>
            <td>${preferredTime}</td>
            <td><span class="test-drive-status ${status}">${status}</span></td>
            <td>
                <button class="action-btn view-test-drive" data-request-id="${request.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn call-customer" data-phone="${request.phone || ''}">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="action-btn delete-test-drive" data-request-id="${request.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners
    addTestDriveEventListeners();
    
    console.log('Test drives table loaded with', testDrives.length, 'entries');
}

// Add event listeners to test drive table
function addTestDriveEventListeners() {
    document.querySelectorAll('.view-test-drive').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = parseInt(this.getAttribute('data-request-id'));
            console.log('Viewing test drive:', requestId);
            viewTestDriveDetails(requestId);
        });
    });
    
    document.querySelectorAll('.call-customer').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone').replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                window.open(`tel:${phone}`, '_blank');
            } else {
                showAdminToast('Invalid phone number', 'error');
            }
        });
    });
    
    document.querySelectorAll('.delete-test-drive').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = parseInt(this.getAttribute('data-request-id'));
            console.log('Deleting test drive:', requestId);
            deleteTestDriveRequest(requestId);
        });
    });
}

function loadTestDrives() {
    const tableBody = document.getElementById('testDrivesTableBody');
    if (!tableBody) return;
    
    // Get test drives from localStorage
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (testDrives.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    No test drive requests yet
                </td>
            </tr>
        `;
        return;
    }
    
    // Display test drives (newest first)
    testDrives.slice().reverse().forEach(drive => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(drive.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        row.innerHTML = `
            <td>${drive.name}</td>
            <td>${drive.phone}</td>
            <td>${drive.car}</td>
            <td>${formattedDate}</td>
            <td>${drive.time}</td>
            <td>${drive.status || 'New'}</td>
            <td>
                <button class="action-btn" onclick="deleteTestDrive(${drive.id})" style="background: #e74c3c;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Delete test drive function
function deleteTestDrive(id) {
    // Show confirmation
    if (confirm('Delete this test drive request?')) {
        // Get current test drives
        let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
        
        // Remove the one with matching id
        testDrives = testDrives.filter(drive => drive.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('testDrives', JSON.stringify(testDrives));
        
        // Reload the table
        loadTestDrives();
        
        // Show message
        alert('Test drive request deleted!');
        
        // Update dashboard stats
        if (typeof loadDashboardStats === 'function') {
            loadDashboardStats();
        }
    }
}

// Enhanced updateNotificationBadge function
function updateNotificationBadge() {
    const badge = document.getElementById('orderNotificationBadge');
    if (!badge) return;
    
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    const notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    
    const newOrders = orders.filter(order => !order.read).length;
    const newTestDrives = testDrives.filter(td => !td.read).length;
    const newNotifications = notifications.filter(n => !n.read).length;
    
    // Calculate total new items
    const totalNew = newOrders + newTestDrives + newNotifications;
    
    if (totalNew > 0) {
        badge.textContent = totalNew;
        badge.style.display = 'inline-block';
        
        // Add pulse animation
        badge.classList.add('pulse');
        
        // Update badge title
        badge.title = `${newOrders} new orders, ${newTestDrives} new test drives`;
    } else {
        badge.style.display = 'none';
        badge.classList.remove('pulse');
    }
    
    console.log('Notification badge updated:', { totalNew, newOrders, newTestDrives, newNotifications });
}

// Initialize admin navigation
function initAdminNavigation() {
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
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

// Load dashboard statistics
function loadDashboardStats() {
    // Get cars data
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    
    // Calculate stats
    const totalCars = cars.length;
    const availableCars = cars.filter(car => car.availability === 'In Stock').length;
    const totalOrders = orders.length;
    const newOrders = orders.filter(order => !order.read).length;
    
    // Update DOM elements
    document.getElementById('totalCars').textContent = totalCars;
    document.getElementById('availableCars').textContent = availableCars;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('newOrders').textContent = newOrders;
}

// Load dashboard statistics
function loadDashboardStats() {
    // Get cars data
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    
    // Get test drives data
    const testDrives = JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || [];
    
    // Get notifications
    const notifications = JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || [];
    
    // Calculate stats
    const totalCars = cars.length;
    const availableCars = cars.filter(car => car.availability === 'In Stock').length;
    const totalOrders = orders.length;
    const newOrders = orders.filter(order => !order.read).length;
    const totalTestDrives = testDrives.length;
    const pendingTestDrives = testDrives.filter(td => td.status === 'pending' || !td.status).length;
    const unreadNotifications = notifications.filter(n => !n.read).length;
    
    // Update DOM elements
    document.getElementById('totalCars').textContent = totalCars;
    document.getElementById('availableCars').textContent = availableCars;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('newOrders').textContent = newOrders;
    
    // Update notification badge
    updateNotificationBadge();
    
    // Log activity
    logSecurityEvent('dashboard_viewed', { 
        totalCars, 
        availableCars, 
        totalOrders, 
        newOrders,
        totalTestDrives,
        pendingTestDrives
    });
}
// Load orders into the table
function loadOrders() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    if (!ordersTableBody) return;
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    
    // Clear table
    ordersTableBody.innerHTML = '';
    
    // Show/hide no orders message
    if (orders.length === 0) {
        if (noOrdersMessage) noOrdersMessage.style.display = 'block';
        return;
    } else {
        if (noOrdersMessage) noOrdersMessage.style.display = 'none';
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Add orders to table
    orders.forEach(order => {
        const row = document.createElement('tr');
        if (!order.read) {
            row.classList.add('unread-order');
        }
        
        // Format date
        const orderDate = new Date(order.timestamp);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Format phone number
        const formattedPhone = formatPhoneNumber(order.customerPhone);
        
        row.innerHTML = `
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.carName}</td>
            <td>${order.customerName}</td>
            <td>${formattedPhone}</td>
            <td>${formattedDate}</td>
            <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <button class="action-btn view-order" data-order-id="${order.id}"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete-order" data-order-id="${order.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            viewOrderDetails(orderId);
        });
    });
    
    document.querySelectorAll('.delete-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            deleteOrder(orderId);
        });
    });
}

// Load cars into the management table
function loadCarsTable() {
    const carsTableBody = document.getElementById('carsTableBody');
    
    if (!carsTableBody) return;
    
    // Get cars data
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    
    // Clear table
    carsTableBody.innerHTML = '';
    
    // Add cars to table
    cars.forEach(car => {
        const row = document.createElement('tr');
        
        // Format price
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(car.price);
        
        row.innerHTML = `
            <td>
                <div class="car-table-info">
                    <img src="${car.images[0]}" alt="${car.name}" class="car-table-img">
                    <div>
                        <strong>${car.name}</strong>
                        <div class="car-table-model">${car.model}</div>
                    </div>
                </div>
            </td>
            <td>${car.brand}</td>
            <td>${car.year}</td>
            <td>${formattedPrice}</td>
            <td><span class="availability-badge ${car.availability === 'In Stock' ? 'in-stock' : 'sold'}">${car.availability}</span></td>
            <td>
                <button class="action-btn edit-car" data-car-id="${car.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-car" data-car-id="${car.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        carsTableBody.appendChild(row);
    });
    
    // Add event listeners to car buttons
    document.querySelectorAll('.edit-car').forEach(btn => {
        btn.addEventListener('click', function() {
            const carId = parseInt(this.getAttribute('data-car-id'));
            editCar(carId);
        });
    });
    
    document.querySelectorAll('.delete-car').forEach(btn => {
        btn.addEventListener('click', function() {
            const carId = parseInt(this.getAttribute('data-car-id'));
            deleteCar(carId);
        });
    });
}

// Initialize car form functionality
function initCarForm() {
    const carForm = document.getElementById('carForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const shortDescription = document.getElementById('shortDescription');
    
    if (!carForm) return;
    
    // Character count for short description
    if (shortDescription) {
        shortDescription.addEventListener('input', function() {
            const charCount = this.value.length;
            document.getElementById('shortDescChars').textContent = charCount;
        });
    }
    
    // Form submission
    carForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveCar();
    });
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            resetCarForm();
            this.style.display = 'none';
            document.getElementById('formTitle').innerHTML = 'Add <span>New Car</span>';
            document.getElementById('submitCarBtn').textContent = 'Add Car';
        });
    }
    
    // Reset form button
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', resetCarForm);
    }
}

// Initialize admin event listeners
function initEventListeners() {
    // Mark all orders as read
    const markAllReadBtn = document.getElementById('markAllRead');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllOrdersAsRead);
    }
    
    // Refresh cars button
    const refreshCarsBtn = document.getElementById('refreshCars');
    if (refreshCarsBtn) {
        refreshCarsBtn.addEventListener('click', function() {
            loadCarsTable();
            loadDashboardStats();
            showAdminToast('Cars list refreshed');
        });
    }
    
    // Admin search
    const adminSearch = document.getElementById('adminSearch');
    if (adminSearch) {
        adminSearch.addEventListener('input', function() {
            filterCarsTable(this.value);
        });
    }
    
    // Order details modal close button
    const orderDetailsClose = document.getElementById('orderDetailsClose');
    const orderDetailsModalOverlay = document.getElementById('orderDetailsModalOverlay');
    
    if (orderDetailsClose && orderDetailsModalOverlay) {
        orderDetailsClose.addEventListener('click', () => {
            orderDetailsModalOverlay.classList.remove('active');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === orderDetailsModalOverlay) {
                orderDetailsModalOverlay.classList.remove('active');
            }
        });
    }
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.getElementById('orderNotificationBadge');
    if (!badge) return;
    
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const newOrders = orders.filter(order => !order.read).length;
    
    if (newOrders > 0) {
        badge.textContent = newOrders;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// View order details
function viewOrderDetails(orderId) {
    const orderDetailsModalOverlay = document.getElementById('orderDetailsModalOverlay');
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    
    if (!orderDetailsModalOverlay || !orderDetailsContent) return;
    
    // Get order data
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Get car data
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    const car = cars.find(c => c.id === order.carId);
    
    // Format date
    const orderDate = new Date(order.timestamp);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(order.customerPhone);
    
    // Create order details HTML
    orderDetailsContent.innerHTML = `
        <div class="order-details-info">
            <div class="order-detail">
                <strong>Order ID:</strong>
                <span>#${order.id.toString().slice(-6)}</span>
            </div>
            <div class="order-detail">
                <strong>Car Ordered:</strong>
                <span>${order.carName} ${car ? `(${car.year})` : ''}</span>
            </div>
            <div class="order-detail">
                <strong>Customer Name:</strong>
                <span>${order.customerName}</span>
            </div>
            <div class="order-detail">
                <strong>Phone Number:</strong>
                <span><a href="tel:${order.customerPhone}" class="phone-link">${formattedPhone}</a></span>
            </div>
            <div class="order-detail">
                <strong>Email:</strong>
                <span>${order.customerEmail}</span>
            </div>
            <div class="order-detail">
                <strong>Order Date:</strong>
                <span>${formattedDate}</span>
            </div>
            <div class="order-detail">
                <strong>Status:</strong>
                <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-detail full-width">
                <strong>Customer Message:</strong>
                <div class="customer-message">${order.customerMessage}</div>
            </div>
        </div>
        <div class="order-details-actions">
            <button class="btn-primary" id="markAsReadBtn" ${order.read ? 'disabled' : ''}>
                ${order.read ? 'Already Read' : 'Mark as Read'}
            </button>
            <button class="btn-secondary" id="closeOrderDetails">Close</button>
        </div>
    `;
    
    // Mark order as read when viewing
    if (!order.read) {
        markOrderAsRead(orderId);
    }
    
    // Add event listeners
    const markAsReadBtn = orderDetailsContent.getElementById('markAsReadBtn');
    const closeOrderDetailsBtn = orderDetailsContent.getElementById('closeOrderDetails');
    
    if (markAsReadBtn && !order.read) {
        markAsReadBtn.addEventListener('click', () => {
            markOrderAsRead(orderId);
            markAsReadBtn.disabled = true;
            markAsReadBtn.textContent = 'Already Read';
        });
    }
    
    if (closeOrderDetailsBtn) {
        closeOrderDetailsBtn.addEventListener('click', () => {
            orderDetailsModalOverlay.classList.remove('active');
        });
    }
    
    // Show modal
    orderDetailsModalOverlay.classList.add('active');
}

// Delete order
function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
        const filteredOrders = orders.filter(order => order.id !== orderId);
        
        localStorage.setItem('luxuryMotorsOrders', JSON.stringify(filteredOrders));
        
        // Reload orders and update stats
        loadOrders();
        loadDashboardStats();
        updateNotificationBadge();
        
        showAdminToast('Order deleted successfully');
    }
}

// Mark order as read
function markOrderAsRead(orderId) {
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].read = true;
        localStorage.setItem('luxuryMotorsOrders', JSON.stringify(orders));
        
        // Update UI
        updateNotificationBadge();
        loadDashboardStats();
        
        // Update the specific row in the table
        const row = document.querySelector(`tr.unread-order button[data-order-id="${orderId}"]`)?.closest('tr');
        if (row) {
            row.classList.remove('unread-order');
        }
    }
}

// Mark all orders as read
function markAllOrdersAsRead() {
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    
    orders.forEach(order => {
        order.read = true;
    });
    
    localStorage.setItem('luxuryMotorsOrders', JSON.stringify(orders));
    
    // Update UI
    updateNotificationBadge();
    loadDashboardStats();
    loadOrders();
    
    showAdminToast('All orders marked as read');
}

// Edit car
function editCar(carId) {
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    const car = cars.find(c => c.id === carId);
    
    if (!car) return;
    
    // Scroll to form
    document.getElementById('add-car').scrollIntoView({ behavior: 'smooth' });
    
    // Populate form
    document.getElementById('carId').value = car.id;
    document.getElementById('carName').value = car.name;
    document.getElementById('carBrand').value = car.brand;
    document.getElementById('carModel').value = car.model;
    document.getElementById('carYear').value = car.year;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carMileage').value = car.mileage;
    document.getElementById('carEngine').value = car.engine;
    document.getElementById('carTransmission').value = car.transmission;
    document.getElementById('carFuel').value = car.fuel;
    document.getElementById('carAvailability').value = car.availability;
    document.getElementById('shortDescription').value = car.shortDesc;
    document.getElementById('longDescription').value = car.longDesc;
    document.getElementById('carImages').value = car.images.join('\n');
    
    // Update character count
    const shortDescChars = document.getElementById('shortDescChars');
    if (shortDescChars) {
        shortDescChars.textContent = car.shortDesc.length;
    }
    
    // Update form title and button
    document.getElementById('formTitle').innerHTML = 'Edit <span>Car</span>';
    document.getElementById('submitCarBtn').textContent = 'Update Car';
    
    // Show cancel button
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

// Delete car
function deleteCar(carId) {
    if (confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
        const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
        const filteredCars = cars.filter(car => car.id !== carId);
        
        localStorage.setItem('luxuryMotorsCars', JSON.stringify(filteredCars));
        
        // Reload cars table and update stats
        loadCarsTable();
        loadDashboardStats();
        
        showAdminToast('Car deleted successfully');
    }
}

// Save car (add new or update existing)
function saveCar() {
    // Get form values
    const carId = document.getElementById('carId').value;
    const carName = document.getElementById('carName').value.trim();
    const carBrand = document.getElementById('carBrand').value.trim();
    const carModel = document.getElementById('carModel').value.trim();
    const carYear = parseInt(document.getElementById('carYear').value);
    const carPrice = parseInt(document.getElementById('carPrice').value);
    const carMileage = parseInt(document.getElementById('carMileage').value);
    const carEngine = document.getElementById('carEngine').value.trim();
    const carTransmission = document.getElementById('carTransmission').value;
    const carFuel = document.getElementById('carFuel').value;
    const carAvailability = document.getElementById('carAvailability').value;
    const shortDescription = document.getElementById('shortDescription').value.trim();
    const longDescription = document.getElementById('longDescription').value.trim();
    const carImages = document.getElementById('carImages').value.trim().split('\n').map(url => url.trim()).filter(url => url !== '');
    
    // Validate
    if (carImages.length === 0) {
        alert('Please provide at least one image URL');
        return;
    }
    
    // Get existing cars
    const cars = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    
    if (carId) {
        // Update existing car
        const carIndex = cars.findIndex(car => car.id === parseInt(carId));
        
        if (carIndex !== -1) {
            cars[carIndex] = {
                ...cars[carIndex],
                name: carName,
                brand: carBrand,
                model: carModel,
                year: carYear,
                price: carPrice,
                mileage: carMileage,
                engine: carEngine,
                transmission: carTransmission,
                fuel: carFuel,
                availability: carAvailability,
                shortDesc: shortDescription,
                longDesc: longDescription,
                images: carImages
            };
            
            localStorage.setItem('luxuryMotorsCars', JSON.stringify(cars));
            showAdminToast('Car updated successfully');
        }
    } else {
        // Add new car
        const newCarId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
        
        const newCar = {
            id: newCarId,
            name: carName,
            brand: carBrand,
            model: carModel,
            year: carYear,
            price: carPrice,
            engine: carEngine,
            transmission: carTransmission,
            mileage: carMileage,
            fuel: carFuel,
            shortDesc: shortDescription,
            longDesc: longDescription,
            images: carImages,
            availability: carAvailability,
            featured: false
        };
        
        cars.push(newCar);
        localStorage.setItem('luxuryMotorsCars', JSON.stringify(cars));
        showAdminToast('Car added successfully');
    }
    
    // Reset form
    resetCarForm();
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('formTitle').innerHTML = 'Add <span>New Car</span>';
    document.getElementById('submitCarBtn').textContent = 'Add Car';
    
    // Reload cars table and update stats
    loadCarsTable();
    loadDashboardStats();
}

// Reset car form
function resetCarForm() {
    const carForm = document.getElementById('carForm');
    if (carForm) {
        carForm.reset();
        document.getElementById('carId').value = '';
        document.getElementById('shortDescChars').textContent = '0';
    }
}

// Filter cars table
function filterCarsTable(searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    const rows = document.querySelectorAll('#carsTableBody tr');
    
    rows.forEach(row => {
        const carName = row.querySelector('td:first-child strong')?.textContent.toLowerCase() || '';
        const carBrand = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        
        if (carName.includes(searchTermLower) || carBrand.includes(searchTermLower)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Format phone number
function formatPhoneNumber(phone) {
    // Simple formatting for US numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

// Show admin toast notification
function showAdminToast(message) {
    const toast = document.getElementById('adminToast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add admin-specific styles
const adminStyles = `
/* Admin-specific styles */
.admin-page {
    background-color: #0f0f0f;
}

.admin-header {
    background-color: #0a0a0a;
}

.admin-main {
    padding: 30px 0 60px;
}

.dashboard-stats {
    margin-bottom: 50px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
}

.stat-card {
    background-color: var(--secondary-black);
    border-radius: var(--radius);
    padding: 25px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow);
}

.stat-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--accent-orange), var(--primary-gold));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--primary-black);
}

.stat-content h3 {
    font-size: 2.2rem;
    color: var(--white);
    margin-bottom: 5px;
}

.stat-content p {
    color: var(--medium-gray);
    font-size: 0.9rem;
}

.admin-section {
    margin-bottom: 60px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 15px;
}

.section-actions {
    display: flex;
    gap: 15px;
    align-items: center;
}

.section-actions input {
    padding: 12px 15px;
    background-color: var(--secondary-black);
    border: 1px solid #333;
    border-radius: var(--radius);
    color: var(--white);
    min-width: 250px;
}

.orders-table-container,
.cars-table-container {
    overflow-x: auto;
    background-color: var(--secondary-black);
    border-radius: var(--radius);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.orders-table,
.cars-table {
    width: 100%;
    border-collapse: collapse;
}

.orders-table th,
.cars-table th {
    background-color: #1a1a1a;
    padding: 18px 15px;
    text-align: left;
    font-weight: 600;
    color: var(--primary-gold);
    border-bottom: 1px solid #333;
}

.orders-table td,
.cars-table td {
    padding: 18px 15px;
    border-bottom: 1px solid #333;
    color: var(--white);
}

.orders-table tr:last-child td,
.cars-table tr:last-child td {
    border-bottom: none;
}

.orders-table tr.unread-order {
    background-color: rgba(255, 179, 71, 0.05);
}

.orders-table tr:hover,
.cars-table tr:hover {
    background-color: rgba(255, 255, 255, 0.03);
}

.status-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status-badge.new {
    background-color: rgba(46, 204, 113, 0.2);
    color: #2ecc71;
}

.status-badge.pending {
    background-color: rgba(241, 196, 15, 0.2);
    color: #f1c40f;
}

.status-badge.completed {
    background-color: rgba(52, 152, 219, 0.2);
    color: #3498db;
}

.availability-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.availability-badge.in-stock {
    background-color: rgba(46, 204, 113, 0.2);
    color: #2ecc71;
}

.availability-badge.sold {
    background-color: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
}

.action-btn {
    background: none;
    border: none;
    color: var(--white);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: var(--transition);
}

.action-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.action-btn.edit-car {
    color: #3498db;
}

.action-btn.delete-car,
.action-btn.delete-order {
    color: #e74c3c;
}

.action-btn.view-order {
    color: #2ecc71;
}

.car-table-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.car-table-img {
    width: 60px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.car-table-model {
    font-size: 0.85rem;
    color: var(--medium-gray);
    margin-top: 3px;
}

.no-orders {
    text-align: center;
    padding: 50px 20px;
    background-color: var(--secondary-black);
    border-radius: var(--radius);
    color: var(--medium-gray);
}

.form-container {
    background-color: var(--secondary-black);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--white);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 15px;
    background-color: #333;
    border: 1px solid #444;
    border-radius: var(--radius);
    color: var(--white);
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-gold);
}

.char-count {
    text-align: right;
    font-size: 0.85rem;
    color: var(--medium-gray);
    margin-top: 5px;
}

.form-help {
    font-size: 0.85rem;
    color: var(--medium-gray);
    margin-top: 5px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.order-details-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.order-detail {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #333;
}

.order-detail.full-width {
    flex-direction: column;
    gap: 10px;
}

.order-detail strong {
    color: var(--white);
}

.order-detail span {
    color: var(--medium-gray);
}

.phone-link {
    color: var(--primary-gold);
    text-decoration: none;
}

.phone-link:hover {
    text-decoration: underline;
}

.customer-message {
    background-color: #333;
    padding: 15px;
    border-radius: var(--radius);
    margin-top: 10px;
    color: var(--medium-gray);
}

.order-details-actions {
    display: flex;
    gap: 15px;
}

.admin-badge {
    background-color: var(--primary-gold);
    color: var(--primary-black);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    margin-left: 10px;
    vertical-align: middle;
}

.notification-badge {
    background-color: #e74c3c;
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 5px;
    display: none;
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
        gap: 0;
    }
    
    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .section-actions {
        width: 100%;
    }
    
    .section-actions input {
        min-width: 0;
        flex: 1;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .form-container {
        padding: 25px;
    }
    
    .order-detail {
        flex-direction: column;
        gap: 5px;
    }
}
`;

// Add admin styles to the page
const styleSheet = document.createElement("style");
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

// Enhanced Admin JavaScript with Security Features

// Check authentication before loading admin panel
(function checkAuthentication() {
    const session = localStorage.getItem('luxuryMotorsAdminSession');
    
    if (!session) {
        // No session found, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    const sessionData = JSON.parse(session);
    
    // Check session expiry (1 hour)
    if (Date.now() - sessionData.timestamp > 3600000) {
        // Session expired
        localStorage.removeItem('luxuryMotorsAdminSession');
        window.location.href = 'login.html';
        return;
    }
    
    // Session is valid, continue loading
    initAdminDashboard();
})();

// Initialize admin dashboard after authentication check
function initAdminDashboard() {
    // Add security headers
    addSecurityHeaders();
    
    // Initialize admin components
    initAdminNavigation();
    loadDashboardStats();
    loadOrders();
    loadCarsTable();
    initCarForm();
    initEventListeners();
    
    // Update notification badge
    updateNotificationBadge();
    
    // Setup auto logout
    setupAutoLogout();
    
    // Setup activity monitoring
    setupActivityMonitor();
    
    // Add security audit log
    logSecurityEvent('admin_panel_accessed');
}


function initAdminDashboard() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('adminLoading');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1000);
    
    // Initialize admin components
    initAdminNavigation();
    loadDashboardStats();
    loadOrders();
    loadCarsTable();
    initCarForm();
    initEventListeners();
    
    // Initialize test drive management
    initTestDriveManagement();
    
    // Setup test drive listener
    setupTestDriveListener();
    
    // Update notification badge
    updateNotificationBadge();
    
    // Add security audit log
    logSecurityEvent('admin_panel_accessed');
    
    console.log('Admin dashboard initialized');
    
    // Debug: Show current data
    console.log('Current test drives:', JSON.parse(localStorage.getItem('luxuryMotorsTestDrives')) || []);
    console.log('Current notifications:', JSON.parse(localStorage.getItem('luxuryMotorsNotifications')) || []);
}

// Add security headers and protections
function addSecurityHeaders() {
    // Prevent embedding in iframes (clickjacking protection)
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
    
    // Disable right-click in production (optional)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showSecurityAlert('Right-click is disabled for security reasons.');
        });
    }
    
    // Disable text selection on sensitive data
    const sensitiveElements = document.querySelectorAll('.customer-phone, .customer-email, [data-sensitive]');
    sensitiveElements.forEach(el => {
        el.style.userSelect = 'none';
        el.addEventListener('selectstart', e => e.preventDefault());
    });
}

// Setup auto logout after inactivity
function setupAutoLogout() {
    let inactivityTimer;
    const logoutTime = 30 * 60 * 1000; // 30 minutes
    
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(logoutDueToInactivity, logoutTime);
    }
    
    // Events that reset the timer
    ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetTimer);
    });
    
    resetTimer(); // Start the timer
}

// Logout due to inactivity
function logoutDueToInactivity() {
    logSecurityEvent('auto_logout_inactivity');
    localStorage.removeItem('luxuryMotorsAdminSession');
    
    // Show logout message
    const logoutMsg = document.createElement('div');
    logoutMsg.id = 'logoutMessage';
    logoutMsg.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); 
             display: flex; flex-direction: column; align-items: center; justify-content: center; 
             color: white; z-index: 9999; animation: fadeIn 0.5s ease-out;">
            <i class="fas fa-clock" style="font-size: 4rem; margin-bottom: 20px; color: #f39c12;"></i>
            <h2 style="font-size: 2rem; margin-bottom: 15px;">Session Expired</h2>
            <p style="font-size: 1.2rem; margin-bottom: 30px; color: #ccc;">
                You have been logged out due to inactivity.
            </p>
            <a href="login.html" class="btn-primary" style="padding: 15px 30px; font-size: 1.1rem;">
                Return to Login
            </a>
        </div>
    `;
    
    document.body.appendChild(logoutMsg);
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 5000);
}

// Setup activity monitor
function setupActivityMonitor() {
    // Monitor for suspicious activities
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        logSecurityEvent('fetch_request', { url: args[0] });
        return originalFetch.apply(this, args);
    };
    
    // Monitor console access attempts
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        logSecurityEvent('console_access', { data: args.join(' ') });
        return originalConsoleLog.apply(this, args);
    };
}

// Log security events
function logSecurityEvent(action, data = {}) {
    const adminData = JSON.parse(localStorage.getItem('luxuryMotorsAdmin'));
    
    if (!adminData.securityLogs) {
        adminData.securityLogs = [];
    }
    
    adminData.securityLogs.push({
        timestamp: new Date().toISOString(),
        action: action,
        ip: 'local',
        userAgent: navigator.userAgent,
        data: data
    });
    
    // Keep only last 100 logs
    if (adminData.securityLogs.length > 100) {
        adminData.securityLogs = adminData.securityLogs.slice(-100);
    }
    
    localStorage.setItem('luxuryMotorsAdmin', JSON.stringify(adminData));
}

// Show security alert
function showSecurityAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'security-alert';
    alert.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; 
             padding: 15px 20px; border-radius: var(--radius); box-shadow: 0 5px 15px rgba(0,0,0,0.3);
             z-index: 9998; animation: slideInRight 0.5s ease-out; max-width: 300px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-shield-alt"></i>
                <strong>Security Alert</strong>
            </div>
            <p style="margin: 10px 0 0 0; font-size: 0.9rem;">${message}</p>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

// Add logout functionality to existing navigation
function initAdminNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Add logout button to navigation
    const logoutBtn = document.createElement('li');
    logoutBtn.innerHTML = `
        <a href="#" id="logoutBtn" style="color: #e74c3c;">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    `;
    
    if (navMenu) {
        navMenu.appendChild(logoutBtn);
        
        // Add logout event listener
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

// Logout user
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        logSecurityEvent('user_logout');
        localStorage.removeItem('luxuryMotorsAdminSession');
        window.location.href = 'login.html';
    }
}

// Enhanced order viewing with security
function viewOrderDetails(orderId) {
    // Log order access
    logSecurityEvent('order_details_viewed', { orderId });
    
    // Continue with existing functionality...
    const orderDetailsModalOverlay = document.getElementById('orderDetailsModalOverlay');
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    
    if (!orderDetailsModalOverlay || !orderDetailsContent) return;
    
    // Get order data
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Mask sensitive data for display
    const maskedPhone = maskPhoneNumber(order.customerPhone);
    const maskedEmail = maskEmail(order.customerEmail);
    
    // Continue with existing code...
}

// Mask phone number for display
function maskPhoneNumber(phone) {
    if (!phone) return 'Not provided';
    const visibleDigits = 4;
    const masked = phone.slice(0, -visibleDigits).replace(/\d/g, '*') + phone.slice(-visibleDigits);
    return masked;
}

// Mask email for display
function maskEmail(email) {
    if (!email || email === 'Not provided') return 'Not provided';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    
    const maskedName = name.length > 2 
        ? name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
        : name;
    
    return maskedName + '@' + domain;
}

// Add security audit log viewer (optional feature)
function addSecurityLogViewer() {
    // This would be an advanced feature to view security logs
    // Could be accessed via a hidden admin feature
}

// Export data with security (for backup)
function exportData() {
    const adminData = JSON.parse(localStorage.getItem('luxuryMotorsAdmin'));
    const carsData = JSON.parse(localStorage.getItem('luxuryMotorsCars'));
    const ordersData = JSON.parse(localStorage.getItem('luxuryMotorsOrders'));
    
    const exportData = {
        exportedAt: new Date().toISOString(),
        cars: carsData,
        orders: ordersData.map(order => ({
            ...order,
            customerPhone: maskPhoneNumber(order.customerPhone),
            customerEmail: maskEmail(order.customerEmail)
        }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `luxury-motors-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    logSecurityEvent('data_exported');
}




// Simple Test Drive Display for Admin
function loadTestDrives() {
    const testDrivesTable = document.getElementById('testDrivesTableBody');
    if (!testDrivesTable) return;
    
    // Get test drives from localStorage
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Clear table
    testDrivesTable.innerHTML = '';
    
    // If no test drives
    if (testDrives.length === 0) {
        testDrivesTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    No test drive requests yet
                </td>
            </tr>
        `;
        return;
    }
    
    // Display test drives (newest first)
    testDrives.reverse().forEach(drive => {
        const row = document.createElement('tr');
        
        // Format date
        const driveDate = new Date(drive.date);
        const formattedDate = driveDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Status badge
        const status = drive.status || 'New';
        const statusClass = status.toLowerCase().replace(' ', '-');
        
        row.innerHTML = `
            <td>${drive.name}</td>
            <td>${drive.phone}</td>
            <td>${drive.email}</td>
            <td>${drive.car}</td>
            <td>${formattedDate}</td>
            <td>${drive.time}</td>
            <td>
                <span class="status-badge ${statusClass}">${status}</span>
            </td>
            <td>
                <button class="action-btn view-btn" onclick="viewTestDrive(${drive.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTestDrive(${drive.id})" title="Delete Request">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        testDrivesTable.appendChild(row);
    });
}

// Delete test drive request
function deleteTestDrive(id) {
    // Show confirmation dialog
    if (confirm('Are you sure you want to delete this test drive request?\n\nThis action cannot be undone.')) {
        // Get all test drives
        let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
        
        // Find and remove the test drive
        const initialLength = testDrives.length;
        testDrives = testDrives.filter(drive => drive.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('testDrives', JSON.stringify(testDrives));
        
        // Also remove from admin notifications
        let notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        notifications = notifications.filter(notification => 
            !(notification.type === 'test_drive' && notification.details && notification.details.id === id)
        );
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
        
        // Reload the table
        loadTestDrives();
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Show success message
        if (testDrives.length < initialLength) {
            showAdminMessage('Test drive request deleted successfully!', 'success');
        } else {
            showAdminMessage('No test drive found with that ID.', 'error');
        }
    }
}

// Simple Test Drive Display for Admin
function loadTestDrives() {
    const testDrivesTable = document.getElementById('testDrivesTableBody');
    if (!testDrivesTable) return;
    
    // Get test drives from localStorage
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Clear table
    testDrivesTable.innerHTML = '';
    
    // If no test drives
    if (testDrives.length === 0) {
        testDrivesTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    No test drive requests yet
                </td>
            </tr>
        `;
        return;
    }
    
    // Display test drives (newest first)
    testDrives.reverse().forEach(drive => {
        const row = document.createElement('tr');
        
        // Format date
        const driveDate = new Date(drive.date);
        const formattedDate = driveDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        row.innerHTML = `
            <td>${drive.name}</td>
            <td>${drive.phone}</td>
            <td>${drive.email}</td>
            <td>${drive.car}</td>
            <td>${formattedDate}</td>
            <td>${drive.time}</td>
            <td>
                <button class="action-btn" onclick="viewTestDrive(${drive.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="callCustomer('${drive.phone}')">
                    <i class="fas fa-phone"></i>
                </button>
            </td>
        `;
        
        testDrivesTable.appendChild(row);
    });
}

// View test drive details
function viewTestDrive(id) {
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    const drive = testDrives.find(d => d.id === id);
    
    if (!drive) return;
    
    // Format date nicely
    const driveDate = new Date(drive.date);
    const formattedDate = driveDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create modal content
    const modalContent = `
        <div class="test-drive-details">
            <h3>Test Drive Details</h3>
            
            <div class="detail-group">
                <div class="detail-item">
                    <strong>Customer Name:</strong>
                    <span>${drive.name}</span>
                </div>
                <div class="detail-item">
                    <strong>Phone:</strong>
                    <span><a href="tel:${drive.phone.replace(/\D/g, '')}">${drive.phone}</a></span>
                </div>
                <div class="detail-item">
                    <strong>Email:</strong>
                    <span><a href="mailto:${drive.email}">${drive.email}</a></span>
                </div>
                <div class="detail-item">
                    <strong>Car Interested:</strong>
                    <span>${drive.car}</span>
                </div>
                <div class="detail-item">
                    <strong>Preferred Date:</strong>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <strong>Preferred Time:</strong>
                    <span>${drive.time}</span>
                </div>
                <div class="detail-item full-width">
                    <strong>Message:</strong>
                    <p>${drive.message || 'No additional message'}</p>
                </div>
                <div class="detail-item">
                    <strong>Request Date:</strong>
                    <span>${new Date(drive.timestamp).toLocaleString()}</span>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-primary" onclick="callCustomer('${drive.phone}')">
                    <i class="fas fa-phone"></i> Call Customer
                </button>
                <button class="btn-secondary" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    showModal('Test Drive Request', modalContent);
}

// View test drive details
function viewTestDrive(id) {
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    const drive = testDrives.find(d => d.id === id);
    
    if (!drive) return;
    
    // Format date nicely
    const driveDate = new Date(drive.date);
    const formattedDate = driveDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Current status
    const currentStatus = drive.status || 'New';
    
    // Create modal content
    const modalContent = `
        <div class="test-drive-details">
            <h3>Test Drive Details</h3>
            
            <div class="detail-group">
                <div class="detail-item">
                    <strong>Customer Name:</strong>
                    <span>${drive.name}</span>
                </div>
                <div class="detail-item">
                    <strong>Phone:</strong>
                    <span><a href="tel:${drive.phone.replace(/\D/g, '')}">${drive.phone}</a></span>
                </div>
                <div class="detail-item">
                    <strong>Email:</strong>
                    <span><a href="mailto:${drive.email}">${drive.email}</a></span>
                </div>
                <div class="detail-item">
                    <strong>Car Interested:</strong>
                    <span>${drive.car}</span>
                </div>
                <div class="detail-item">
                    <strong>Preferred Date:</strong>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <strong>Preferred Time:</strong>
                    <span>${drive.time}</span>
                </div>
                <div class="detail-item full-width">
                    <strong>Message:</strong>
                    <p>${drive.message || 'No additional message'}</p>
                </div>
                <div class="detail-item">
                    <strong>Request Date:</strong>
                    <span>${new Date(drive.timestamp).toLocaleString()}</span>
                </div>
                
                <!-- Status Update Section -->
                <div class="detail-item">
                    <strong>Status:</strong>
                    <div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
                        <select id="statusSelect${id}" style="
                            padding: 8px 12px;
                            border-radius: 5px;
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: 1px solid rgba(255, 179, 71, 0.3);
                        ">
                            <option value="New" ${currentStatus === 'New' ? 'selected' : ''}>New</option>
                            <option value="Confirmed" ${currentStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Pending" ${currentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Completed" ${currentStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${currentStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <button onclick="updateTestDriveStatus(${id})" style="
                            background: var(--primary-gold);
                            color: var(--primary-black);
                            border: none;
                            padding: 8px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                            Update
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-primary" onclick="callCustomer('${drive.phone}')">
                    <i class="fas fa-phone"></i> Call Customer
                </button>
                <button class="btn-secondary" onclick="sendEmailToCustomer('${drive.email}', '${drive.name}', '${drive.car}')">
                    <i class="fas fa-envelope"></i> Send Email
                </button>
                <button class="btn-delete" onclick="deleteTestDrive(${id})" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    showModal('Test Drive Request', modalContent);
}

// Update test drive status
function updateTestDriveStatus(id) {
    const statusSelect = document.getElementById(`statusSelect${id}`);
    const newStatus = statusSelect.value;
    
    // Get all test drives
    let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    // Find and update the test drive
    const driveIndex = testDrives.findIndex(drive => drive.id === id);
    
    if (driveIndex !== -1) {
        // Update status
        testDrives[driveIndex].status = newStatus;
        testDrives[driveIndex].statusUpdated = new Date().toISOString();
        
        // Save back to localStorage
        localStorage.setItem('testDrives', JSON.stringify(testDrives));
        
        // Reload the table
        loadTestDrives();
        
        // Update modal status
        statusSelect.value = newStatus;
        
        // Show success message
        showAdminMessage(`Status updated to: ${newStatus}`, 'success');
        
        // Log the update
        console.log(`Test drive ${id} status updated to ${newStatus}`);
    }
}

// Send email to customer
function sendEmailToCustomer(email, name, car) {
    const subject = `Your Test Drive Request - Luxury Motors`;
    const body = `Dear ${name},\n\nRegarding your test drive request for ${car}.\n\n`;
    
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

// Call customer
function callCustomer(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
        window.open(`tel:${cleanPhone}`, '_blank');
    }
}

// Simple modal functions
function showModal(title, content) {
    const modalHTML = `
        <div class="modal-overlay active" id="customModal">
            <div class="modal">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>${title}</h2>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.remove();
}

// Update dashboard stats to include test drives
function updateDashboardStats() {
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    
    // Update test drive count
    const testDriveCount = document.getElementById('testDriveCount');
    if (testDriveCount) {
        testDriveCount.textContent = testDrives.length;
    }
    
    // Update notification badge
    const badge = document.getElementById('orderNotificationBadge');
    if (badge) {
        const unreadNotifications = notifications.filter(n => !n.read).length;
        if (unreadNotifications > 0) {
            badge.textContent = unreadNotifications;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Initialize admin with test drives
function initAdminDashboard() {
    // Load all data
    loadDashboardStats();
    loadOrders();
    loadCarsTable();
    loadTestDrives(); // Add this line
    
    // Update stats
    updateDashboardStats();
    
    // Setup auto-refresh
    setInterval(() => {
        loadTestDrives();
        updateDashboardStats();
    }, 3000); // Refresh every 3 seconds
}

// Show admin message
function showAdminMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.querySelector('.admin-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-message ${type}`;
    
    // Set icon based on type
    let icon = 'ℹ';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✗';
    
    messageDiv.innerHTML = `
        <span style="font-size: 1.2rem; font-weight: bold;">${icon}</span>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}

// DELETE TEST DRIVE - SIMPLE WORKING VERSION
function setupTestDriveDeletion() {
    // Load test drives on page load
    loadTestDrives();
    
    // Auto-refresh every 3 seconds to catch new submissions
    setInterval(loadTestDrives, 3000);
}

function loadTestDrives() {
    const tableBody = document.getElementById('testDrivesTableBody');
    if (!tableBody) return;
    
    // Get ALL test drives from localStorage
    const allData = JSON.parse(localStorage.getItem('luxuryMotorsCars')) || [];
    const orders = JSON.parse(localStorage.getItem('luxuryMotorsOrders')) || [];
    const testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    console.log('Checking localStorage...');
    console.log('Cars data:', allData.length);
    console.log('Orders:', orders.length);
    console.log('Test Drives:', testDrives.length);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // If no test drives
    if (testDrives.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
                    <i class="fas fa-calendar-times"></i><br>
                    No test drive requests yet
                </td>
            </tr>
        `;
        return;
    }
    
    // Show newest first
    testDrives.slice().reverse().forEach(drive => {
        const row = document.createElement('tr');
        const id = drive.id || Date.now(); // Ensure ID exists
        
        // Format date
        let formattedDate = 'Not set';
        try {
            if (drive.date) {
                const date = new Date(drive.date);
                formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        } catch (e) {}
        
        row.innerHTML = `
            <td>${drive.name || 'No name'}</td>
            <td>${drive.phone || 'No phone'}</td>
            <td>${drive.car || 'Any car'}</td>
            <td>${formattedDate}</td>
            <td>${drive.time || 'Any time'}</td>
            <td><span style="background: #3498db; color: white; padding: 3px 10px; border-radius: 10px; font-size: 12px;">
                ${drive.status || 'New'}
            </span></td>
            <td>
                <button class="delete-test-drive-btn" data-id="${id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add click event to ALL delete buttons
    document.querySelectorAll('.delete-test-drive-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteTestDrive(id);
        });
    });
}

function deleteTestDrive(id) {
    console.log('Attempting to delete test drive with ID:', id);
    
    // Show confirmation
    if (!confirm('Are you sure you want to delete this test drive request?')) {
        return;
    }
    
    // Get current test drives
    let testDrives = JSON.parse(localStorage.getItem('testDrives')) || [];
    
    console.log('Before deletion:', testDrives.length, 'items');
    
    // Convert ID to number for comparison
    const numId = Number(id);
    
    // Filter out the one to delete
    const newTestDrives = testDrives.filter(drive => {
        const driveId = Number(drive.id);
        return driveId !== numId;
    });
    
    console.log('After deletion:', newTestDrives.length, 'items');
    
    // Save back to localStorage
    localStorage.setItem('testDrives', JSON.stringify(newTestDrives));
    
    // Show success message
    alert('✓ Test drive request deleted successfully!');
    
    // Reload the table
    loadTestDrives();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupTestDriveDeletion();
    
    // Also add a manual refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Test Drives';
    refreshBtn.style.cssText = `
        background: var(--primary-gold);
        color: var(--primary-black);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        margin: 10px;
        display: block;
    `;
    refreshBtn.onclick = loadTestDrives;
    
    // Add button near the test drives table
    const testDrivesSection = document.querySelector('#test-drives');
    if (testDrivesSection) {
        testDrivesSection.insertBefore(refreshBtn, testDrivesSection.querySelector('.table-container'));
    }
});