/**
 * REFLEKT - Search Module
 */

const Search = {
    searchInput: null,
    searchTimeout: null,

    /**
     * Initialize search
     */
    init() {
        this.searchInput = document.getElementById('search-input');

        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch();
            }, 300);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    },

    /**
     * Perform search
     */
    performSearch() {
        const query = this.searchInput.value.trim();

        if (!query) {
            this.clearSearch();
            return;
        }

        // Switch to journal view if not already there
        if (App.currentView !== 'journal') {
            App.switchView('journal');
        }

        const results = Journal.search(query);
        this.renderResults(results, query);
    },

    /**
     * Render search results
     */
    renderResults(entries, query) {
        const container = document.getElementById('entries-list');
        const emptyState = document.getElementById('empty-state');

        if (entries.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <h3 class="title">No results found</h3>
          <p class="description">No entries match "${Utils.escapeHtml(query)}". Try a different search term.</p>
        </div>
      `;
            emptyState.style.display = 'none';
            return;
        }

        // Highlight search terms
        Journal.renderList(entries.map(entry => ({
            ...entry,
            title: this.highlightText(entry.title || '', query),
            content: this.highlightText(entry.content, query)
        })));
    },

    /**
     * Highlight matching text
     */
    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${Utils.escapeHtml(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    /**
     * Clear search
     */
    clearSearch() {
        this.searchInput.value = '';
        App.refreshCurrentView();
    },

    /**
     * Search by tag
     */
    searchByTag(tag) {
        const results = Journal.search('', { tag });
        this.searchInput.value = `tag:${tag}`;
        if (App.currentView !== 'journal') {
            App.switchView('journal');
        }
        Journal.renderList(results);
    },

    /**
     * Search by mood
     */
    searchByMood(mood) {
        const results = Journal.search('', { mood });
        this.searchInput.value = `mood:${Utils.getMoodLabel(mood)}`;
        if (App.currentView !== 'journal') {
            App.switchView('journal');
        }
        Journal.renderList(results);
    }
};
