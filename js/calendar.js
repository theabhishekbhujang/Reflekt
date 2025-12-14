/**
 * REFLEKT - Calendar Module
 */

const Calendar = {
    currentDate: new Date(),
    selectedDate: null,

    /**
     * Initialize calendar
     */
    init() {
        this.setupNavigation();
        this.render();
    },

    /**
     * Setup navigation buttons
     */
    setupNavigation() {
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });
    },

    /**
     * Render calendar
     */
    render() {
        this.renderTitle();
        this.renderGrid();
        this.renderSelectedDateEntries();
    },

    /**
     * Render month/year title
     */
    renderTitle() {
        const title = document.getElementById('calendar-title');
        title.textContent = this.currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    },

    /**
     * Render calendar grid
     */
    renderGrid() {
        const grid = document.getElementById('calendar-grid');
        const entries = Storage.getEntries();

        // Get first day of month and total days
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let html = dayNames.map(day => `
      <div class="calendar-day-header">${day}</div>
    `).join('');

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            html += `<div class="calendar-day other-month">${day}</div>`;
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();

            // Check if there are entries for this day
            const dayEntries = entries.filter(e => {
                const entryDate = new Date(e.createdAt);
                return entryDate.toDateString() === date.toDateString();
            });
            const hasEntry = dayEntries.length > 0;

            const classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            if (hasEntry) classes.push('has-entry');

            html += `
        <div class="${classes.join(' ')}" data-date="${date.toISOString()}">
          ${day}
        </div>
      `;
        }

        // Next month days
        const remainingDays = 42 - (startingDay + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
            html += `<div class="calendar-day other-month">${day}</div>`;
        }

        grid.innerHTML = html;

        // Add click handlers
        grid.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const date = new Date(dayEl.dataset.date);
                this.selectDate(date);
            });
        });
    },

    /**
     * Select a date
     */
    selectDate(date) {
        this.selectedDate = date;
        this.renderGrid();
        this.renderSelectedDateEntries();
    },

    /**
     * Render entries for selected date
     */
    renderSelectedDateEntries() {
        const container = document.getElementById('calendar-entries-list');
        const titleSpan = document.getElementById('selected-date');

        if (!this.selectedDate) {
            this.selectedDate = new Date();
        }

        titleSpan.textContent = Utils.formatDate(this.selectedDate, 'full');

        const entries = Journal.getByDate(this.selectedDate);

        if (entries.length === 0) {
            container.innerHTML = `
        <div class="empty-state" style="padding: var(--space-8);">
          <p class="text-secondary">No entries for this date.</p>
          <button class="btn btn-primary" onclick="Editor.openNew()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Write Entry
          </button>
        </div>
      `;
            return;
        }

        container.innerHTML = entries.map(entry => {
            const moodColor = entry.mood ? Utils.getMoodColor(entry.mood) : 'var(--text-tertiary)';
            const preview = Utils.truncate(Utils.stripHtml(entry.content), 100);

            return `
        <article class="entry-card card card-glass card-hover" data-id="${entry.id}">
          <div class="mood-indicator" style="background: ${moodColor}"></div>
          <div class="content">
            <h3 class="title">${Utils.escapeHtml(entry.title) || 'Untitled Entry'}</h3>
            <p class="preview">${preview || 'No content...'}</p>
          </div>
        </article>
      `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.entry-card').forEach(card => {
            card.addEventListener('click', () => {
                Editor.openEntry(card.dataset.id);
            });
        });
    },

    /**
     * Navigate to today
     */
    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.render();
    }
};
