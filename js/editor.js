/**
 * REFLEKT - Rich Text Editor Module
 */

const Editor = {
    modal: null,
    titleInput: null,
    contentEditor: null,
    moodSelector: null,
    tagsWrapper: null,
    tagInput: null,
    wordCount: null,
    currentEntryId: null,
    selectedMood: null,
    currentTags: [],
    autoSaveTimeout: null,

    /**
     * Initialize editor
     */
    init() {
        this.modal = document.getElementById('entry-modal');
        this.titleInput = document.getElementById('entry-title');
        this.contentEditor = document.getElementById('entry-content');
        this.moodSelector = document.getElementById('mood-selector');
        this.tagsWrapper = document.getElementById('tags-wrapper');
        this.tagInput = document.getElementById('tag-input');
        this.wordCount = document.getElementById('word-count');

        this.setupToolbar();
        this.setupMoodSelector();
        this.setupTagInput();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
        this.setupModalEvents();
    },

    /**
     * Setup toolbar buttons
     */
    setupToolbar() {
        const toolbar = document.getElementById('editor-toolbar');
        toolbar.querySelectorAll('button[data-command]').forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.dataset.command;
                const value = btn.dataset.value || null;
                document.execCommand(command, false, value);
                this.contentEditor.focus();
                this.updateWordCount();
            });
        });
    },

    /**
     * Setup mood selector
     */
    setupMoodSelector() {
        this.moodSelector.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.moodSelector.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedMood = parseInt(btn.dataset.mood);
                Utils.animate(btn, 'animate-pop');
            });
        });
    },

    /**
     * Setup tag input
     */
    setupTagInput() {
        this.tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                this.addTag(this.tagInput.value.trim());
                this.tagInput.value = '';
            } else if (e.key === 'Backspace' && !this.tagInput.value) {
                this.removeLastTag();
            }
        });

        this.tagInput.addEventListener('blur', () => {
            if (this.tagInput.value.trim()) {
                this.addTag(this.tagInput.value.trim());
                this.tagInput.value = '';
            }
        });
    },

    /**
     * Add a tag
     */
    addTag(tagText) {
        if (!tagText || this.currentTags.includes(tagText)) return;
        if (this.currentTags.length >= 10) return;

        this.currentTags.push(tagText);
        this.renderTags();
    },

    /**
     * Remove a tag
     */
    removeTag(tag) {
        this.currentTags = this.currentTags.filter(t => t !== tag);
        this.renderTags();
    },

    /**
     * Remove last tag
     */
    removeLastTag() {
        if (this.currentTags.length > 0) {
            this.currentTags.pop();
            this.renderTags();
        }
    },

    /**
     * Render tags
     */
    renderTags() {
        // Remove existing tags (not the input)
        this.tagsWrapper.querySelectorAll('.tag').forEach(t => t.remove());

        // Add current tags before input
        this.currentTags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag animate-scale-in';
            tagEl.innerHTML = `
        ${Utils.escapeHtml(tag)}
        <span class="remove-tag" data-tag="${Utils.escapeHtml(tag)}">&times;</span>
      `;
            this.tagsWrapper.insertBefore(tagEl, this.tagInput);
        });

        // Add remove handlers
        this.tagsWrapper.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeTag(btn.dataset.tag);
            });
        });
    },

    /**
     * Setup auto-save
     */
    setupAutoSave() {
        const autoSave = Utils.debounce(() => {
            if (this.currentEntryId) {
                this.saveEntry(true);
            }
        }, 2000);

        this.contentEditor.addEventListener('input', () => {
            this.updateWordCount();
            autoSave();
        });

        this.titleInput.addEventListener('input', autoSave);
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        this.contentEditor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold', false);
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic', false);
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline', false);
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveEntry();
                        break;
                }
            }
        });
    },

    /**
     * Setup modal events
     */
    setupModalEvents() {
        // Close button
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-entry-btn').addEventListener('click', () => this.closeModal());

        // Save button
        document.getElementById('save-entry-btn').addEventListener('click', () => this.saveEntry());

        // Delete button
        document.getElementById('delete-entry-btn').addEventListener('click', () => {
            App.showConfirm('Delete Entry', 'Are you sure you want to delete this entry? This cannot be undone.', () => {
                Journal.delete(this.currentEntryId);
                this.closeModal();
                App.refreshCurrentView();
                App.showToast('Entry deleted', 'success');
            });
        });

        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    },

    /**
     * Update word count
     */
    updateWordCount() {
        const text = this.contentEditor.innerText;
        const count = Utils.countWords(text);
        this.wordCount.textContent = count;
    },

    /**
     * Open new entry
     */
    openNew(template = null) {
        this.reset();
        this.currentEntryId = null;
        document.getElementById('delete-entry-btn').style.display = 'none';

        if (template) {
            const tmpl = Prompts.getTemplate(template);
            if (tmpl) {
                this.titleInput.value = tmpl.name;
                this.contentEditor.innerHTML = tmpl.content;
            }
        }

        this.showModal();
    },

    /**
     * Open existing entry
     */
    openEntry(id) {
        const entry = Journal.getById(id);
        if (!entry) return;

        this.reset();
        this.currentEntryId = id;
        document.getElementById('delete-entry-btn').style.display = 'flex';

        this.titleInput.value = entry.title || '';
        this.contentEditor.innerHTML = entry.content || '';
        this.selectedMood = entry.mood;
        this.currentTags = entry.tags || [];

        // Set mood
        if (entry.mood) {
            const moodBtn = this.moodSelector.querySelector(`[data-mood="${entry.mood}"]`);
            if (moodBtn) moodBtn.classList.add('selected');
        }

        // Set tags
        this.renderTags();
        this.updateWordCount();
        this.showModal();
    },

    /**
     * Open with prompt
     */
    openWithPrompt(promptText) {
        this.reset();
        this.currentEntryId = null;
        document.getElementById('delete-entry-btn').style.display = 'none';

        this.contentEditor.innerHTML = `<p><em>${Utils.escapeHtml(promptText)}</em></p><p><br></p>`;
        this.showModal();

        // Place cursor after prompt
        const range = document.createRange();
        const sel = window.getSelection();
        const lastP = this.contentEditor.querySelector('p:last-child');
        if (lastP) {
            range.setStart(lastP, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },

    /**
     * Show modal
     */
    showModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.contentEditor.focus(), 100);
    },

    /**
     * Close modal
     */
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
    },

    /**
     * Reset editor
     */
    reset() {
        this.titleInput.value = '';
        this.contentEditor.innerHTML = '';
        this.selectedMood = null;
        this.currentTags = [];
        this.currentEntryId = null;
        this.moodSelector.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        this.renderTags();
        this.updateWordCount();
    },

    /**
     * Save entry
     */
    saveEntry(silent = false) {
        const title = this.titleInput.value.trim();
        const content = this.contentEditor.innerHTML;

        if (!title && !Utils.stripHtml(content).trim()) {
            if (!silent) {
                App.showToast('Please add a title or content', 'error');
            }
            return;
        }

        const data = {
            title,
            content,
            mood: this.selectedMood,
            tags: this.currentTags
        };

        if (this.currentEntryId) {
            Journal.update(this.currentEntryId, data);
        } else {
            const entry = Journal.create(data);
            this.currentEntryId = entry.id;
            document.getElementById('delete-entry-btn').style.display = 'flex';
        }

        if (!silent) {
            App.showToast('Entry saved!', 'success');
            this.closeModal();
            App.refreshCurrentView();
        }
    }
};
