/**
 * Vitalis AI - Health Analysis Dashboard Logic (Full Feature Version)
 */

// 1. State Management
let users = [
    {
        id: 1,
        name: "Harshi",
        age: 24,
        status: "Pro Member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshi",
        metrics: {
            heartRate: 72,
            steps: 8432,
            stepGoal: 10000,
            sleep: "7h 45m",
            calories: 1240,
            sleepEfficiency: 92,
            recovery: 88,
            macros: { protein: 85, carbs: 150, fats: 45 }
        },
        trends: {
            heartRate: [68, 72, 70, 75, 72, 74, 72],
            predictiveHR: [72, 71, 73, 70, 72, 74, 75, 76, 74, 73],
            sleep: [6, 7, 7.5, 6.5, 8, 7.8, 7.7],
            calories: [1100, 1300, 1200, 1400, 1250, 1350, 1240],
            steps: [7200, 8100, 6500, 9200, 8432, 11000, 9800]
        }
    },
    {
        id: 2,
        name: "Rahul",
        age: 29,
        status: "Free Tier",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        metrics: {
            heartRate: 65,
            steps: 12100,
            stepGoal: 15000,
            sleep: "8h 10m",
            calories: 1850,
            sleepEfficiency: 85,
            recovery: 75,
            macros: { protein: 110, carbs: 220, fats: 60 }
        },
        trends: {
            heartRate: [62, 64, 66, 65, 63, 64, 65],
            predictiveHR: [65, 64, 63, 65, 66, 67, 65, 64, 63, 62],
            sleep: [7, 8, 8.2, 7.5, 8.5, 8.1, 8.1],
            calories: [1500, 1700, 1600, 1900, 1800, 1950, 1850],
            steps: [9000, 11000, 12000, 10500, 12100, 14000, 13000]
        }
    }
];

let currentUser = users[0];
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderUserUI();
    initNavigation();
    initModalLogic();
    startLiveSimulation();
    populatePeopleList();
    initCreativeEffects();
    initParticleSystem();
    initLauncher();
}

function renderUserUI() {
    // 1. Sidebar & Header
    document.querySelector('.user-name').textContent = currentUser.name;
    document.querySelector('.user-status').textContent = currentUser.status;
    document.querySelector('.avatar').src = currentUser.avatar;
    document.querySelector('.welcome-section h1 span').textContent = currentUser.name;

    // 2. Overview Metrics
    const m = currentUser.metrics;
    document.querySelector('.metric-card:nth-child(1) .metric-value').innerHTML = `${m.heartRate} <span>BPM</span>`;
    document.querySelector('.metric-card:nth-child(2) .metric-value').innerHTML = `${m.steps.toLocaleString()} <span>steps</span>`;
    
    const stepProgress = (m.steps / m.stepGoal) * 100;
    document.querySelector('.progress').style.width = `${Math.min(stepProgress, 100)}%`;
    document.querySelector('.metric-card:nth-child(2) .metric-trend').innerHTML = `<i data-lucide="trending-up"></i> ${Math.round(stepProgress)}% of goal`;

    document.querySelector('.metric-card:nth-child(3) .metric-value').innerHTML = `${m.sleep} <span>deep</span>`;
    document.querySelector('.metric-card:nth-child(4) .metric-value').innerHTML = `${m.calories.toLocaleString()} <span>kcal</span>`;

    // 3. Render Tabs
    initOverviewCharts();
    renderAnalysisTab();
    renderNutritionTab();
    renderReportsTab();
    renderSettingsTab();
    populateAIInsights();
    
    // Refresh Icons
    lucide.createIcons();
}

function initOverviewCharts() {
    // Clear existing
    Object.values(charts).forEach(c => { if(c.destroy) c.destroy(); });

    const cfg = {
        type: 'line',
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
            elements: { line: { tension: 0.4, borderWidth: 2, fill: true }, point: { radius: 0 } }
        }
    };

    charts.hr = new Chart(document.getElementById('heartRateChart'), { ...cfg, data: { labels: [1,2,3,4,5,6,7], datasets: [{ data: currentUser.trends.heartRate, borderColor: '#fb7185', backgroundColor: 'rgba(251, 113, 133, 0.1)' }] } });
    charts.sleep = new Chart(document.getElementById('sleepChart'), { ...cfg, data: { labels: [1,2,3,4,5,6,7], datasets: [{ data: currentUser.trends.sleep, borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' }] } });
    charts.cals = new Chart(document.getElementById('caloriesChart'), { ...cfg, data: { labels: [1,2,3,4,5,6,7], datasets: [{ data: currentUser.trends.calories, borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }] } });

    charts.main = new Chart(document.getElementById('mainActivityChart'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Steps', data: currentUser.trends.steps, backgroundColor: 'rgba(129, 140, 248, 0.6)', borderRadius: 8 },
                { label: 'Goal', data: Array(7).fill(currentUser.metrics.stepGoal), backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 10, usePointStyle: true } } },
            scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } } }
        }
    });
}

function renderAnalysisTab() {
    // 1. Predictive Chart
    if(charts.predictive) charts.predictive.destroy();
    charts.predictive = new Chart(document.getElementById('predictiveHRChart'), {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
            datasets: [{
                label: 'AI Forecasted HR',
                data: currentUser.trends.predictiveHR,
                borderColor: '#818cf8',
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { color: '#94a3b8' } } },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
            }
        }
    });

    // 2. Metrics
    document.getElementById('sleep-score-val').textContent = `${currentUser.metrics.sleepEfficiency}%`;
    document.getElementById('sleep-score-progress').style.width = `${currentUser.metrics.sleepEfficiency}%`;
    document.getElementById('recovery-score-val').textContent = `${currentUser.metrics.recovery}/100`;
}

function renderNutritionTab() {
    // 1. Macros
    const macros = currentUser.metrics.macros;
    const total = macros.protein + macros.carbs + macros.fats;
    
    const pPer = (macros.protein / total) * 100;
    const cPer = (macros.carbs / total) * 100;
    const fPer = (macros.fats / total) * 100;

    document.querySelector('.macro-ring.protein').style.setProperty('--percent', Math.round(pPer));
    document.querySelector('.macro-ring.carbs').style.setProperty('--percent', Math.round(cPer));
    document.querySelector('.macro-ring.fats').style.setProperty('--percent', Math.round(fPer));

    // 2. Meal Plan
    const mealList = document.getElementById('meal-plan-list');
    const meals = [
        { name: "Breakfast Bowl", desc: "Greek yogurt, berries, almonds", cals: 350 },
        { name: "Green Energy Smoothie", desc: "Spinach, protein powder, banana", cals: 280 },
        { name: "Mediterranean Salad", desc: "Grilled chicken, feta, olives", cals: 520 }
    ];

    mealList.innerHTML = meals.map(m => `
        <div class="meal-item">
            <div class="meal-info">
                <h5>${m.name}</h5>
                <p>${m.desc}</p>
            </div>
            <span class="meal-cals">${m.cals} kcal</span>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderSettingsTab() {
    const form = document.getElementById('settings-form');
    if(!form) return;

    // Refresh form values for current user
    document.getElementById('setting-name').value = currentUser.name;
    document.getElementById('setting-step-goal').value = currentUser.metrics.stepGoal;

    // Reset listener to avoid duplicates, or just use one global one
    form.onclick = null; 
    form.onsubmit = (e) => {
        e.preventDefault();
        currentUser.name = document.getElementById('setting-name').value;
        currentUser.metrics.stepGoal = parseInt(document.getElementById('setting-step-goal').value);
        
        renderUserUI();
        showFeedback("Settings saved successfully!");
    };
}

function showFeedback(msg) {
    const toast = document.createElement('div');
    toast.className = 'glass feedback-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function renderReportsTab() {
    const reportsContainer = document.getElementById('reports-container');
    if(!reportsContainer) return;

    const reports = [
        { title: "Weekly Activity Report", date: "April 1-7, 2026", steps: "65,432", hr: "71 avg", sleep: "54h total" },
        { title: "Metabolic Health Summary", date: "March 2026", steps: "284,500", hr: "68 avg", sleep: "220h total" }
    ];

    reportsContainer.innerHTML = reports.map(r => `
        <div class="card glass report-card">
            <div class="report-card-header">
                <i data-lucide="file-text" class="text-indigo"></i>
                <button class="btn-icon" onclick="showFeedback('Downloading report...')"><i data-lucide="download"></i></button>
            </div>
            <h4>${r.title}</h4>
            <p class="user-status">${r.date}</p>
            <div class="report-stats">
                <div class="report-stat-row"><span>Total Steps</span><span>${r.steps}</span></div>
                <div class="report-stat-row"><span>Avg Heart Rate</span><span>${r.hr}</span></div>
                <div class="report-stat-row"><span>Sleep Duration</span><span>${r.sleep}</span></div>
            </div>
            <button class="btn-secondary" style="width: 100%;" onclick="showFeedback('Generating full report view...')">View Full Report</button>
        </div>
    `).join('');
    lucide.createIcons();
}

function populateAIInsights() {
    const list = document.getElementById('ai-insights-list');
    const msgs = (currentUser.id === 1) ? [
        { t: "Sleep Alert", m: `Excellent recovery tonight, ${currentUser.name}. Your deep sleep is 12% above your average.`, i: "moon", c: "var(--indigo)" },
        { t: "Cardio Trend", m: "Your resting heart rate has stabilized at 72 BPM. Consistency is key.", i: "activity", c: "var(--rose)" }
    ] : [
        { t: "High Performance", m: `Rahul, your activity levels are in the top 5% of your demographic.`, i: "zap", c: "var(--orange)" },
        { t: "Hydration Note", m: "Increases in workout intensity suggest you should increase water intake by 500ml.", i: "droplet", c: "var(--blue)" }
    ];

    list.innerHTML = msgs.map((msg, idx) => `
        <div class="insight-item" style="animation: fadeInUp 0.5s ease forwards ${idx * 0.2}s; opacity: 0;">
            <div class="insight-icon" style="background: ${msg.c}"><i data-lucide="${msg.i}"></i></div>
            <div class="insight-content"><h4>${msg.t}</h4><p>${msg.m}</p></div>
        </div>
    `).join('');
}

function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const tabs = document.querySelectorAll('.tab-content');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('data-tab');
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            tabs.forEach(t => {
                t.classList.remove('active');
                if (t.id === id) t.classList.add('active');
            });
        });
    });
}

function initModalLogic() {
    const modal = document.getElementById('addUserModal');
    const btn = document.querySelector('.btn-primary:not([type="submit"])');
    const form = document.getElementById('addUserForm');

    if(!btn || !modal) return;

    btn.onclick = () => modal.classList.add('active');
    document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
    document.getElementById('cancelModal').onclick = () => modal.classList.remove('active');

    form.onsubmit = (e) => {
        e.preventDefault();
        const d = new FormData(form);
        const newUser = {
            id: users.length + 1,
            name: d.get('name'), age: parseInt(d.get('age')), status: "New Member",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.get('name')}`,
            metrics: { heartRate: parseInt(d.get('heartRate')), steps: 0, stepGoal: parseInt(d.get('stepGoal')), sleep: "0h", calories: 0, sleepEfficiency: 0, recovery: 0, macros: { protein: 50, carbs: 100, fats: 30 } },
            trends: { heartRate: [70,70,70,70,70,70,70], predictiveHR: [70,70,70,70,70,70,70,70,70,70], sleep: [0,0,0,0,0,0,0], calories: [0,0,0,0,0,0,0], steps: [0,0,0,0,0,0,0] }
        };
        users.push(newUser);
        modal.classList.remove('active');
        form.reset();
        populatePeopleList();
        switchUser(newUser.id);
    };
}

function populatePeopleList() {
    const list = document.getElementById('people-list');
    if(!list) return;
    list.innerHTML = users.map(u => `
        <div class="user-card glass ${u.id === currentUser.id ? 'active' : ''}" onclick="switchUser(${u.id})">
            <img src="${u.avatar}" class="user-avatar-large">
            <div class="user-card-info">
                <h3>${u.name}</h3>
                <p>${u.age} years • ${u.status}</p>
                <p>${u.metrics.steps.toLocaleString()} / ${u.metrics.stepGoal.toLocaleString()} steps</p>
            </div>
        </div>
    `).join('');
}

window.switchUser = (id) => {
    currentUser = users.find(u => u.id === id);
    renderUserUI();
    populatePeopleList();
    document.querySelector('[data-tab="overview"]').click();
};

function startLiveSimulation() {
    setInterval(() => {
        const d = document.querySelector('.metric-card:nth-child(1) .metric-value');
        if (d && currentUser) {
            const flex = Math.floor(Math.random() * 5) - 2;
            d.innerHTML = `${currentUser.metrics.heartRate + flex} <span>BPM</span>`;
        }
    }, 3000);
}

// --- Creative & Interactive Effects ---

function initCreativeEffects() {
    const cards = document.querySelectorAll('.glass');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
}

function initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 60;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(129, 140, 248, ${Math.random() * 0.3 + 0.1})`;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initLauncher() {
    const launchBtn = document.getElementById('launchSite');
    if (launchBtn) {
        launchBtn.addEventListener('click', () => {
            showFeedback("Launching Premium Experience...");
            setTimeout(() => {
                window.open('http://localhost:8000', '_blank');
            }, 1000);
        });
    }
}
