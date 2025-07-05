// Cookie management for eSpomienka - GDPR Compliant
class CookieManager {
    constructor() {
        this.cookieConsent = this.getCookie('cookieConsent');
        this.init();
    }

    init() {
        if (!this.cookieConsent) {
            this.showBanner();
        } else {
            this.loadScripts(this.cookieConsent);
        }
        
        this.bindEvents();
    }

    showBanner() {
        setTimeout(() => {
            const banner = document.getElementById('cookieBanner');
            if (banner) {
                banner.classList.add('show');
            }
        }, 1000);
    }

    hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    bindEvents() {
        const acceptAllBtn = document.getElementById('acceptAll');
        const acceptNecessaryBtn = document.getElementById('acceptNecessary');
        const cookieSettingsBtn = document.getElementById('cookieSettings');

        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                this.setConsent('all');
            });
        }

        if (acceptNecessaryBtn) {
            acceptNecessaryBtn.addEventListener('click', () => {
                this.setConsent('necessary');
            });
        }

        if (cookieSettingsBtn) {
            cookieSettingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }
    }

    setConsent(type) {
        this.setCookie('cookieConsent', type, 365);
        this.hideBanner();
        this.loadScripts(type);
        
        // Show confirmation message
        this.showConsentConfirmation(type);
    }

    showConsentConfirmation(type) {
        const message = type === 'all' 
            ? 'Súhlas s cookies bol uložený. Ďakujeme!' 
            : 'Uložené len nevyhnutné cookies.';
        
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #DAA520;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    loadScripts(consentType) {
        if (consentType === 'all') {
            // Google Analytics
            this.loadGoogleAnalytics();
            
            // Facebook Pixel (if needed in future)
            // this.loadFacebookPixel();
            
            console.log('Analytics cookies loaded');
        } else {
            console.log('Only necessary cookies loaded');
        }
        // Necessary cookies are always loaded
    }

    loadGoogleAnalytics() {
        // Replace with your actual Google Analytics 4 ID
        const GA_ID = 'G-XXXXXXXXXX'; // TODO: Replace with real GA4 ID from Google Analytics
        
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        // Initialize Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', GA_ID, {
            anonymize_ip: true,
            cookie_flags: 'SameSite=Strict;Secure'
        });
        
        // Make gtag globally available
        window.gtag = gtag;
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    showSettings() {
        // Create modal for cookie settings
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-settings-modal';
        modal.innerHTML = `
            <div class="cookie-settings-overlay"></div>
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h3>Nastavenia cookies</h3>
                    <button class="close-settings" onclick="this.closest('.cookie-settings-modal').remove()">×</button>
                </div>
                <div class="cookie-settings-body">
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Nevyhnutné cookies</h4>
                            <span class="cookie-status enabled">Vždy povolené</span>
                        </div>
                        <p>Tieto cookies sú potrebné pre správne fungovanie webstránky a nemožno ich vypnúť.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Analytické cookies</h4>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-toggle" ${this.cookieConsent === 'all' ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p>Pomáhajú nám pochopiť, ako návštevníci používajú našu webstránku, aby sme ju mohli zlepšovať.</p>
                    </div>
                </div>
                <div class="cookie-settings-footer">
                    <button class="btn-save-settings" onclick="cookieManager.saveSettings()">Uložiť nastavenia</button>
                    <button class="btn-accept-all-modal" onclick="cookieManager.acceptAllFromModal()">Prijať všetko</button>
                </div>
            </div>
        `;
        
        // Add styles for modal
        this.addModalStyles();
        
        return modal;
    }

    addModalStyles() {
        if (document.getElementById('cookie-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'cookie-modal-styles';
        styles.textContent = `
            .cookie-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .cookie-settings-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .cookie-settings-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
            
            .cookie-settings-content {
                position: relative;
                background: white;
                max-width: 600px;
                margin: 5% auto;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .cookie-settings-modal.show .cookie-settings-content {
                transform: translateY(0);
            }
            
            .cookie-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #E0E0E0;
            }
            
            .cookie-settings-header h3 {
                margin: 0;
                color: #2C3E50;
                font-family: 'Playfair Display', serif;
                font-size: 1.5rem;
            }
            
            .close-settings {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .cookie-settings-body {
                padding: 1.5rem;
            }
            
            .cookie-category {
                margin-bottom: 1.5rem;
            }
            
            .cookie-category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .cookie-category h4 {
                margin: 0;
                color: #2C3E50;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .cookie-status.enabled {
                background: #DAA520;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .cookie-toggle {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .cookie-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.3s;
                border-radius: 24px;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }
            
            input:checked + .toggle-slider {
                background-color: #DAA520;
            }
            
            input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }
            
            .cookie-settings-footer {
                padding: 1.5rem;
                border-top: 1px solid #E0E0E0;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            
            .btn-save-settings,
            .btn-accept-all-modal {
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Inter', sans-serif;
            }
            
            .btn-save-settings {
                background: transparent;
                color: #2C3E50;
                border: 2px solid #2C3E50;
            }
            
            .btn-save-settings:hover {
                background: #2C3E50;
                color: white;
            }
            
            .btn-accept-all-modal {
                background: #DAA520;
                color: white;
                border: none;
            }
            
            .btn-accept-all-modal:hover {
                background: #B8860B;
            }
        `;
        
        document.head.appendChild(styles);
    }

    saveSettings() {
        const analyticsToggle = document.getElementById('analytics-toggle');
        const consentType = analyticsToggle && analyticsToggle.checked ? 'all' : 'necessary';
        
        this.setConsent(consentType);
        
        // Close modal
        const modal = document.querySelector('.cookie-settings-modal');
        if (modal) {
            modal.remove();
        }
    }

    acceptAllFromModal() {
        this.setConsent('all');
        
        // Close modal
        const modal = document.querySelector('.cookie-settings-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Global function for cookie settings button in footer
function showCookieSettings() {
    if (window.cookieManager) {
        window.cookieManager.showSettings();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieManager();
});
