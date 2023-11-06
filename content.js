const bid = crypto.randomUUID();

let locationHref;
let resizeTimeout;

function createIframe(vid, autoplay, privacyEnhanced) {
    const autoplayParam = autoplay ? '1' : '0';
    const domain = privacyEnhanced ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    const iframe = document.createElement('iframe');
    iframe.src = `https://${domain}/embed/${vid}?autoplay=${autoplayParam}`;
    iframe.id = bid;
    iframe.title = 'get rekt ;)';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.minHeight = '240px'
    iframe.style.maxHeight = '600px';

    return iframe;
}


function updatePlayer(vid, settings) {
    const playerElement = document.getElementById('player') || document.createElement('div');
    playerElement.innerHTML = '';
    playerElement.appendChild(createIframe(vid, settings.autoplay, settings.privacyEnhanced));
    setAspectRatio();
}

function onSettingsRetrieved(vid) {
    chrome.storage.sync.get({ autoplay: false, privacyEnhanced: true }, data => {
        updatePlayer(vid, data);
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
        var width = bypass.offsetWidth;
        var height = (width / 4) * 3;
        bypass.style.height = height + 'px';
    }
}

function waitForElement(selector) {
    const observer = new MutationObserver(() => {
        const currentLocation = window.location.href;
        const element = document.querySelector(selector);

        if (currentLocation !== locationHref) {
            locationHref = currentLocation;
            onUrlChange();
        } else if (element) {
            element.remove();
            onUrlChange();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('beforeunload', () => observer.disconnect());
}

waitForElement('#error-screen');

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setAspectRatio, 100);
});
