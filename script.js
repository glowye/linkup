// API Base URL - automatically detect environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://linkup-backend-production-ebe5.up.railway.app';

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
const navGallery = document.getElementById('nav-gallery');
const navRecords = document.getElementById('nav-records');
const navLinks = document.getElementById('nav-links');

// Current page state
let currentPage = 'home';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Show home page by default for all users
    showPage('home');
    
    if (authToken) {
        checkAuth();
    } else {
        // Show navigation but keep auth buttons visible
        navLinks.classList.remove('hidden');
        showLoginBtn.classList.remove('hidden');
        showRegisterBtn.classList.remove('hidden');
        userWelcome.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    }
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    navHome.addEventListener('click', () => {
        showPage('home');
    });
    
    navGallery.addEventListener('click', () => {
        showPage('gallery');
    });
    
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

    // Show login form
    showLoginBtn.addEventListener('click', () => {
        showAuthModal();
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    // Show register form
    showRegisterBtn.addEventListener('click', () => {
        showAuthModal();
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
    
    // Close auth modal when clicking outside
    authSection.addEventListener('click', (e) => {
        if (e.target === authSection) {
            hideAuthModal();
        }
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
    document.getElementById('refresh-topics').addEventListener('click', () => {
        loadTopicCards();
    });
}

// Load topic cards (Pi-style)
function loadTopicCards() {
    const topicCards = document.getElementById('topic-cards');
    const topics = [
        { icon: '💼', title: 'How to give constructive feedback', desc: 'Learn to provide feedback that helps, not hurts' },
        { icon: '🗣️', title: 'Setting boundaries at work', desc: 'Say no professionally without burning bridges' },
        { icon: '👥', title: 'Handling difficult conversations', desc: 'Navigate tough talks with confidence' },
        { icon: '🤝', title: 'Building rapport with colleagues', desc: 'Create stronger workplace relationships' },
        { icon: '💬', title: 'Active listening techniques', desc: 'Truly hear and understand others' },
        { icon: '⚡', title: 'Dealing with interruptions', desc: 'Handle interruptions gracefully' },
        { icon: '🎯', title: 'Expressing needs clearly', desc: 'Communicate what you want effectively' },
        { icon: '😤', title: 'Managing emotional reactions', desc: 'Stay calm in heated moments' },
        { icon: '🤔', title: 'Asking for what you deserve', desc: 'Advocate for yourself professionally' },
    ];

    // Shuffle and take 6 random topics
    const shuffled = topics.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    topicCards.innerHTML = selected.map(topic => `
        <div class="topic-card bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-4 border border-pink-200 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105" 
             onclick="useTopic('${topic.title}')">
            <div class="flex items-start space-x-3">
                <span class="text-2xl">${topic.icon}</span>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">${topic.title}</h4>
                    <p class="text-xs text-gray-600">${topic.desc}</p>
                </div>
            </div>
        </div>
    `).join('');
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
    authSection.classList.remove('hidden');
    // Show login form by default
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

// Hide auth modal
function hideAuthModal() {
    authSection.classList.add('hidden');
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
        // Keep modal open for login
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
        hideAuthModal();
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
            const date = new Date(issue.created_at).toLocaleString('en-US');
            
            // Create execution check input
            const executionCheckId = `exec-check-${issue.id}`;
            const executionCheckValue = issue.execution_check || '';
            
            // Format suggestion with line breaks
            const suggestion = issue.suggestion || 'No suggestion';
            const formattedSuggestion = formatSuggestion(suggestion);
            const suggestionId = `suggestion-${issue.id}`;
            const isLong = suggestion.length > 200; // Consider long if more than 200 chars
            
            // Format sources
            const sources = issue.sources || [];
            const sourcesHtml = sources.length > 0 
                ? `<div class="space-y-1">
                    ${sources.map(source => `
                        <div class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            📚 ${escapeHtml(source)}
                        </div>
                    `).join('')}
                   </div>`
                : '<span class="text-xs text-gray-400">No sources</span>';
            
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
                    ${sourcesHtml}
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

// HTML escape function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose functions to global scope for onclick usage
window.saveExecutionCheck = saveExecutionCheck;
window.toggleSuggestion = toggleSuggestion;
window.useTopic = useTopic;
window.hideAuthModal = hideAuthModal;
