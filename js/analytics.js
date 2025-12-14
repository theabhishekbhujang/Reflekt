/**
 * REFLEKT - Analytics Module
 */

const Analytics = {
    /**
     * Initialize analytics view
     */
    init() {
        this.render();
    },

    /**
     * Render analytics
     */
    render() {
        this.renderStats();
        this.renderMoodChart();
        this.renderActivityChart();
        this.renderTagsChart();
    },

    /**
     * Render stats cards
     */
    renderStats() {
        const stats = Journal.getStats();

        document.getElementById('stat-entries').textContent = stats.totalEntries.toLocaleString();
        document.getElementById('stat-words').textContent = stats.totalWords.toLocaleString();
        document.getElementById('stat-streak').textContent = stats.currentStreak;

        if (stats.avgMood) {
            const mood = Mood.getMood(stats.avgMood);
            document.getElementById('stat-mood').textContent = mood ? mood.emoji : '—';
        } else {
            document.getElementById('stat-mood').textContent = '—';
        }

        // Update streak in sidebar
        document.getElementById('streak-count').textContent = stats.currentStreak;
    },

    /**
     * Render mood chart
     */
    renderMoodChart() {
        Mood.renderChart('mood-chart');
    },

    /**
     * Render activity chart (last 7 days)
     */
    renderActivityChart() {
        const container = document.getElementById('activity-chart');
        if (!container) return;

        const entries = Storage.getEntries();
        const now = new Date();
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayEntries = entries.filter(e => {
                const entryDate = new Date(e.createdAt);
                return entryDate >= date && entryDate < nextDate;
            });

            const wordCount = dayEntries.reduce((acc, e) => {
                return acc + Utils.countWords(Utils.stripHtml(e.content));
            }, 0);

            data.push({
                date: date,
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                entries: dayEntries.length,
                words: wordCount
            });
        }

        const maxWords = Math.max(...data.map(d => d.words), 1);

        container.innerHTML = data.map(day => {
            const height = (day.words / maxWords) * 100;
            return `
        <div class="chart-bar" 
             style="height: ${Math.max(height, 4)}%;"
             data-label="${day.label}"
             title="${day.label}: ${day.words} words">
        </div>
      `;
        }).join('');
    },

    /**
     * Render tags chart
     */
    renderTagsChart() {
        const container = document.getElementById('tags-chart');
        if (!container) return;

        const tags = Journal.getAllTags().slice(0, 10);

        if (tags.length === 0) {
            container.innerHTML = '<p class="text-tertiary text-sm">No tags yet. Add tags to your entries to see them here!</p>';
            return;
        }

        container.innerHTML = tags.map(({ tag, count }) => `
      <div class="tag-stat">
        <span>${Utils.escapeHtml(tag)}</span>
        <span class="count">${count}</span>
      </div>
    `).join('');
    },

    /**
     * Get writing insights
     */
    getInsights() {
        const entries = Storage.getEntries();
        const insights = [];

        if (entries.length === 0) {
            return ['Start journaling to see personalized insights!'];
        }

        const stats = Journal.getStats();

        // Streak insight
        if (stats.currentStreak >= 7) {
            insights.push(`🔥 Amazing! You're on a ${stats.currentStreak}-day streak!`);
        } else if (stats.currentStreak >= 3) {
            insights.push(`🔥 Great job! ${stats.currentStreak} days in a row!`);
        }

        // Total entries milestone
        if (stats.totalEntries >= 100) {
            insights.push(`📚 Wow! You've written ${stats.totalEntries} entries!`);
        } else if (stats.totalEntries >= 50) {
            insights.push(`📚 Great progress! ${stats.totalEntries} entries and counting!`);
        } else if (stats.totalEntries >= 10) {
            insights.push(`📝 You've written ${stats.totalEntries} entries. Keep it up!`);
        }

        // Word count insight
        if (stats.totalWords >= 10000) {
            insights.push(`✍️ You've written over ${Math.floor(stats.totalWords / 1000)}k words!`);
        }

        // Add mood insights
        insights.push(...Mood.getInsights(entries));

        return insights.slice(0, 5);
    }
};
