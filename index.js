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
    const rendered = original.replace(/id="e67456b75c9447059e9f9b82cd26b180"/, `id="e67456b75c9447059e9f9b82cd26b180" value="${clientkey}"`);
    
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