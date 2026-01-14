// API Base URL - automatically detect environment
// Use window.API_BASE_URL if already set (by books-data.js), otherwise set it
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://linkup-backend-oz1f.vercel.app';
}
// Reference the global API_BASE_URL - use window.API_BASE_URL directly to avoid const conflicts
// Create a getter function for consistency
function getApiBaseUrl() {
    return window.API_BASE_URL;
}
const API_BASE_URL = getApiBaseUrl();

// Store token
let authToken = localStorage.getItem('authToken');

// DOM elements - will be initialized when DOM is ready
let authSection, loginForm, registerForm, homePage, recordsPage;
let userWelcome, usernameDisplay, logoutBtn;
let showLoginBtn, showRegisterBtn;
let navHome, navGallery, navRecords, navLinks;

// Current page state
let currentPage = 'home';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize DOM element references
    authSection = document.getElementById('auth-section');
    loginForm = document.getElementById('login-form');
    registerForm = document.getElementById('register-form');
    homePage = document.getElementById('home-page');
    recordsPage = document.getElementById('records-page');
    userWelcome = document.getElementById('user-welcome');
    usernameDisplay = document.getElementById('username-display');
    logoutBtn = document.getElementById('logout-btn');
    showLoginBtn = document.getElementById('show-login');
    showRegisterBtn = document.getElementById('show-register');
    navHome = document.getElementById('nav-home');
    navGallery = document.getElementById('nav-gallery');
    navRecords = document.getElementById('nav-records');
    navLinks = document.getElementById('nav-links');
    
    console.log('DOM elements initialized:', {
        showLoginBtn: !!showLoginBtn,
        showRegisterBtn: !!showRegisterBtn,
        authSection: !!authSection,
        loginForm: !!loginForm
    });
    
    // Ensure auth modal is hidden on load
    if (authSection) {
        authSection.classList.add('hidden');
    }
    if (loginForm) {
        loginForm.classList.add('hidden');
    }
    if (registerForm) {
        registerForm.classList.add('hidden');
    }
    
    // Show home page by default for all users
    showPage('home');
    
    if (authToken) {
        checkAuth();
    } else {
        // Show navigation but keep auth buttons visible
        if (navLinks) navLinks.classList.remove('hidden');
        if (showLoginBtn) showLoginBtn.classList.remove('hidden');
        if (showRegisterBtn) showRegisterBtn.classList.remove('hidden');
        if (userWelcome) userWelcome.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Check if elements exist
    if (!showLoginBtn) {
        console.error('show-login button not found');
        showLoginBtn = document.getElementById('show-login');
    }
    if (!showRegisterBtn) {
        console.error('show-register button not found');
        showRegisterBtn = document.getElementById('show-register');
    }
    
    if (!showLoginBtn || !showRegisterBtn) {
        console.error('Login/Register buttons still not found after retry');
        return;
    }
    
    // Navigation buttons
    if (navHome) {
        navHome.addEventListener('click', () => {
            showPage('home');
        });
    }
    
    if (navGallery) {
        navGallery.addEventListener('click', () => {
            showPage('gallery');
        });
    }
    
    if (navRecords) {
        navRecords.addEventListener('click', () => {
            // Check if user is logged in
            if (!authToken) {
                showMessage('Please login or register to view your works', 'error');
                // Show login modal
                showAuthModal();
                return;
            }
            showPage('records');
        });
    }

    // Show login form
    console.log('Binding login button event listener to:', showLoginBtn);
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Login button clicked');
        
        const authSectionEl = document.getElementById('auth-section');
        const loginFormEl = document.getElementById('login-form');
        const registerFormEl = document.getElementById('register-form');
        
        console.log('Auth elements:', {
            authSection: !!authSectionEl,
            loginForm: !!loginFormEl,
            registerForm: !!registerFormEl
        });
        
        if (!authSectionEl) {
            console.error('auth-section element not found');
            showMessage('Error: Login modal not found', 'error');
            return;
        }
        if (!loginFormEl) {
            console.error('login-form element not found');
            showMessage('Error: Login form not found', 'error');
            return;
        }
        if (!registerFormEl) {
            console.error('register-form element not found');
        }
        
        // Show modal
        authSectionEl.classList.remove('hidden');
        authSectionEl.style.display = 'flex';
        console.log('Auth modal shown');
        
        // Show login form, hide register form
        if (registerFormEl) {
            registerFormEl.classList.add('hidden');
        }
        loginFormEl.classList.remove('hidden');
        console.log('Login form shown');
    });

    // Show register form
    console.log('Binding register button event listener to:', showRegisterBtn);
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Register button clicked');
        const authSectionEl = document.getElementById('auth-section');
        const loginFormEl = document.getElementById('login-form');
        const registerFormEl = document.getElementById('register-form');
        
        if (!authSectionEl || !loginFormEl || !registerFormEl) {
            console.error('Auth modal elements not found');
            return;
        }
        
        // Show modal
        authSectionEl.classList.remove('hidden');
        authSectionEl.style.display = 'flex';
        
        // Show register form, hide login form
        loginFormEl.classList.add('hidden');
        registerFormEl.classList.remove('hidden');
    });
    
    // Close auth modal when clicking outside
    if (authSection) {
        authSection.addEventListener('click', (e) => {
            if (e.target === authSection) {
                hideAuthModal();
            }
        });
    }

    // Login form submit
    const loginFormElement = document.getElementById('login-form-element');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            const usernameEl = document.getElementById('login-username');
            const passwordEl = document.getElementById('login-password');
            
            if (!usernameEl || !passwordEl) {
                console.error('Login form inputs not found');
                showMessage('Login form error: inputs not found', 'error');
                return;
            }
            
            const username = usernameEl.value.trim();
            const password = passwordEl.value;
            
            if (!username || !password) {
                showMessage('Please enter both username and password', 'error');
                return;
            }
            
            console.log('Attempting login for user:', username);
            await login(username, password);
        });
    } else {
        console.error('login-form-element not found');
    }

    // Register form submit
    const registerFormElement = document.getElementById('register-form-element');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            
            // Validate required fields
            if (!username || !email || !password || !passwordConfirm) {
                showMessage('All fields are required', 'error');
                return;
            }
            
            // Validate password match
            if (password !== passwordConfirm) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            await register(username, email, password);
        });
    } else {
        console.error('register-form-element not found');
    }
    
    // Forgot password form submit
    const forgotPasswordFormElement = document.getElementById('forgot-password-form-element');
    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleForgotPasswordSubmit();
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }

    // Submit issue form
    const issueForm = document.getElementById('issue-form');
    if (issueForm) {
        issueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const question = document.getElementById('issue-question').value;
            await submitIssue(question);
        });
    }

    // Scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.scenario-btn').forEach(b => {
                b.classList.remove('border-pink-500', 'bg-pink-50', 'text-pink-700');
                b.classList.add('border-gray-300');
            });
            // Add active class to clicked button
            btn.classList.add('border-pink-500', 'bg-pink-50', 'text-pink-700');
            btn.classList.remove('border-gray-300');
            
            // Update placeholder based on scenario
            const scenario = btn.dataset.scenario;
            const textarea = document.getElementById('issue-question');
            const placeholders = {
                workplace: "Describe your workplace communication challenge... (e.g., 'I need to give feedback to a team member', 'My manager doesn't listen to my ideas')",
                family: "Describe your family communication challenge... (e.g., 'I struggle to set boundaries with my parents', 'My partner and I argue about money')",
                social: "Describe your social communication challenge... (e.g., 'I'm nervous about networking events', 'I don't know how to make small talk')",
                conflict: "Describe your conflict situation... (e.g., 'I need to resolve a disagreement with a colleague', 'My friend and I had a misunderstanding')"
            };
            textarea.placeholder = placeholders[scenario] || textarea.placeholder;
        });
    });

    // Refresh topics button
    // Removed refresh-topics button - now using fixed Communication Toolkit
}

// Load topic cards (Communication Toolkit - 沟通锦囊)
function loadTopicCards() {
    const topicCards = document.getElementById('topic-cards');
    const topics = [
        { 
            icon: '👂', 
            title: 'How to Listen to Improve Communication Efficiency', 
            desc: 'Master the art of active listening to enhance understanding',
            mindmapId: 'listening-mindmap',
            filename: 'How to Listen More Effectively for Better Communication.png',
            tags: ['listening', 'communication']
        },
        { 
            icon: '💬', 
            title: 'How to Respond to Guide Others\' Needs', 
            desc: 'Learn effective response techniques to steer conversations',
            mindmapId: 'responding-mindmap',
            filename: 'How to Respond to Elicit the Other Person\'s Needs.png',
            tags: ['responding', 'needs']
        },
        { 
            icon: '👤', 
            title: 'How to Read People to Use Communication Strategies', 
            desc: 'Develop skills to understand others and adapt your approach',
            mindmapId: 'reading-people-mindmap',
            filename: null, // Not available yet
            tags: ['reading', 'strategies']
        },
        { 
            icon: '🙋', 
            title: 'How to Ask for Help to Get More Resources', 
            desc: 'Strategies for requesting assistance effectively',
            mindmapId: 'asking-help-mindmap',
            filename: 'How to Ask for Help and Gain More Resources.png',
            tags: ['help', 'resources']
        },
        { 
            icon: '🚫', 
            title: 'How to Refuse to Manage Relationship Boundaries', 
            desc: 'Say no gracefully while maintaining healthy relationships',
            mindmapId: 'refusing-mindmap',
            filename: null, // Not available yet
            tags: ['refusing', 'boundaries']
        },
        { 
            icon: '💡', 
            title: 'How to Persuade to Get Others\' Support', 
            desc: 'Build compelling arguments that win support',
            mindmapId: 'persuading-mindmap',
            filename: null, // Not available yet
            tags: ['persuading', 'support']
        },
    ];

    topicCards.innerHTML = topics.map(topic => `
        <div class="mindmap-card bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <!-- Title Section (Above Image) -->
            <div class="p-5 border-b border-gray-100">
                <div class="flex items-start space-x-3 mb-2">
                    <span class="text-2xl flex-shrink-0">${topic.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-base leading-tight mb-1">${topic.title}</h4>
                        <p class="text-sm text-gray-600 leading-relaxed">${topic.desc}</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-3">
                    ${topic.tags.map(tag => `
                        <span class="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">${tag}</span>
                    `).join('')}
                </div>
            </div>
            <!-- Mind Map Image Section -->
            ${topic.filename ? `
                <div class="mindmap-display relative bg-white group">
                    <img src="mindmaps/${topic.filename}" 
                         alt="${topic.title}" 
                         class="w-full h-auto object-contain"
                         style="display: block; min-height: 400px;"
                         onerror="console.error('Image failed to load: mindmaps/${topic.filename}'); this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%23f3f4f6\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' fill=\\'%239ca3af\\' font-family=\\'Arial\\' font-size=\\'16\\'%3EImage not found%3C/text%3E%3C/svg%3E';">
                    <button onclick="downloadMindmap('${topic.mindmapId}', '${topic.filename}', '${topic.title}')" 
                            class="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl rounded-lg p-3 transition-all duration-200 flex items-center justify-center border-2 border-gray-200 z-10"
                            title="Download ${topic.title}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                    </button>
                </div>
            ` : `
                <div class="mindmap-display bg-gray-50 h-96 flex items-center justify-center">
                    <div class="text-center text-gray-400">
                        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-sm font-medium">Coming Soon</p>
                    </div>
                </div>
            `}
        </div>
    `).join('');
}

// Download mind map
function downloadMindmap(mindmapId, filename, title) {
    const filepath = `mindmaps/${filename}`;
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = filepath;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
    
    // Show message
    showMessage(`Downloading: ${title}`, 'success');
}

// Use topic
function useTopic(topic) {
    const textarea = document.getElementById('issue-question');
    textarea.value = topic;
    textarea.focus();
    // Scroll to form
    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show page
function showPage(page) {
    currentPage = page;
    const homePageEl = document.getElementById('home-page');
    const galleryPageEl = document.getElementById('gallery-page');
    const recordsPageEl = document.getElementById('records-page');
    
    // Hide all pages first
    homePageEl.classList.add('hidden');
    
    // Load books when showing home page
    if (page === 'home' && typeof loadBooks === 'function') {
        setTimeout(() => {
            loadBooks();
        }, 100);
    }
    galleryPageEl.classList.add('hidden');
    recordsPageEl.classList.add('hidden');
    
    // Reset all nav styles
    navHome.classList.remove('text-blue-600', 'font-semibold', 'text-black');
    navGallery.classList.remove('text-blue-600', 'font-semibold', 'text-black');
    navRecords.classList.remove('text-blue-600', 'font-semibold', 'text-black');
    navHome.classList.add('text-gray-700');
    navGallery.classList.add('text-gray-700');
    navRecords.classList.add('text-gray-700');
    
    if (page === 'home') {
        homePageEl.classList.remove('hidden');
        navHome.classList.add('text-black', 'font-semibold');
        navHome.classList.remove('text-gray-700');
        // Load topic cards when showing home page
        loadTopicCards();
    } else if (page === 'gallery') {
        galleryPageEl.classList.remove('hidden');
        navGallery.classList.add('text-blue-600', 'font-semibold');
        navGallery.classList.remove('text-gray-700');
    } else if (page === 'records') {
        recordsPageEl.classList.remove('hidden');
        navRecords.classList.add('text-blue-600', 'font-semibold');
        navRecords.classList.remove('text-gray-700');
        loadRecords();
    }
}

// Show auth modal
function showAuthModal() {
    const authSectionEl = document.getElementById('auth-section');
    const loginFormEl = document.getElementById('login-form');
    const registerFormEl = document.getElementById('register-form');
    const forgotPasswordFormEl = document.getElementById('forgot-password-form');
    
    // Show modal
    authSectionEl.classList.remove('hidden');
    authSectionEl.style.display = 'flex';
    
    // Show login form by default, hide register and forgot password forms
    registerFormEl.classList.add('hidden');
    if (forgotPasswordFormEl) {
        forgotPasswordFormEl.classList.add('hidden');
    }
    loginFormEl.classList.remove('hidden');
}

// Hide auth modal
function hideAuthModal() {
    const authSectionEl = document.getElementById('auth-section');
    const loginFormEl = document.getElementById('login-form');
    const registerFormEl = document.getElementById('register-form');
    const forgotPasswordFormEl = document.getElementById('forgot-password-form');
    
    authSectionEl.classList.add('hidden');
    authSectionEl.style.display = 'none';
    loginFormEl.classList.add('hidden');
    registerFormEl.classList.add('hidden');
    if (forgotPasswordFormEl) {
        forgotPasswordFormEl.classList.add('hidden');
    }
}

// Show login from register
function showLoginFromRegister() {
    const loginFormEl = document.getElementById('login-form');
    const registerFormEl = document.getElementById('register-form');
    const forgotPasswordFormEl = document.getElementById('forgot-password-form');
    
    registerFormEl.classList.add('hidden');
    if (forgotPasswordFormEl) {
        forgotPasswordFormEl.classList.add('hidden');
    }
    loginFormEl.classList.remove('hidden');
}

// Show login from forgot password
function showLoginFromForgot() {
    const loginFormEl = document.getElementById('login-form');
    const forgotPasswordFormEl = document.getElementById('forgot-password-form');
    
    if (forgotPasswordFormEl) {
        forgotPasswordFormEl.classList.add('hidden');
        // Reset forgot password form
        document.getElementById('forgot-email').value = '';
        document.getElementById('forgot-verification-code').value = '';
        document.getElementById('forgot-new-password').value = '';
        document.getElementById('forgot-confirm-password').value = '';
        document.getElementById('verification-code-section').classList.add('hidden');
        document.getElementById('new-password-section').classList.add('hidden');
        document.getElementById('confirm-new-password-section').classList.add('hidden');
        document.getElementById('forgot-password-submit-btn').textContent = 'Send Verification Code';
    }
    loginFormEl.classList.remove('hidden');
}

// Show forgot password form
function showForgotPassword() {
    const loginFormEl = document.getElementById('login-form');
    const forgotPasswordFormEl = document.getElementById('forgot-password-form');
    
    loginFormEl.classList.add('hidden');
    if (forgotPasswordFormEl) {
        forgotPasswordFormEl.classList.remove('hidden');
    }
}

// Send reset code
async function sendResetCode() {
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password/send-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to send verification code');
        }
        
        showMessage('Verification code sent to your email', 'success');
        document.getElementById('verification-code-section').classList.remove('hidden');
        document.getElementById('forgot-password-submit-btn').textContent = 'Verify Code';
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Handle forgot password form submit
async function handleForgotPasswordSubmit() {
    const email = document.getElementById('forgot-email').value.trim();
    const verificationCode = document.getElementById('forgot-verification-code').value;
    const newPassword = document.getElementById('forgot-new-password').value;
    const confirmPassword = document.getElementById('forgot-confirm-password').value;
    
    const verificationSection = document.getElementById('verification-code-section');
    const newPasswordSection = document.getElementById('new-password-section');
    const confirmPasswordSection = document.getElementById('confirm-new-password-section');
    
    // Step 1: Send verification code
    if (!verificationSection.classList.contains('hidden') && !verificationCode) {
        await sendResetCode();
        return;
    }
    
    // Step 2: Verify code and show password fields
    if (verificationCode && newPasswordSection.classList.contains('hidden')) {
        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Invalid verification code');
            }
            
            showMessage('Code verified. Please enter your new password', 'success');
            newPasswordSection.classList.remove('hidden');
            confirmPasswordSection.classList.remove('hidden');
            document.getElementById('forgot-password-submit-btn').textContent = 'Reset Password';
            return;
        } catch (error) {
            showMessage(error.message, 'error');
            return;
        }
    }
    
    // Step 3: Reset password
    if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: verificationCode, new_password: newPassword }),
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Failed to reset password');
            }
            
            showMessage('Password reset successfully. Please login with your new password', 'success');
            setTimeout(() => {
                showLoginFromForgot();
            }, 1500);
        } catch (error) {
            showMessage(error.message, 'error');
        }
    }
}

// Show message
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    messageEl.classList.remove('hidden');
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// API request helper
async function apiRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // Only logout if token is actually expired/invalid
            // Don't logout immediately, let the calling function handle it
            const errorData = await response.json().catch(() => ({}));
            if (errorData.detail && errorData.detail.includes('expired')) {
                logout();
            }
            throw new Error('Unauthorized, please login again');
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Request failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// Register
async function register(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }

        showMessage('Registration successful, please login', 'success');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        // Keep modal open for login
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Login
async function login(username, password) {
    try {
        console.log('Login function called with username:', username);
        console.log('API_BASE_URL:', API_BASE_URL);
        
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const url = `${API_BASE_URL}/token`;
        console.log('Making login request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        console.log('Login response status:', response.status);
        
        let data;
        try {
            data = await response.json();
            console.log('Login response data:', data);
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            const text = await response.text();
            console.error('Response text:', text);
            throw new Error('Invalid response from server');
        }
        
        if (!response.ok) {
            const errorMsg = data.detail || data.message || 'Login failed';
            console.error('Login failed:', errorMsg);
            throw new Error(errorMsg);
        }

        if (!data.access_token) {
            console.error('No access_token in response:', data);
            throw new Error('No access token received');
        }

        authToken = data.access_token;
        localStorage.setItem('authToken', authToken);
        console.log('Login successful, token saved');
        
        hideAuthModal();
        await checkAuth();
        showMessage('Login successful', 'success');
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.message || 'Login failed. Please check your credentials.';
        showMessage(errorMessage, 'error');
    }
}

// Check authentication status
async function checkAuth() {
    try {
        const user = await apiRequest('/me');
        usernameDisplay.textContent = user.username;
        userWelcome.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        authSection.classList.add('hidden');
        navLinks.classList.remove('hidden');
        navRecords.classList.remove('hidden');
        showLoginBtn.classList.add('hidden');
        showRegisterBtn.classList.add('hidden');
        showPage('home');
    } catch (error) {
        // Only logout if it's a 401 error (unauthorized), not other errors
        if (error.message && error.message.includes('Unauthorized')) {
            logout();
        } else {
            console.error('Auth check failed:', error);
            // Don't logout on network errors, keep user logged in
        }
    }
}

// Logout
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    userWelcome.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    hideAuthModal();
    showLoginBtn.classList.remove('hidden');
    showRegisterBtn.classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    // Redirect to home page
    showPage('home');
}

// Submit issue
async function submitIssue(question) {
    try {
        const issue = await apiRequest('/issues', {
            method: 'POST',
            body: JSON.stringify({ question }),
        });
        showMessage('Issue submitted successfully, suggestions received', 'success');
        document.getElementById('issue-question').value = '';
        // Switch to records page to view new record
        showPage('records');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Load records (My Records page)
async function loadRecords() {
    try {
        const issues = await apiRequest('/issues');
        const tbody = document.getElementById('records-tbody');
        tbody.innerHTML = '';

        if (issues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No records yet</td></tr>';
            return;
        }

        issues.forEach(issue => {
            const row = document.createElement('tr');
            // Format date without time (only date)
            const date = new Date(issue.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'numeric', 
                day: 'numeric' 
            });
            
            // Create execution check input
            const executionCheckId = `exec-check-${issue.id}`;
            const executionCheckValue = issue.execution_check || '';
            
            // Create what happened input (use sources field or what_happened if available)
            const whatHappenedId = `what-happened-${issue.id}`;
            // Check if there's a what_happened field, otherwise use sources as text or empty
            const whatHappenedValue = issue.what_happened || (Array.isArray(issue.sources) && issue.sources.length > 0 ? issue.sources.join('\n') : '');
            
            // Format suggestion with line breaks
            const suggestion = issue.suggestion || 'No suggestion';
            const formattedSuggestion = formatSuggestion(suggestion);
            const suggestionId = `suggestion-${issue.id}`;
            const isLong = suggestion.length > 200; // Consider long if more than 200 chars
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">${escapeHtml(issue.question)}</td>
                <td class="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    <div id="${suggestionId}" class="suggestion-content ${isLong ? 'suggestion-truncated' : ''}">
                        ${formattedSuggestion}
                    </div>
                    ${isLong ? `<button onclick="toggleSuggestion(${issue.id})" class="mt-2 text-blue-500 hover:text-blue-700 text-xs underline cursor-pointer" id="toggle-${issue.id}">Show more</button>` : ''}
                </td>
                <td class="px-6 py-4 text-sm max-w-xs">
                    <div class="flex items-center space-x-2">
                        <textarea 
                            id="${whatHappenedId}" 
                            rows="2" 
                            class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Record what happened...">${escapeHtml(whatHappenedValue)}</textarea>
                        <button 
                            onclick="saveWhatHappened(${issue.id}, '${whatHappenedId}')"
                            class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 whitespace-nowrap">
                            Save
                        </button>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm">
                    <div class="flex items-center space-x-2">
                        <textarea 
                            id="${executionCheckId}" 
                            rows="2" 
                            class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Record your next steps...">${escapeHtml(executionCheckValue)}</textarea>
                        <button 
                            onclick="saveExecutionCheck(${issue.id}, '${executionCheckId}')"
                            class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 whitespace-nowrap">
                            Save
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showMessage('Failed to load records', 'error');
    }
}

// Format suggestion text with proper line breaks and convert URLs to links
function formatSuggestion(text) {
    if (!text) return 'No suggestion';
    
    // Escape HTML to prevent XSS (but preserve URLs)
    let formatted = escapeHtml(text);
    
    // Remove leading whitespace/newlines to ensure first line is left-aligned
    formatted = formatted.trimStart();
    
    // Convert URLs to clickable links
    // Match URLs (http://, https://, www.)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    formatted = formatted.replace(urlRegex, (url) => {
        // Ensure URL has protocol
        const href = url.startsWith('http') ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a>`;
    });
    
    // Keep the text as-is with line breaks preserved
    // CSS white-space: pre-wrap will handle the formatting
    return formatted;
}

// Toggle suggestion expand/collapse
function toggleSuggestion(issueId) {
    const contentEl = document.getElementById(`suggestion-${issueId}`);
    const toggleBtn = document.getElementById(`toggle-${issueId}`);
    
    if (!contentEl || !toggleBtn) return;
    
    // Toggle the truncated class
    if (contentEl.classList.contains('suggestion-truncated')) {
        // Expand
        contentEl.classList.remove('suggestion-truncated');
        toggleBtn.textContent = 'Show less';
    } else {
        // Collapse
        contentEl.classList.add('suggestion-truncated');
        toggleBtn.textContent = 'Show more';
    }
}

// Save execution check
async function saveExecutionCheck(issueId, textareaId) {
    try {
        const textarea = document.getElementById(textareaId);
        const executionCheck = textarea.value;
        
        await apiRequest(`/issues/${issueId}/execution-check`, {
            method: 'PUT',
            body: JSON.stringify({ execution_check: executionCheck }),
        });
        
        showMessage('Saved successfully', 'success');
    } catch (error) {
        showMessage('Save failed: ' + error.message, 'error');
    }
}

// Save what happened
async function saveWhatHappened(issueId, textareaId) {
    try {
        const textarea = document.getElementById(textareaId);
        const whatHappened = textarea.value;
        
        // Try to save to what_happened field, fallback to sources if endpoint doesn't exist
        try {
            await apiRequest(`/issues/${issueId}/what-happened`, {
                method: 'PUT',
                body: JSON.stringify({ what_happened: whatHappened }),
            });
        } catch (e) {
            // If what-happened endpoint doesn't exist, try using sources field
            await apiRequest(`/issues/${issueId}/sources`, {
                method: 'PUT',
                body: JSON.stringify({ sources: whatHappened ? [whatHappened] : [] }),
            });
        }
        
        showMessage('Saved successfully', 'success');
    } catch (error) {
        showMessage('Save failed: ' + error.message, 'error');
    }
}

// HTML escape function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose functions to global scope for onclick usage
window.saveExecutionCheck = saveExecutionCheck;
window.saveWhatHappened = saveWhatHappened;
window.toggleSuggestion = toggleSuggestion;
window.useTopic = useTopic;
window.hideAuthModal = hideAuthModal;
window.downloadMindmap = downloadMindmap;
window.showLoginFromRegister = showLoginFromRegister;
window.showLoginFromForgot = showLoginFromForgot;
window.showForgotPassword = showForgotPassword;
window.sendResetCode = sendResetCode;
