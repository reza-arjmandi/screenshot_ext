var runtimePort = chrome.runtime.connect({
    name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

function println(msg)
{
    chrome.extension.getBackgroundPage().console.log(msg);
}

async function post_userpass(url = '', data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

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
    var pass = document.getElementById("password-txtbox").value;
    post_userpass('http://127.0.0.1:3000/auth/', { username, pass })
    .then(data => {
        if(data["msg"] === "OK") {
            chrome.storage.sync.set({
                is_login: true,
                username: username
            }, function () {
                window.close();
            });
        }
        else {
            document.getElementById("error-label").textContent = "Username or password is wrong!"
        }
    });
};

document.getElementById('logout-btn').onclick = function () {
    chrome.storage.sync.set({
        is_login: false,
    }, function () {
        window.close();
    });
};

document.getElementById('record-btn').onclick = function () {
    var deviceid = document.getElementById("deviceid-txtbox").value;
    var desc = document.getElementById("desc-txtbox").value;

    if(deviceid === "" || desc === "") {
        document.getElementById("error-label-2").textContent = "DeviceID or Description is empty!";
        return; 
    }

    chrome.storage.sync.set({
        isRecording: true,
    }, function () {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            start_recording: true,
            deviceid: deviceid,
            desc: desc
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