/**
 * REFLEKT - Writing Prompts & Templates
 */

const Prompts = {
    categories: {
        gratitude: {
            name: 'Gratitude',
            icon: '🙏',
            prompts: [
                "What are three things you're grateful for today?",
                "Who made a positive difference in your life recently?",
                "What simple pleasure brought you joy this week?",
                "What ability or skill are you thankful to have?",
                "What challenge helped you grow stronger?",
                "What made you smile today?",
                "What's something beautiful you noticed recently?",
                "Who do you appreciate but rarely thank?",
                "What comfort do you often take for granted?",
                "What opportunity are you grateful for right now?",
                "What lesson are you thankful you learned?",
                "What memory always makes you feel grateful?",
                "What about your health are you thankful for?",
                "What technology makes your life easier?",
                "What's something free that brings you happiness?"
            ]
        },
        reflection: {
            name: 'Reflection',
            icon: '🪞',
            prompts: [
                "What did you learn about yourself this week?",
                "What would you do differently if you could relive today?",
                "What limiting belief is holding you back?",
                "How have you changed in the past year?",
                "What does your ideal day look like?",
                "What are you most proud of accomplishing?",
                "What fear would you like to overcome?",
                "What brings you the most peace?",
                "What patterns do you notice in your behavior?",
                "How do you handle stress differently than before?",
                "What advice would you give your younger self?",
                "What's something you need to forgive yourself for?",
                "What gives your life meaning?",
                "How do you define success?",
                "What would you do if you knew you couldn't fail?",
                "What chapter of your life is closing?",
                "What do you need more of in your life?",
                "What do you need less of?"
            ]
        },
        goals: {
            name: 'Goals',
            icon: '🎯',
            prompts: [
                "What's one small step you can take toward your goal today?",
                "Where do you see yourself in five years?",
                "What habit would transform your life?",
                "What's stopping you from starting?",
                "What would achieving your goal feel like?",
                "What skills do you want to develop this year?",
                "What's one thing you've been putting off?",
                "How can you make progress on your dreams this week?",
                "What does your future self want you to do today?",
                "What's your biggest priority right now?",
                "What would you attempt if resources weren't limited?",
                "What milestone are you working toward?",
                "How can you hold yourself more accountable?",
                "What's your definition of a life well-lived?",
                "What legacy do you want to leave?"
            ]
        },
        emotions: {
            name: 'Emotions',
            icon: '💭',
            prompts: [
                "How are you really feeling right now?",
                "What emotion have you been avoiding lately?",
                "What triggered your strongest feeling today?",
                "How do you typically cope with difficult emotions?",
                "What makes you feel truly alive?",
                "When do you feel most like yourself?",
                "What's weighing on your mind?",
                "What brings you comfort when you're struggling?",
                "How do you show yourself compassion?",
                "What would you say to a friend feeling what you feel?",
                "What does your anxiety want you to know?",
                "When did you last feel completely at peace?",
                "What relationship needs your attention?",
                "How do you express love to yourself?",
                "What makes you feel truly seen and understood?"
            ]
        },
        creativity: {
            name: 'Creativity',
            icon: '✨',
            prompts: [
                "If you could live anywhere, where would it be?",
                "What would you create if you had unlimited time?",
                "Describe your perfect weekend in detail.",
                "If you could have dinner with anyone, who would it be?",
                "What story do you want to tell?",
                "What inspires you most?",
                "If you could master any skill instantly, what would it be?",
                "Describe a place that feels magical to you.",
                "What adventure are you craving?",
                "If you could solve one world problem, what would it be?",
                "What does your dream life look like?",
                "Write about a memory as if it were a movie scene.",
                "What would you do with a completely free year?",
                "Describe yourself through the eyes of someone who loves you.",
                "What makes you unique?"
            ]
        }
    },

    templates: [
        {
            id: 'daily',
            name: 'Daily Reflection',
            icon: '📝',
            description: 'A structured template for daily journaling',
            content: `<h2>Morning Intentions</h2>
<p>What do I want to focus on today?</p>
<p><br></p>

<h2>Gratitude</h2>
<p>Three things I'm grateful for:</p>
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>

<h2>Today's Reflection</h2>
<p>How did today go? What happened?</p>
<p><br></p>

<h2>Lessons & Insights</h2>
<p>What did I learn today?</p>
<p><br></p>

<h2>Tomorrow</h2>
<p>What's one thing I want to accomplish tomorrow?</p>`
        },
        {
            id: 'weekly',
            name: 'Weekly Review',
            icon: '📅',
            description: 'Reflect on your week and plan ahead',
            content: `<h2>Week in Review</h2>
<p>How would I rate this week? (1-10)</p>
<p><br></p>

<h2>Wins & Accomplishments</h2>
<p>What did I accomplish this week?</p>
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>

<h2>Challenges</h2>
<p>What obstacles did I face?</p>
<p><br></p>

<h2>Lessons Learned</h2>
<p>What insights did I gain?</p>
<p><br></p>

<h2>Next Week's Focus</h2>
<p>What are my top 3 priorities for next week?</p>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>`
        },
        {
            id: 'gratitude',
            name: 'Gratitude Journal',
            icon: '🙏',
            description: 'Focus on appreciation and positivity',
            content: `<h2>Today I'm Grateful For...</h2>

<p><strong>1. Something that made me smile:</strong></p>
<p><br></p>

<p><strong>2. A person I appreciate:</strong></p>
<p><br></p>

<p><strong>3. Something I often take for granted:</strong></p>
<p><br></p>

<p><strong>4. A recent positive experience:</strong></p>
<p><br></p>

<p><strong>5. Something about myself I'm grateful for:</strong></p>
<p><br></p>

<h2>How can I spread gratitude today?</h2>
<p><br></p>`
        },
        {
            id: 'mood',
            name: 'Mood Check-In',
            icon: '🌈',
            description: 'Track and understand your emotions',
            content: `<h2>Current Mood Check</h2>
<p>How am I feeling right now? (Rate 1-10)</p>
<p><br></p>

<h2>Emotions Present</h2>
<p>What emotions am I experiencing?</p>
<p><br></p>

<h2>What's Behind These Feelings?</h2>
<p>What might be causing these emotions?</p>
<p><br></p>

<h2>Physical Sensations</h2>
<p>How does my body feel right now?</p>
<p><br></p>

<h2>What Do I Need?</h2>
<p>What would help me feel better or maintain this feeling?</p>
<p><br></p>

<h2>Self-Compassion</h2>
<p>What kind words do I need to hear right now?</p>`
        },
        {
            id: 'goals',
            name: 'Goal Setting',
            icon: '🎯',
            description: 'Define and work toward your goals',
            content: `<h2>My Goal</h2>
<p>What do I want to achieve?</p>
<p><br></p>

<h2>Why It Matters</h2>
<p>Why is this important to me?</p>
<p><br></p>

<h2>Current Reality</h2>
<p>Where am I now in relation to this goal?</p>
<p><br></p>

<h2>Action Steps</h2>
<p>What specific actions will I take?</p>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>

<h2>Potential Obstacles</h2>
<p>What might get in my way?</p>
<p><br></p>

<h2>How I'll Overcome Them</h2>
<p>What's my plan for dealing with obstacles?</p>
<p><br></p>

<h2>Timeline</h2>
<p>When do I want to achieve this by?</p>`
        },
        {
            id: 'freewrite',
            name: 'Freewrite',
            icon: '💭',
            description: 'Just write without any structure',
            content: `<p>Start writing whatever comes to mind. Don't edit, don't judge—just let your thoughts flow...</p>
<p><br></p>
<p><br></p>`
        }
    ],

    /**
     * Get all prompts
     */
    getAllPrompts() {
        const all = [];
        Object.entries(this.categories).forEach(([key, category]) => {
            category.prompts.forEach(prompt => {
                all.push({ text: prompt, category: key, categoryName: category.name });
            });
        });
        return all;
    },

    /**
     * Get prompts by category
     */
    getByCategory(category) {
        if (category === 'all') return this.getAllPrompts();
        const cat = this.categories[category];
        if (!cat) return [];
        return cat.prompts.map(prompt => ({
            text: prompt,
            category,
            categoryName: cat.name
        }));
    },

    /**
     * Get random prompt
     */
    getRandomPrompt(category = 'all') {
        const prompts = this.getByCategory(category);
        return prompts[Math.floor(Math.random() * prompts.length)];
    },

    /**
     * Get template by ID
     */
    getTemplate(id) {
        return this.templates.find(t => t.id === id);
    },

    /**
     * Get all templates
     */
    getAllTemplates() {
        return this.templates;
    }
};
