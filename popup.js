document.addEventListener('DOMContentLoaded', () => {
    const autoplayCheckbox = document.getElementById('autoplay-checkbox');
    const privacyEnhancedCheckbox = document.getElementById('privacy-enhanced-checkbox');

    // Retrieve settings or set defaults if not previously set
    chrome.storage.sync.get({ autoplay: false, privacyEnhanced: true }, function (result) {
        autoplayCheckbox.checked = result.autoplay;
        privacyEnhancedCheckbox.checked = result.privacyEnhanced;
    });

    autoplayCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ autoplay: autoplayCheckbox.checked });
    });

    privacyEnhancedCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ privacyEnhanced: privacyEnhancedCheckbox.checked });
    });
});