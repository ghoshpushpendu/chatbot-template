let baseurl = "http://ec2-13-233-157-204.ap-south-1.compute.amazonaws.com/"
let apiurl = baseurl + "api/"
let user = {
    "username": "me",
    "password": "DsI_96YjY9O4wGbQv70E"
}
let useraccessToken = "";
let chattoken = "2e5628366d784375af2b68c6ed20631a";
let conversationId = "";
let chataccesstoken = "";

// let messages = [];

connectToChatbot()
    .then(function (success) {
        // alert("CHAT_READY")
    });

function connectToChatbot(opts) {
    return new Promise(function (resolve, reject) {
        fetch(apiurl + "auth/", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            useraccessToken = data.access_token;
            fetch(apiurl + "auth/jwt", {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + useraccessToken
                },
                body: JSON.stringify({
                    chat_token: chattoken
                })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                chataccesstoken = data.access_token
                conversationId = data.conversation_id
                resolve({})
            });
        });
    });
}

var input = document.getElementById("message");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        sendMessage();
    }
});

function sendMessage() {
    let message = document.getElementById("message").value;
    console.log(message)
    document.getElementById("message").value = ""
    let messageElement = document.createElement("div");
    messageElement.className = "local";

    messageElement.innerHTML = message;
    console.log(messageElement)
    document.getElementById("chatsection").appendChild(messageElement);

    fetch(apiurl + "conversations/" + conversationId + "/messages?environment=production", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + chataccesstoken
        },
        body: JSON.stringify({
            message: message
        })
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let messageElement = document.createElement("div");
        messageElement.className = "remote";
        messageElement.innerHTML = data[0].text;
        document.getElementById("chatsection").appendChild(messageElement);
    });
}