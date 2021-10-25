const fs = require("fs");
const express = require("express");
const server = express();
const CryptoJS = require("crypto-js");

server.use(express.static(__dirname + "/public"));
server.use(express.static(__dirname + "/node_modules/socket.io-client/dist"));
server.use(express.static(__dirname + "/node_modules/crypto-js"));
server.use(express.json());

server.get("/", async function(req, res) { 

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    if(!ip) {
        res.sendFile("unable.html");
        return; 
    }

    const clientkey = await generateClientKey();
    const original = fs.readFileSync(__dirname + "/index.html", "utf8");
    const rendered = original.replace(/id="e67456b75c9447059e9f9b82cd26b180"/,
       `id="e67456b75c9447059e9f9b82cd26b180" 
       value="{'dc503f3c15684a76bd1874dce9cb42a8':'aHR0cDovL2xvY2FsaG9zdDozNDU2','e5702487618e4ea7aa8cb090b6bd8f4f':'L3NvY2tldC5pby5qcw==','rdeaa6327d6b4f4090b852501fca542f':'L2NyeXB0by1qcy5qcw==','ef2a436521af4c8482ea7d2051666dad':'c2NyaXB0','bd704de197b26c':'e67456b75c9447059e9f9b82cd26b180','hbfdb6d6f3bb402bb72d7cea5d74adbe':'ICAgICAxMSAg','kba6b073237e4940b4373498a34117df':'${clientkey}'}"`);
    
    await sendAuth(ip, clientkey);

    res.send(rendered); 
});

server.listen(80, () => startMessage());

async function sendAuth(ip, key) {

    const keys = require('./privateKeys');
    const options = {
        autoConnect: true, 
        port: 3457,
        query: { 
          clip: CryptoJS.AES.encrypt(ip, keys.cryptoServerKey), 
          temp: CryptoJS.AES.encrypt(key, keys.cryptoServerKey)
        }
    };
    const io = require('socket.io-client');
    io.connect(keys.authServerHost, options);
}

function startMessage() { 
    console.clear();
    console.log("express server is listening..."); 
}

async function generateClientKey() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}