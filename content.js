const bid = crypto.randomUUID();
let locationHref;
let resizeTimeout;


function createIframe(vid, settings) {
    const iframe = document.createElement('iframe');
    const domain = settings.privacyenhanced ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(settings)) {
        switch (key) {
            case 'privacyenhanced':
                break;
            case 'hl':
                params.set(key, value);
                params.set('cc_lang_pref', value);
                break;
            case 'loop':
                params.set(key, value ? '1' : '0');
                params.set('playlist', vid);
                break;
            case 'iv_load_policy':
                params.set(key, value ? '1' : '3');
                break;
            default:
                params.set(key, value ? '1' : '0');
        }
    }

    iframe.src = `https://${domain}/embed/${vid}?${params.toString()}`;
    iframe.id = bid;
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.referrerpolicy = "no-referrer-when-downgrade";
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.minHeight = '240px';
    iframe.style.maxHeight = '600px';
    iframe.onload = () => setAspectRatio();

    return iframe;
}

function updatePlayer(vid, settings) {
    const playerElement = document.getElementById('player');
    if (playerElement) {
        playerElement.innerHTML = '';
        playerElement.appendChild(createIframe(vid, settings));
    }
}

function onSettingsRetrieved(vid) {
    chrome.storage.sync.get({
        autoplay: false,
        privacyenhanced: false,
        cc_load_policy: false,
        controls: true,
        disablekb: false,
        loop: false,
        iv_load_policy: true,
        fs: true,
        rel: false,
        hl: 'en',
    }, settings => {
        updatePlayer(vid, settings);
    });
}

function removeBypass() {
    const bypass = document.getElementById(bid);
    bypass?.parentNode?.removeChild(bypass);
}

function onUrlChange() {
    const v = new URLSearchParams(window.location.search).get('v');
    if (v) {
        onSettingsRetrieved(v);
    } else {
        removeBypass();
    }
}

function setAspectRatio() {
    const bypass = document.getElementById(bid);
    if (bypass) {
        const width = bypass.offsetWidth;
        const height = (width / 16) * 9;
        bypass.style.height = `${height}px`;
    }
}

function waitForElement(selector) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                const currentLocation = window.location.href;
                const element = document.querySelector(selector);
                if (currentLocation !== locationHref) {
                    locationHref = currentLocation;
                    onUrlChange();
                } else if (element) {
                    element.remove();
                    onUrlChange();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('beforeunload', () => observer.disconnect());
}

waitForElement('#error-screen');

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setAspectRatio, 100);
});
