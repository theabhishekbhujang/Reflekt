/**
 * REFLEKT - Utility Functions
 */

const Utils = {
  /**
   * Generate a unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Format date to readable string
   */
  formatDate(date, format = 'full') {
    const d = new Date(date);
    const options = {
      full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      dayMonth: { month: 'short', day: 'numeric' },
      monthYear: { month: 'long', year: 'numeric' }
    };
    return d.toLocaleDateString('en-US', options[format] || options.full);
  },

  /**
   * Format relative time
   */
  formatRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return this.formatDate(date, 'short');
  },

  /**
   * Count words in text
   */
  countWords(text) {
    if (!text) return 0;
    const stripped = text.replace(/<[^>]*>/g, ' ').trim();
    if (!stripped) return 0;
    return stripped.split(/\s+/).filter(word => word.length > 0).length;
  },

  /**
   * Strip HTML tags
   */
  stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },

  /**
   * Truncate text
   */
  truncate(text, length = 150) {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + '...';
  },

  /**
   * Get start of day
   */
  startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Check if same day
   */
  isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  },

  /**
   * Get days between dates
   */
  daysBetween(date1, date2) {
    const d1 = this.startOfDay(date1);
    const d2 = this.startOfDay(date2);
    return Math.floor((d2 - d1) / 86400000);
  },

  /**
   * DOM helper - query selector
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * DOM helper - query selector all
   */
  $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },

  /**
   * Create element with attributes
   */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') el.className = value;
      else if (key === 'innerHTML') el.innerHTML = value;
      else if (key === 'textContent') el.textContent = value;
      else if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key.startsWith('data')) {
        el.dataset[key.slice(4).toLowerCase()] = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child) {
        el.appendChild(child);
      }
    });
    return el;
  },

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Parse color for mood
   */
  getMoodColor(mood) {
    const colors = {
      5: 'var(--mood-amazing)',
      4: 'var(--mood-good)',
      3: 'var(--mood-okay)',
      2: 'var(--mood-bad)',
      1: 'var(--mood-terrible)'
    };
    return colors[mood] || 'var(--text-tertiary)';
  },

  /**
   * Get mood emoji
   */
  getMoodEmoji(mood) {
    const emojis = {
      5: '😄',
      4: '🙂',
      3: '😐',
      2: '😔',
      1: '😢'
    };
    return emojis[mood] || '—';
  },

  /**
   * Get mood label
   */
  getMoodLabel(mood) {
    const labels = {
      5: 'Amazing',
      4: 'Good',
      3: 'Okay',
      2: 'Bad',
      1: 'Terrible'
    };
    return labels[mood] || 'Unknown';
  },

  /**
   * Animation helper
   */
  animate(element, animationClass, duration = 250) {
    return new Promise(resolve => {
      element.classList.add(animationClass);
      setTimeout(() => {
        element.classList.remove(animationClass);
        resolve();
      }, duration);
    });
  },

  /**
   * Show confetti celebration
   */
  showConfetti() {
    const colors = ['#a855f7', '#f97316', '#22c55e', '#facc15', '#ef4444'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  }
};
