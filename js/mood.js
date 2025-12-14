/**
 * REFLEKT - Mood Tracking Module
 */

const Mood = {
    levels: [
        { value: 5, emoji: '😄', label: 'Amazing', color: 'var(--mood-amazing)' },
        { value: 4, emoji: '🙂', label: 'Good', color: 'var(--mood-good)' },
        { value: 3, emoji: '😐', label: 'Okay', color: 'var(--mood-okay)' },
        { value: 2, emoji: '😔', label: 'Bad', color: 'var(--mood-bad)' },
        { value: 1, emoji: '😢', label: 'Terrible', color: 'var(--mood-terrible)' }
    ],

    /**
     * Get mood by value
     */
    getMood(value) {
        return this.levels.find(m => m.value === value);
    },

    /**
     * Calculate average mood from entries
     */
    calculateAverage(entries) {
        const moodEntries = entries.filter(e => e.mood);
        if (moodEntries.length === 0) return null;

        const sum = moodEntries.reduce((acc, e) => acc + e.mood, 0);
        return Math.round(sum / moodEntries.length);
    },

    /**
     * Get mood distribution
     */
    getDistribution(entries) {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        entries.forEach(entry => {
            if (entry.mood) {
                distribution[entry.mood]++;
            }
        });
        return distribution;
    },

    /**
     * Get mood trend (last 7 days)
     */
    getTrend(entries, days = 7) {
        const now = new Date();
        const trend = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayEntries = entries.filter(e => {
                const entryDate = new Date(e.createdAt);
                return entryDate >= date && entryDate < nextDate;
            });

            const moodEntries = dayEntries.filter(e => e.mood);
            const avgMood = moodEntries.length > 0
                ? Math.round(moodEntries.reduce((acc, e) => acc + e.mood, 0) / moodEntries.length)
                : null;

            trend.push({
                date: date,
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                mood: avgMood,
                entryCount: dayEntries.length
            });
        }

        return trend;
    },

    /**
     * Get mood insights
     */
    getInsights(entries) {
        const insights = [];
        const moodEntries = entries.filter(e => e.mood);

        if (moodEntries.length === 0) {
            return ['Start tracking your mood to see insights!'];
        }

        // Average mood
        const avg = this.calculateAverage(entries);
        const avgMood = this.getMood(avg);
        if (avgMood) {
            insights.push(`Your average mood is ${avgMood.emoji} ${avgMood.label}`);
        }

        // Most common mood
        const distribution = this.getDistribution(entries);
        const maxMood = Object.entries(distribution).reduce((a, b) =>
            b[1] > a[1] ? b : a
        );
        if (maxMood[1] > 0) {
            const mood = this.getMood(parseInt(maxMood[0]));
            insights.push(`${mood.emoji} ${mood.label} is your most common mood`);
        }

        // Recent trend
        const recentEntries = moodEntries.slice(0, 7);
        if (recentEntries.length >= 3) {
            const recentAvg = recentEntries.reduce((acc, e) => acc + e.mood, 0) / recentEntries.length;
            const olderEntries = moodEntries.slice(7, 14);
            if (olderEntries.length >= 3) {
                const olderAvg = olderEntries.reduce((acc, e) => acc + e.mood, 0) / olderEntries.length;
                if (recentAvg > olderAvg + 0.5) {
                    insights.push('📈 Your mood has been improving recently!');
                } else if (recentAvg < olderAvg - 0.5) {
                    insights.push('📉 Your mood has dipped recently. Be kind to yourself.');
                }
            }
        }

        return insights;
    },

    /**
     * Render mood chart
     */
    renderChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = Storage.getEntries();
        const trend = this.getTrend(entries, 7);

        container.innerHTML = trend.map(day => {
            const height = day.mood ? (day.mood / 5) * 100 : 5;
            const mood = day.mood ? this.getMood(day.mood) : null;
            const bgColor = mood ? mood.color : 'var(--bg-tertiary)';

            return `
        <div class="chart-bar" 
             style="height: ${height}%; background: ${bgColor};"
             data-label="${day.label}"
             title="${day.label}: ${mood ? mood.emoji + ' ' + mood.label : 'No entries'}">
        </div>
      `;
        }).join('');
    }
};
