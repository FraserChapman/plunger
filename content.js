const bid = crypto.randomUUID();
let locationHref = '';

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
    iframe.style.minHeight = '600px';
    return iframe;
}

function updatePlayer(vid) {
    chrome.storage.sync.get({ autoplay: false, privacyEnhanced: true }, function (data) {
        const playerElement = document.getElementById('player') || document.createElement('div');
        playerElement.innerHTML = '';
        playerElement.appendChild(createIframe(vid, data.autoplay, data.privacyEnhanced));
    });
}

function removeBypass() {
    const bypass = document.getElementById(bid);
    if (bypass) {
        bypass.parentNode.removeChild(bypass);
    }
}

function waitForElm(selector, action) {
    new MutationObserver((mutations, obs) => {
        if (document.querySelector(selector)) {
            obs.disconnect();
            action();
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
}

function onUrlChange() {
    const v = new URLSearchParams(window.location.search).get('v');
    if (v) {
        updatePlayer(v);
    } else {
        removeBypass();
    }
}

new MutationObserver(() => {
    if (window.location.href !== locationHref) {
        locationHref = window.location.href;
        onUrlChange();
    }
}).observe(document.body, { subtree: true, childList: true });


waitForElm('#error-screen', () => {
    const errorScreen = document.getElementById('error-screen');
    if (errorScreen) {
        errorScreen.parentElement.removeChild(errorScreen);
        onUrlChange();
    }
});
