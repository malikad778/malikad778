
/**
 * System Monitor - Real-time metrics
 * Tracks FPS, Latency (Ping), Session Uptime, Mouse Coordinates, and Scroll Velocity
 */

const SystemMonitor = {
    fps: 0,
    frames: 0,
    lastFrameTime: performance.now(),
    latency: 0,
    uptimeStart: Date.now(),
    status: 'OPTIMAL',

    // Velocity Tracking
    lastScrollY: window.scrollY,
    lastScrollTime: performance.now(),

    elements: {
        statusText: document.getElementById('system-status-text'),
        indicator: document.getElementById('system-status-indicator'),
        fps: document.getElementById('system-fps'),
        ping: document.getElementById('system-ping'),
        uptime: document.getElementById('system-uptime'),
        coordinates: document.getElementById('system-coordinates'),
        velocity: document.getElementById('system-velocity'),
        year: document.getElementById('system-year'),
        indexYear: document.getElementById('system-index-year')
    },

    init() {
        this.updateFPS();
        this.updatePing();
        this.updateUptime();
        this.initInteractions();

        // set Year
        const currentYear = new Date().getFullYear();
        if (this.elements.year) this.elements.year.textContent = currentYear;
        if (this.elements.indexYear) this.elements.indexYear.textContent = currentYear;

        // Refresh ping every 5 seconds
        setInterval(() => this.updatePing(), 5000);

        // Refresh uptime every second
        setInterval(() => this.updateUptime(), 1000);
    },

    initInteractions() {
        // Track Mouse Coordinates
        document.addEventListener('mousemove', (e) => {
            if (this.elements.coordinates) {
                this.elements.coordinates.textContent = `X: ${e.clientX.toFixed(2)} / Y: ${e.clientY.toFixed(2)}`;
            }
        });

        // Track Scroll Velocity
        document.addEventListener('scroll', () => {
            const now = performance.now();
            const currentScrollY = window.scrollY;
            const dt = now - this.lastScrollTime;

            if (dt > 50) { // Limit updates (throttle)
                const dy = Math.abs(currentScrollY - this.lastScrollY);
                const velocity = (dy / dt) * 1000; // pixels per second

                if (this.elements.velocity) {
                    this.elements.velocity.textContent = `${velocity.toFixed(1)} px/s`;
                }

                this.lastScrollY = currentScrollY;
                this.lastScrollTime = now;
            }
        });

        // Reset velocity when stopped
        setInterval(() => {
            if (performance.now() - this.lastScrollTime > 100 && this.elements.velocity) {
                this.elements.velocity.textContent = '0.0 px/s';
            }
        }, 200);
    },

    updateFPS() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;

        this.frames++;

        if (delta >= 1000) {
            this.fps = Math.round((this.frames * 1000) / delta);
            this.frames = 0;
            this.lastFrameTime = now;

            if (this.elements.fps) {
                this.elements.fps.textContent = `${this.fps} FPS`;
                this.elements.fps.style.color = this.fps < 30 ? '#ef4444' : (document.documentElement.classList.contains('dark') ? '#9ca3af' : '#9ca3af');
            }
        }

        requestAnimationFrame(() => this.updateFPS());
    },

    async updatePing() {
        if (!this.elements.ping) return;

        // Local protocol simulation (CORS fix)
        if (window.location.protocol === 'file:') {
            const simulatedPing = Math.floor(Math.random() * 30) + 15;
            this.latency = simulatedPing;
            this.elements.ping.textContent = `${simulatedPing}ms`;
            this.elements.ping.style.color = '#22c55e'; // Green
            this.updateStatus();
            return;
        }

        const start = performance.now();
        try {
            // Head request to current page to measure TTFB/Latency
            await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
            const end = performance.now();
            this.latency = Math.round(end - start);

            if (this.elements.ping) {
                this.elements.ping.textContent = `${this.latency}ms`;
                // Color coding
                if (this.latency < 100) this.elements.ping.style.color = '#22c55e';
                else if (this.latency < 300) this.elements.ping.style.color = '#eab308';
                else this.elements.ping.style.color = '#ef4444';
            }

            this.updateStatus();
        } catch (e) {
            // Offline or error
            this.latency = -1;
            if (this.elements.ping) {
                this.elements.ping.textContent = 'OFFLINE';
                this.elements.ping.style.color = '#ef4444';
            }
            this.updateStatus();
        }
    },

    updateUptime() {
        const now = Date.now();
        const diff = Math.floor((now - this.uptimeStart) / 1000);

        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');

        if (this.elements.uptime) {
            this.elements.uptime.textContent = `${h}:${m}:${s}`;
        }
    },

    updateStatus() {
        // Simple logic: High latency or Low FPS = Degraded
        let newStatus = 'OPTIMAL';
        let colorClass = 'text-green-600'; // Default green

        if (this.latency > 500 || (this.fps > 0 && this.fps < 20)) {
            newStatus = 'DEGRADED';
            colorClass = 'text-yellow-500';
        } else if (this.latency === -1) {
            newStatus = 'OFFLINE';
            colorClass = 'text-red-500';
        }

        if (this.status !== newStatus) {
            this.status = newStatus;
            if (this.elements.statusText) {
                this.elements.statusText.innerHTML = `SYSTEM STATUS: <span class="${colorClass}">${newStatus}</span>`;
            }
            if (this.elements.indicator) {
                this.elements.indicator.className = `material-symbols-outlined text-[10px] ${colorClass} animate-pulse`;
                this.elements.indicator.textContent = newStatus === 'OPTIMAL' ? 'radio_button_checked' : 'warning';
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Re-bind elements in case they weren't ready
    SystemMonitor.elements = {
        statusText: document.getElementById('system-status-text'),
        indicator: document.getElementById('system-status-indicator'),
        fps: document.getElementById('system-fps'),
        ping: document.getElementById('system-ping'),
        uptime: document.getElementById('system-uptime'),
        coordinates: document.getElementById('system-coordinates'),
        velocity: document.getElementById('system-velocity'),
        year: document.getElementById('system-year')
    };
    SystemMonitor.init();
});
