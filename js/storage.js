/**
 * REFLEKT - Storage Module
 * Handles localStorage persistence and data management
 */

const Storage = {
    KEYS: {
        ENTRIES: 'reflekt_entries',
        SETTINGS: 'reflekt_settings',
        STREAK: 'reflekt_streak'
    },

    /**
     * Get data from localStorage
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },

    /**
     * Set data in localStorage
     */
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    },

    /**
     * Get all entries
     */
    getEntries() {
        return this.get(this.KEYS.ENTRIES) || [];
    },

    /**
     * Save all entries
     */
    saveEntries(entries) {
        return this.set(this.KEYS.ENTRIES, entries);
    },

    /**
     * Add entry
     */
    addEntry(entry) {
        const entries = this.getEntries();
        entries.unshift(entry);
        return this.saveEntries(entries);
    },

    /**
     * Update entry
     */
    updateEntry(id, updates) {
        const entries = this.getEntries();
        const index = entries.findIndex(e => e.id === id);
        if (index !== -1) {
            entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
            return this.saveEntries(entries);
        }
        return false;
    },

    /**
     * Delete entry
     */
    deleteEntry(id) {
        const entries = this.getEntries();
        const filtered = entries.filter(e => e.id !== id);
        return this.saveEntries(filtered);
    },

    /**
     * Get entry by ID
     */
    getEntry(id) {
        const entries = this.getEntries();
        return entries.find(e => e.id === id);
    },

    /**
     * Get settings
     */
    getSettings() {
        return this.get(this.KEYS.SETTINGS) || {
            theme: 'dark',
            fontSize: 'medium'
        };
    },

    /**
     * Save settings
     */
    saveSettings(settings) {
        return this.set(this.KEYS.SETTINGS, settings);
    },

    /**
     * Update setting
     */
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        return this.saveSettings(settings);
    },

    /**
     * Get streak data
     */
    getStreak() {
        return this.get(this.KEYS.STREAK) || {
            current: 0,
            longest: 0,
            lastDate: null
        };
    },

    /**
     * Update streak
     */
    updateStreak() {
        const streak = this.getStreak();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (streak.lastDate === today) {
            // Already counted today
            return streak;
        }

        if (streak.lastDate === yesterday) {
            // Consecutive day
            streak.current += 1;
        } else if (streak.lastDate !== today) {
            // Streak broken or first entry
            streak.current = 1;
        }

        streak.lastDate = today;
        streak.longest = Math.max(streak.current, streak.longest);
        this.set(this.KEYS.STREAK, streak);
        return streak;
    },

    /**
     * Check and update streak on app load
     */
    checkStreak() {
        const streak = this.getStreak();
        if (!streak.lastDate) return streak;

        const lastDate = new Date(streak.lastDate);
        const today = new Date();
        const diffDays = Utils.daysBetween(lastDate, today);

        if (diffDays > 1) {
            // Streak is broken
            streak.current = 0;
            this.set(this.KEYS.STREAK, streak);
        }

        return streak;
    },

    /**
     * Export all data as JSON
     */
    exportData() {
        const data = {
            entries: this.getEntries(),
            settings: this.getSettings(),
            streak: this.getStreak(),
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reflekt-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Export as PDF (simple text-based)
     */
    exportPDF() {
        const entries = this.getEntries();
        if (entries.length === 0) {
            App.showToast('No entries to export', 'error');
            return;
        }

        // Create a printable HTML document
        const content = entries.map(entry => `
      <div style="page-break-inside: avoid; margin-bottom: 40px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="margin: 0 0 8px 0; color: #1f2937;">${Utils.escapeHtml(entry.title || 'Untitled')}</h2>
        <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
          ${Utils.formatDate(entry.createdAt, 'full')}
          ${entry.mood ? ` • Mood: ${Utils.getMoodEmoji(entry.mood)} ${Utils.getMoodLabel(entry.mood)}` : ''}
        </p>
        <div style="color: #374151; line-height: 1.6;">${entry.content}</div>
        ${entry.tags && entry.tags.length > 0 ? `
          <p style="margin: 16px 0 0 0; color: #9333ea; font-size: 14px;">
            Tags: ${entry.tags.join(', ')}
          </p>
        ` : ''}
      </div>
    `).join('');

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reflekt Journal Export</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #1f2937;
          }
          h1 {
            text-align: center;
            color: #7c3aed;
            margin-bottom: 40px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>📔 My Reflekt Journal</h1>
        ${content}
        <p style="text-align: center; color: #9ca3af; margin-top: 40px; font-size: 14px;">
          Exported on ${Utils.formatDate(new Date(), 'full')}
        </p>
      </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    },

    /**
     * Import data from JSON
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.entries || !Array.isArray(data.entries)) {
                throw new Error('Invalid data format');
            }

            // Merge entries (avoid duplicates based on ID)
            const existingEntries = this.getEntries();
            const existingIds = new Set(existingEntries.map(e => e.id));
            const newEntries = data.entries.filter(e => !existingIds.has(e.id));

            this.saveEntries([...newEntries, ...existingEntries]);

            if (data.settings) {
                this.saveSettings({ ...this.getSettings(), ...data.settings });
            }

            return { success: true, imported: newEntries.length };
        } catch (e) {
            console.error('Import error:', e);
            return { success: false, error: e.message };
        }
    },

    /**
     * Clear all data
     */
    clearAll() {
        Object.values(this.KEYS).forEach(key => this.remove(key));
    }
};
