document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-options-btn');
    const optionsContainer = document.getElementById('options-container');
    const icons = {
        true: {
            "16": "icon16.png",
            "32": "icon32.png",
            "128": "icon128.png"
        },
        false: {
            "16": "disabled16.png",
            "32": "disabled32.png",
            "128": "disabled128.png"
        }
    };

    const defaults = {
        enabled: true,
        autoplay: false,
        privacyenhanced: false,
        cc_load_policy: false,
        controls: true,
        disablekb: false,
        loop: false,
        iv_load_policy: true,
        fs: true,
        rel: false,
        hl: chrome.i18n.getUILanguage(),
    };

    chrome.storage.sync.get(defaults, settings => {
        Object.keys(defaults).forEach(setting => {
            const input = document.getElementById(setting);
            if (!input) {
                return;
            }
            const prop = input.type === 'checkbox' ? 'checked' : 'value';
            input[prop] = settings[setting];
            input.addEventListener('change', () => {
                const value = input[prop];
                chrome?.storage?.sync.set({ [setting]: value });
                if (setting === 'enabled') {
                    chrome?.action?.setIcon({ path: icons[value] });
                }
            });
        });
    });

    toggleButton.addEventListener('click', () => {
        const isHidden = optionsContainer.hidden;
        optionsContainer.hidden = !isHidden;
        toggleButton.textContent = isHidden ? toggleButton.dataset.hideText : toggleButton.dataset.showText;
    });

    document.documentElement.dir = chrome.i18n.getMessage('@@bidi_dir');

    document.querySelectorAll('[data-locale]').forEach(elem => {
        const message = chrome.i18n.getMessage(elem.dataset.locale);
        if (message) {
            elem.textContent = message;
        }
    });
});