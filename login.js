// Secure Admin Login System

// Initialize login system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin credentials if not set
    initAdminCredentials();
    
    // Setup event listeners
    setupLoginListeners();
    
    // Check if user is already logged in
    checkExistingSession();
    
    // Check for lockout status
    checkLockoutStatus();
});

// Initialize admin credentials in localStorage
function initAdminCredentials() {
    if (!localStorage.getItem('luxuryMotorsAdmin')) {
        // Default admin credentials (in real app, these should be set by admin)
        const adminCredentials = {
            username: 'admin',
            password: 'luxury2023', // Default password - admin should change this
            lastPasswordChange: new Date().toISOString(),
            isLocked: false,
            lockUntil: null,
            failedAttempts: 0,
            lastLogin: null,
            securityLogs: []
        };
        
        localStorage.setItem('luxuryMotorsAdmin', JSON.stringify(adminCredentials));
    }
}

// Setup login form event listeners
function setupLoginListeners() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Input validation
    const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('input', clearErrors);
    passwordInput.addEventListener('input', clearErrors);
}

// Clear error messages
function clearErrors() {
    document.getElementById('passwordError').classList.remove('show');
    document.getElementById('attemptsWarning').classList.remove('show');
}

// Check existing session
function checkExistingSession() {
    const session = localStorage.getItem('luxuryMotorsAdminSession');
    if (session) {
        const sessionData = JSON.parse(session);
        
        // Check if session is still valid (1 hour expiry)
        if (Date.now() - sessionData.timestamp < 3600000) {
            // Valid session found, redirect to admin
            window.location.href = 'admin.html';
        } else {
            // Session expired, clear it
            localStorage.removeItem('luxuryMotorsAdminSession');
        }
    }
}

// Check lockout status
function checkLockoutStatus() {
    const adminData = JSON.parse(localStorage.getItem('luxuryMotorsAdmin'));
    
    if (adminData.isLocked && adminData.lockUntil) {
        const lockUntil = new Date(adminData.lockUntil);
        const now = new Date();
        
        if (now < lockUntil) {
            // Still locked out
            showLockoutMessage(lockUntil);
            disableLoginForm();
        } else {
            // Lockout period expired
            adminData.isLocked = false;
            adminData.lockUntil = null;
            adminData.failedAttempts = 0;
            localStorage.setItem('luxuryMotorsAdmin', JSON.stringify(adminData));
        }
    }
}

// Show lockout message
function showLockoutMessage(lockUntil) {
    const now = new Date();
    const minutesLeft = Math.ceil((lockUntil - now) / 60000);
    
    document.getElementById('lockoutTime').textContent = minutesLeft;
    document.getElementById('lockoutMessage').classList.add('show');
    document.getElementById('loginForm').style.opacity = '0.5';
}

// Disable login form
function disableLoginForm() {
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input');
    const button = document.getElementById('loginBtn');
    
    inputs.forEach(input => input.disabled = true);
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-lock"></i> Account Locked';
}

// Handle login attempt
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Show loading state
    loginText.style.display = 'none';
    loginSpinner.style.display = 'block';
    loginBtn.disabled = true;
    
    // Simulate network delay for security
    setTimeout(() => {
        authenticateUser(username, password);
    }, 1000);
}

// Authenticate user
function authenticateUser(username, password) {
    const adminData = JSON.parse(localStorage.getItem('luxuryMotorsAdmin'));
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Check if account is locked
    if (adminData.isLocked) {
        const lockUntil = new Date(adminData.lockUntil);
        if (new Date() < lockUntil) {
            showLoginError('Account is locked. Please try again later.');
            return;
        } else {
            // Lock expired, reset
            adminData.isLocked = false;
            adminData.lockUntil = null;
            adminData.failedAttempts = 0;
        }
    }
    
    // Verify credentials
    if (username === adminData.username && password === adminData.password) {
        // Successful login
        adminData.failedAttempts = 0;
        adminData.lastLogin = new Date().toISOString();
        
        // Add security log
        adminData.securityLogs.push({
            timestamp: new Date().toISOString(),
            action: 'login_success',
            ip: 'local', // In real app, get from server
            userAgent: navigator.userAgent
        });
        
        // Keep only last 50 logs
        if (adminData.securityLogs.length > 50) {
            adminData.securityLogs = adminData.securityLogs.slice(-50);
        }
        
        localStorage.setItem('luxuryMotorsAdmin', JSON.stringify(adminData));
        
        // Create session
        createSession();
        
        // Redirect to admin page
        showLoginSuccess();
    } else {
        // Failed login
        adminData.failedAttempts++;
        
        // Check if should lock account
        if (adminData.failedAttempts >= 5) {
            adminData.isLocked = true;
            const lockTime = new Date();
            lockTime.setMinutes(lockTime.getMinutes() + 15); // Lock for 15 minutes
            adminData.lockUntil = lockTime.toISOString();
            
            // Add security log
            adminData.securityLogs.push({
                timestamp: new Date().toISOString(),
                action: 'account_locked',
                ip: 'local',
                userAgent: navigator.userAgent
            });
            
            showLockoutMessage(lockTime);
            disableLoginForm();
        } else {
            // Show remaining attempts
            const attemptsLeft = 5 - adminData.failedAttempts;
            document.getElementById('attemptsLeft').textContent = attemptsLeft;
            document.getElementById('attemptsWarning').classList.add('show');
            
            // Add security log
            adminData.securityLogs.push({
                timestamp: new Date().toISOString(),
                action: 'login_failed',
                ip: 'local',
                userAgent: navigator.userAgent,
                attempts: adminData.failedAttempts
            });
        }
        
        localStorage.setItem('luxuryMotorsAdmin', JSON.stringify(adminData));
        showLoginError('Invalid username or password');
    }
    
    // Reset button state
    loginText.style.display = 'inline';
    loginSpinner.style.display = 'none';
    loginBtn.disabled = false;
}

// Show login error
function showLoginError(message) {
    const errorDiv = document.getElementById('passwordError');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    // Shake animation
    const form = document.getElementById('loginForm');
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
}

// Show login success
function showLoginSuccess() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'none';
    
    setTimeout(() => {
        loginCard.style.animation = 'successPulse 1s ease-out';
        
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Login successful! Redirecting...</span>
        `;
        successMsg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(46, 204, 113, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            border-radius: var(--radius);
            animation: fadeIn 0.5s ease-out;
        `;
        
        loginCard.appendChild(successMsg);
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    }, 100);
}

// Create secure session
function createSession() {
    const session = {
        username: 'admin',
        timestamp: Date.now(),
        sessionId: generateSessionId(),
        userAgent: navigator.userAgent,
        ip: 'local' // In real app, get from server
    };
    
    localStorage.setItem('luxuryMotorsAdminSession', JSON.stringify(session));
}

// Generate random session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Add success animation to CSS
const successAnimation = `
@keyframes successPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
    }
    70% {
        box-shadow: 0 0 0 20px rgba(46, 204, 113, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
}

.shake {
    animation: shake 0.5s ease-in-out;
}
`;

// Add to page
const successStyle = document.createElement('style');
successStyle.textContent = successAnimation;
document.head.appendChild(successStyle);