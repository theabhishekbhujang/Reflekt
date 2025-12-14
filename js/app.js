/**
 * REFLEKT - Main App Controller
 */

const App = {
    currentView: 'journal',
    sidebarOpen: false,

    /**
     * Initialize app
     */
    init() {
        this.loadTheme();
        this.setupNavigation();
        this.setupNewEntryButtons();
        this.setupThemeToggle();
        this.setupSettings();
        this.setupMobileMenu();
        this.setupPromptsView();

        // Initialize modules
        Editor.init();
        Search.init();
        Calendar.init();
        Analytics.init();

        // Load initial view
        this.refreshCurrentView();
        this.updateDate();

        // Check streak
        Storage.checkStreak();
        this.updateStreak();

        console.log('✨ Reflekt initialized!');
    },

    /**
     * Setup navigation
     */
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-view]');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
                this.closeMobileMenu();
            });
        });
    },

    /**
     * Switch view
     */
    switchView(view) {
        this.currentView = view;

        // Update nav
        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.toggle('active', v.id === `${view}-view`);
        });

        // Update title
        const titles = {
            journal: 'Journal',
            calendar: 'Calendar',
            analytics: 'Analytics',
            prompts: 'Prompts',
            settings: 'Settings'
        };
        document.getElementById('view-title').textContent = titles[view] || 'Journal';

        // Refresh view content
        this.refreshCurrentView();
    },

    /**
     * Refresh current view
     */
    refreshCurrentView() {
        switch (this.currentView) {
            case 'journal':
                const entries = Journal.getAll();
                Journal.renderList(entries);
                break;
            case 'calendar':
                Calendar.render();
                break;
            case 'analytics':
                Analytics.render();
                break;
            case 'prompts':
                this.renderPrompts();
                break;
        }
        this.updateStreak();
    },

    /**
     * Setup new entry buttons
     */
    setupNewEntryButtons() {
        document.getElementById('new-entry-btn').addEventListener('click', () => {
            Editor.openNew();
        });

        document.getElementById('empty-new-entry-btn')?.addEventListener('click', () => {
            Editor.openNew();
        });
    },

    /**
     * Setup theme toggle
     */
    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        const darkModeToggle = document.getElementById('dark-mode-toggle');

        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        darkModeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        this.updateDarkModeToggle();
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        Storage.updateSetting('theme', newTheme);
        this.updateDarkModeToggle();
    },

    /**
     * Load theme from storage
     */
    loadTheme() {
        const settings = Storage.getSettings();
        document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
    },

    /**
     * Update dark mode toggle state
     */
    updateDarkModeToggle() {
        const toggle = document.getElementById('dark-mode-toggle');
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggle.classList.toggle('active', isDark);
    },

    /**
     * Setup settings
     */
    setupSettings() {
        // Export JSON
        document.getElementById('export-json-btn').addEventListener('click', () => {
            Storage.exportData();
            this.showToast('Data exported!', 'success');
        });

        // Export PDF
        document.getElementById('export-pdf-btn').addEventListener('click', () => {
            Storage.exportPDF();
        });

        // Import
        const importFile = document.getElementById('import-file');
        document.getElementById('import-btn').addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = Storage.importData(e.target.result);
                    if (result.success) {
                        this.showToast(`Imported ${result.imported} entries!`, 'success');
                        this.refreshCurrentView();
                    } else {
                        this.showToast('Import failed: ' + result.error, 'error');
                    }
                };
                reader.readAsText(file);
            }
            importFile.value = '';
        });

        // Clear data
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            this.showConfirm(
                'Clear All Data',
                'Are you sure you want to delete all your entries and settings? This cannot be undone.',
                () => {
                    Storage.clearAll();
                    this.refreshCurrentView();
                    this.showToast('All data cleared', 'success');
                }
            );
        });
    },

    /**
     * Setup mobile menu
     */
    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        menuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
    },

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        this.sidebarOpen = !this.sidebarOpen;
        sidebar.classList.toggle('open', this.sidebarOpen);
        overlay.classList.toggle('active', this.sidebarOpen);
    },

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        this.sidebarOpen = false;
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    },

    /**
     * Setup prompts view
     */
    setupPromptsView() {
        // Category filters
        document.getElementById('prompt-categories').addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                document.querySelectorAll('#prompt-categories .tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.generateRandomPrompt(e.target.dataset.category);
            }
        });

        // New prompt button
        document.getElementById('new-prompt-btn').addEventListener('click', () => {
            const activeCategory = document.querySelector('#prompt-categories .tag.active');
            this.generateRandomPrompt(activeCategory?.dataset.category || 'all');
        });

        // Random prompt click
        document.getElementById('random-prompt').addEventListener('click', () => {
            const promptText = document.getElementById('random-prompt-text').textContent;
            if (promptText && promptText !== 'Click to get a random prompt...') {
                Editor.openWithPrompt(promptText);
            } else {
                this.generateRandomPrompt('all');
            }
        });

        // Render templates
        this.renderTemplates();

        // Initial prompt
        this.generateRandomPrompt('all');
    },

    /**
     * Generate random prompt
     */
    generateRandomPrompt(category = 'all') {
        const prompt = Prompts.getRandomPrompt(category);
        const textEl = document.getElementById('random-prompt-text');

        // Animate
        textEl.style.opacity = '0';
        setTimeout(() => {
            textEl.textContent = prompt.text;
            textEl.style.opacity = '1';
        }, 150);
    },

    /**
     * Render prompts
     */
    renderPrompts() {
        this.generateRandomPrompt('all');
    },

    /**
     * Render templates
     */
    renderTemplates() {
        const container = document.getElementById('templates-grid');
        const templates = Prompts.getAllTemplates();

        container.innerHTML = templates.map(template => `
      <div class="template-card card card-glass card-hover" data-template="${template.id}">
        <div class="template-icon">${template.icon}</div>
        <h4 class="template-title">${template.name}</h4>
        <p class="template-description">${template.description}</p>
      </div>
    `).join('');

        container.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                Editor.openNew(card.dataset.template);
            });
        });
    },

    /**
     * Update date display
     */
    updateDate() {
        document.getElementById('header-date').textContent = Utils.formatDate(new Date(), 'full');
    },

    /**
     * Update streak display
     */
    updateStreak() {
        const streak = Storage.checkStreak();
        document.getElementById('streak-count').textContent = streak.current;
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate-fade-in-right`;

        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Show confirm dialog
     */
    showConfirm(title, message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;

        modal.classList.add('active');

        const cancelBtn = document.getElementById('confirm-cancel');
        const okBtn = document.getElementById('confirm-ok');

        const cleanup = () => {
            modal.classList.remove('active');
            cancelBtn.removeEventListener('click', handleCancel);
            okBtn.removeEventListener('click', handleOk);
        };

        const handleCancel = () => cleanup();
        const handleOk = () => {
            cleanup();
            onConfirm();
        };

        cancelBtn.addEventListener('click', handleCancel);
        okBtn.addEventListener('click', handleOk);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: New entry
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        Editor.openNew();
    }

    // Ctrl/Cmd + /: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
});
