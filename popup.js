document.addEventListener('DOMContentLoaded', () => {
    const defaults = {
        autoplay: false,
        privacyenhanced: true,
        cc_load_policy: false,
        controls: true,
        disablekb: false,
        loop: false,
        modestbranding: true,
        iv_load_policy: true,
        fs: true,
        hl: 'en',
    };

    function updateSetting(setting, value) {
        let updateObj = {};
        updateObj[setting] = value;
        chrome.storage.sync.set(updateObj);
    }

    chrome.storage.sync.get(defaults, settings => {
        Object.keys(defaults).forEach(setting => {
            const input = document.getElementById(setting);
            if (!input) {
                return;
            }
            const prop = input.type === 'checkbox' ? 'checked' : 'value';
            input[prop] = settings[setting];
            input.addEventListener('change', () => updateSetting(setting, input[prop]));
        });
    });
});
