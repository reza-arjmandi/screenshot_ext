
async function post_image(url = '', data) {
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

function start_recording(deviceid, desc) {
    if (!isRecording) return;

    chrome.tabs.captureVisibleTab((screenshotUrl) => {
        chrome.storage.sync.get('username', function (obj) {
            post_image('http://127.0.0.1:3000', { screenshot: screenshotUrl, username: obj.username, deviceid: deviceid, desc: desc })
            .then(data => {
                println(data);
            });
        });
    });

    if (isRecording) {
        setTimeout(start_recording, 5000, deviceid, desc);
        return;
    }
}



function println(msg)
{
    chrome.extension.getBackgroundPage().console.log(msg);
}

chrome.runtime.onConnect.addListener(function(port) {
    runtimePort = port;
    runtimePort.onMessage.addListener(function(message) {
        if (!message || !message.messageFromContentScript1234) {
            return;
        }

        if (message.start_recording) {
            isRecording = true; 

            start_recording(message.deviceid, message.desc);
            onRecording();
        }

        if (message.stop_recording) {
            isRecording = false; 
            chrome.browserAction.setIcon({
                path: 'images/main-icon.png'
            });
        }
    });
});
