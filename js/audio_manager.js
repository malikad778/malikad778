
/**
 * Audio Manager - Web Audio API
 * Synthesizes UI sounds (Clicks, Blips) without external assets.
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('audio_muted') === 'true';
        this.masterGain = null;
        this.initialized = false;

        // Bind methods
        this.toggleMute = this.toggleMute.bind(this);
        this.playClick = this.playClick.bind(this);
        this.playBlip = this.playBlip.bind(this);
    }

    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);

            // Apply initial mute state
            this.masterGain.gain.value = this.muted ? 0 : 0.1; // Low volume by default

            this.initialized = true;
            this.attachGlobalListeners();
            this.updateMuteUI();

            // Autoplay Policy: Resume on first interaction
            const resumeAudio = () => {
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume().then(() => console.log('AUDIO SYSTEM: RESUMED'));
                }
                document.removeEventListener('click', resumeAudio);
                document.removeEventListener('keydown', resumeAudio);
            };
            document.addEventListener('click', resumeAudio);
            document.addEventListener('keydown', resumeAudio);

            console.log('AUDIO SYSTEM: ONLINE');
        } catch (e) {
            console.error('AUDIO SYSTEM: FAILED', e);
        }
    }

    attachGlobalListeners() {
        // Resume context on first interaction (browser policy)
        const resumeFunc = () => {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            window.removeEventListener('click', resumeFunc);
            window.removeEventListener('keydown', resumeFunc);
        };
        window.addEventListener('click', resumeFunc);
        window.addEventListener('keydown', resumeFunc);

        // Global Hover Effects for interactive elements
        document.querySelectorAll('a, button, .terminal-instance').forEach(el => {
            el.addEventListener('mouseenter', () => this.playBlip());
        });
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('audio_muted', this.muted);

        if (this.masterGain) {
            // Smooth transition
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : 0.1, now + 0.1);
        }

        this.updateMuteUI();
        return this.muted;
    }

    updateMuteUI() {
        const btn = document.getElementById('audio-mute-toggle');
        if (btn) {
            btn.innerHTML = this.muted ? 'SOUND: <span class="text-red-500">OFF</span>' : 'SOUND: <span class="text-green-500">ON</span>';
        }
    }

    // High-tech typing click (Short burst of noise)
    playClick() {
        if (!this.initialized || this.muted || (this.ctx && this.ctx.state === 'suspended')) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Sci-fi UI Hover Blip (Sine wave)
    playBlip() {
        if (!this.initialized || this.muted || (this.ctx && this.ctx.state === 'suspended')) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
}

// Singleton Instance
window.SystemAudio = new AudioManager();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a slight delay or user interaction logic
    // But we'll call init immediately to set up listeners, strict browser policies will wait for interaction
    window.SystemAudio.init();

    // Bind Mute Toggle
    const muteBtn = document.getElementById('audio-mute-toggle');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => window.SystemAudio.toggleMute());
    }
});
