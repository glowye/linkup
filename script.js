// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Store token
let authToken = localStorage.getItem('authToken');

// DOM elements
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const homePage = document.getElementById('home-page');
const recordsPage = document.getElementById('records-page');
const userWelcome = document.getElementById('user-welcome');
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const navHome = document.getElementById('nav-home');
const navRecords = document.getElementById('nav-records');
const navLinks = document.getElementById('nav-links');

// Current page state
let currentPage = 'home';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        checkAuth();
    } else {
        showAuthSection();
    }
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    navHome.addEventListener('click', () => {
        showPage('home');
    });
    
    navRecords.addEventListener('click', () => {
        showPage('records');
    });

    // Show login form
    showLoginBtn.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    // Show register form
    showRegisterBtn.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Login form submit
    document.getElementById('login-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        await login(username, password);
    });

    // Register form submit
    document.getElementById('register-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        await register(username, email, password);
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        logout();
    });

    // Submit issue form
    document.getElementById('issue-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = document.getElementById('issue-question').value;
        await submitIssue(question);
    });
}

// Show page
function showPage(page) {
    currentPage = page;
    if (page === 'home') {
        homePage.classList.remove('hidden');
        recordsPage.classList.add('hidden');
        navHome.classList.add('font-semibold');
        navHome.classList.remove('text-gray-700');
        navHome.classList.add('text-black');
        navRecords.classList.remove('text-blue-600', 'font-semibold');
        navRecords.classList.add('text-gray-700');
    } else if (page === 'records') {
        homePage.classList.add('hidden');
        recordsPage.classList.remove('hidden');
        navRecords.classList.add('text-blue-600', 'font-semibold');
        navRecords.classList.remove('text-gray-700');
        navHome.classList.remove('text-blue-600', 'font-semibold');
        navHome.classList.add('text-black');
        loadRecords();
    }
}

// Show auth section
function showAuthSection() {
    authSection.classList.remove('hidden');
    homePage.classList.add('hidden');
    recordsPage.classList.add('hidden');
    navLinks.classList.add('hidden');
    userWelcome.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    showLoginBtn.classList.remove('hidden');
    showRegisterBtn.classList.remove('hidden');
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
            logout();
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
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Login
async function login(username, password) {
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        authToken = data.access_token;
        localStorage.setItem('authToken', authToken);
        await checkAuth();
        showMessage('Login successful', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
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
        logout();
    }
}

// Logout
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    userWelcome.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    showAuthSection();
    showLoginBtn.classList.remove('hidden');
    showRegisterBtn.classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
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
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No records yet</td></tr>';
            return;
        }

        issues.forEach(issue => {
            const row = document.createElement('tr');
            const date = new Date(issue.created_at).toLocaleString('en-US');
            
            // Create execution check input
            const executionCheckId = `exec-check-${issue.id}`;
            const executionCheckValue = issue.execution_check || '';
            
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
                <td class="px-6 py-4 text-sm">
                    <div class="flex items-center space-x-2">
                        <textarea 
                            id="${executionCheckId}" 
                            rows="2" 
                            class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Record execution status...">${escapeHtml(executionCheckValue)}</textarea>
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

// Format suggestion text with proper line breaks
function formatSuggestion(text) {
    if (!text) return 'No suggestion';
    
    // Escape HTML to prevent XSS
    let formatted = escapeHtml(text);
    
    // Remove leading whitespace/newlines to ensure first line is left-aligned
    formatted = formatted.trimStart();
    
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

// HTML escape function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose functions to global scope for onclick usage
window.saveExecutionCheck = saveExecutionCheck;
window.toggleSuggestion = toggleSuggestion;
