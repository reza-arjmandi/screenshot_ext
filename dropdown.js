var runtimePort = chrome.runtime.connect({
    name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

runtimePort.onMessage.addListener(function (message) {
    if (!message || !message.messageFromContentScript1234) {
        return;
    }
});

isRecording = false;
is_loging = false;

chrome.storage.sync.get('is_login', function (obj) {
    is_loging = obj.is_login; 
    if(!obj.is_login) {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('record-section').style.display = 'none';
        document.getElementById('stop-section').style.display = 'none';
        return;
    }
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('record-section').style.display = 'block';
    document.getElementById('stop-section').style.display = 'none';
});

chrome.storage.sync.get('isRecording', function (obj) {
    if(!is_loging) {
        return;
    }

    isRecording = obj.isRecording; 
    if(!obj.isRecording) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('record-section').style.display = 'block';
        document.getElementById('stop-section').style.display = 'none';
        return;
    }
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('record-section').style.display = 'none';
    document.getElementById('stop-section').style.display = 'block';
});

document.getElementById('login-btn').onclick = function () {
    var username = document.getElementById("username-txtbox").value;
    var password = document.getElementById("password-txtbox").value;
    if(username === "admin" && password === "123") {
        chrome.storage.sync.set({
            is_login: true,
        }, function () {
            window.close();
        });
    }
};

document.getElementById('logout-btn').onclick = function () {
    chrome.storage.sync.set({
        is_login: false,
    }, function () {
        window.close();
    });
};

document.getElementById('record-btn').onclick = function () {
    chrome.storage.sync.set({
        isRecording: true,
    }, function () {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            start_recording: true,
        });
        window.close();
    });
};

document.getElementById('stop-recording').onclick = function () {
    chrome.storage.sync.set({
        isRecording: false,
    }, function () {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            stop_recording: true,
        });
        window.close();
    });
};