/**
 * REFLEKT - Journal Module
 * Handles journal entry CRUD operations
 */

const Journal = {
    currentEntry: null,

    /**
     * Create a new entry
     */
    create(data = {}) {
        const entry = {
            id: Utils.generateId(),
            title: data.title || '',
            content: data.content || '',
            mood: data.mood || null,
            tags: data.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        Storage.addEntry(entry);
        Storage.updateStreak();

        return entry;
    },

    /**
     * Update an entry
     */
    update(id, updates) {
        return Storage.updateEntry(id, updates);
    },

    /**
     * Delete an entry
     */
    delete(id) {
        return Storage.deleteEntry(id);
    },

    /**
     * Get all entries
     */
    getAll() {
        return Storage.getEntries();
    },

    /**
     * Get entry by ID
     */
    getById(id) {
        return Storage.getEntry(id);
    },

    /**
     * Search entries
     */
    search(query, filters = {}) {
        let entries = this.getAll();

        // Text search
        if (query) {
            const lowerQuery = query.toLowerCase();
            entries = entries.filter(entry => {
                const titleMatch = entry.title?.toLowerCase().includes(lowerQuery);
                const contentMatch = Utils.stripHtml(entry.content).toLowerCase().includes(lowerQuery);
                const tagMatch = entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
                return titleMatch || contentMatch || tagMatch;
            });
        }

        // Mood filter
        if (filters.mood) {
            entries = entries.filter(e => e.mood === filters.mood);
        }

        // Date range filter
        if (filters.startDate) {
            entries = entries.filter(e => new Date(e.createdAt) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            entries = entries.filter(e => new Date(e.createdAt) <= new Date(filters.endDate));
        }

        // Tag filter
        if (filters.tag) {
            entries = entries.filter(e => e.tags?.includes(filters.tag));
        }

        return entries;
    },

    /**
     * Get entries by date
     */
    getByDate(date) {
        const start = Utils.startOfDay(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return this.getAll().filter(entry => {
            const entryDate = new Date(entry.createdAt);
            return entryDate >= start && entryDate < end;
        });
    },

    /**
     * Get all unique tags
     */
    getAllTags() {
        const entries = this.getAll();
        const tagCounts = {};

        entries.forEach(entry => {
            entry.tags?.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    },

    /**
     * Get statistics
     */
    getStats() {
        const entries = this.getAll();
        const streak = Storage.checkStreak();

        const totalWords = entries.reduce((acc, entry) => {
            return acc + Utils.countWords(Utils.stripHtml(entry.content));
        }, 0);

        const avgMood = Mood.calculateAverage(entries);

        return {
            totalEntries: entries.length,
            totalWords,
            currentStreak: streak.current,
            longestStreak: streak.longest,
            avgMood
        };
    },

    /**
     * Render entries list
     */
    renderList(entries, containerId = 'entries-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = '';
            document.getElementById('empty-state').style.display = 'flex';
            return;
        }

        document.getElementById('empty-state').style.display = 'none';

        container.innerHTML = entries.map((entry, index) => {
            const moodColor = entry.mood ? Utils.getMoodColor(entry.mood) : 'var(--text-tertiary)';
            const preview = Utils.truncate(Utils.stripHtml(entry.content), 150);
            const dateStr = Utils.formatRelativeTime(entry.createdAt);

            return `
        <article class="entry-card card card-glass card-hover animate-fade-in-up" 
                 data-id="${entry.id}"
                 style="animation-delay: ${index * 50}ms">
          <div class="mood-indicator" style="background: ${moodColor}"></div>
          <div class="content">
            <div class="date">${dateStr}</div>
            <h3 class="title">${Utils.escapeHtml(entry.title) || 'Untitled Entry'}</h3>
            <p class="preview line-clamp-2">${preview || 'No content...'}</p>
            ${entry.tags && entry.tags.length > 0 ? `
              <div class="tags">
                ${entry.tags.slice(0, 3).map(tag => `
                  <span class="tag">${Utils.escapeHtml(tag)}</span>
                `).join('')}
                ${entry.tags.length > 3 ? `<span class="tag">+${entry.tags.length - 3}</span>` : ''}
              </div>
            ` : ''}
          </div>
        </article>
      `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.entry-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                Editor.openEntry(id);
            });
        });
    }
};
