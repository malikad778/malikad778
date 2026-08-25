
/**
 * Encrypted Uplink Terminal (Multi-Instance)
 * Simulates a CLI for WhatsApp contact
 */

class TerminalInstance {
    constructor(container, options = {}) {
        this.container = container;
        this.config = {
            whatsappNumber: '923472926359',
            prompt: options.prompt || '<span class="text-green-500">visitor@adnan</span>:<span class="text-blue-500">~</span>$ ',
            height: options.height || 'auto'
        };

        this.elements = {
            output: null,
            inputLine: null,
            inputField: null,
            cursor: null
        };

        this.init();
    }

    init() {
        this.renderInitialState();
        this.attachListeners();
    }

    renderInitialState() {
        const heightClass = this.config.height === 'compact' ? 'p-2' : 'p-4';
        const fontSize = this.config.height === 'compact' ? 'text-[10px]' : 'text-xs md:text-sm';

        this.container.innerHTML = `
            <div class="font-mono ${fontSize} ${heightClass} bg-black/80 backdrop-blur-md border border-gray-800 rounded-sm w-full shadow-2xl relative overflow-hidden group text-left">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50"></div>
                <div class="terminal-output text-gray-400 mb-2 space-y-1">
                    <div>> INITIALIZING SECURE UPLINK...</div>
                    <div class="text-green-500">> CONNECTION ESTABLISHED.</div>
                    <div>> TYPE MESSAGE AND PRESS ENTER.</div>
                </div>
                <div class="terminal-input-line flex items-center text-gray-200">
                    <span class="mr-2 whitespace-nowrap">${this.config.prompt} </span>
                    <input type="text" 
                        class="terminal-input-field bg-transparent border-none outline-none text-white w-full font-mono caret-transparent uppercase placeholder-gray-700"
                        autocomplete="off" spellcheck="false" placeholder="INITIATE PROTOCOL...">
                    <span class="terminal-cursor w-1.5 h-3 md:w-2 md:h-4 bg-green-500 block animate-pulse ml-1"></span>
                </div>
            </div>
        `;

        this.elements.output = this.container.querySelector('.terminal-output');
        this.elements.inputLine = this.container.querySelector('.terminal-input-line');
        this.elements.inputField = this.container.querySelector('.terminal-input-field');
        this.elements.cursor = this.container.querySelector('.terminal-cursor');

        // Bind Audio Toggle



        // Auto-focus logic
        this.container.addEventListener('click', () => {
            if (this.elements.inputField && !this.elements.inputField.disabled) {
                this.elements.inputField.focus();
            }
        });
    }

    attachListeners() {
        if (!this.elements.inputField) return;

        this.elements.inputField.addEventListener('keydown', (e) => {
            // Audio Feedback
            if (window.SystemAudio) window.SystemAudio.playClick();

            if (e.key === 'Enter') {
                const message = this.elements.inputField.value.trim();
                if (message) {
                    this.processCommand(message);
                }
            }
        });
    }

    async processCommand(message) {
        // Lock Input
        this.elements.inputField.disabled = true;
        this.elements.cursor.classList.remove('animate-pulse');
        this.elements.cursor.classList.add('opacity-0');

        this.log(`> INPUT RECEIVED: "${message}"`);
        await this.delay(400);

        // Simulated Encryption
        this.log('> ENCRYPTING PACKETS...');
        await this.simulateProgress();

        this.log('> <span class="text-green-500">ENCRYPTION COMPLETE.</span>');
        await this.delay(400);

        this.log('> ESTABLISHING WHATSAPP UPLINK...');
        await this.delay(800);

        // Redirect
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${this.config.whatsappNumber}?text=${encoded}`, '_blank');

        // Reset
        this.log('> TRANSMISSION SUCCESSFUL.');
        await this.delay(2000);
        this.resetTerminal();
    }

    simulateProgress() {
        return new Promise(resolve => {
            const div = document.createElement('div');
            div.className = 'text-yellow-500';
            this.elements.output.appendChild(div);

            let width = 0;
            const interval = setInterval(() => {
                width += Math.floor(Math.random() * 10) + 5;
                if (width > 20) width = 20;

                const bar = '█'.repeat(width) + '░'.repeat(20 - width);
                div.textContent = `> UPLOADING [${bar}] ${Math.min(width * 5, 100)}%`;

                if (width >= 20) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    }

    log(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        this.elements.output.appendChild(div);
        this.elements.output.scrollTop = this.elements.output.scrollHeight;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetTerminal() {
        this.elements.output.innerHTML = `
            <div>> SYSTEM READY.</div>
            <div class="text-green-500">> AWAITING NEXT COMMAND.</div>
        `;
        this.elements.inputField.value = '';
        this.elements.inputField.disabled = false;
        this.elements.inputField.focus();
        this.elements.cursor.classList.remove('opacity-0');
        this.elements.cursor.classList.add('animate-pulse');
    }


}

// Initialize all instances
document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Sections (and direct ID replacements)
    const heroTerminal = document.getElementById('terminal-contact');
    if (heroTerminal) {
        new TerminalInstance(heroTerminal);
    }

    // 2. Class-based instances
    document.querySelectorAll('.terminal-instance').forEach(el => {
        new TerminalInstance(el, {
            prompt: el.dataset.prompt,
            height: el.dataset.height
        });
    });
});
