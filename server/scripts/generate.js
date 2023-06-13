const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");


function getAddress(publicKeyHex) {
    const publicKey  =hexStringToUint8Array(publicKeyHex)
    const a = publicKey.slice(1);
    const hash = keccak256(a);
    const address = hash.slice(-20);
    return('0x' + toHex(address))
}


async function verifySenderAddress(publicKey,senderAddress) {
    const realAddress = getAddress(publicKey)
    console.log(realAddress)
    console.log(senderAddress)
    if(realAddress == senderAddress){
        return(true)
    }else{
        return(false)
    }
}


function hashMsg(msg) {
    const msgStr = JSON.stringify(msg);
    const bytes = utf8ToBytes(msgStr);
    const hash = keccak256(bytes);
    return hash;
}

async function sign(msg, privateKey) {
    const msgHash = hashMsg(msg);
    console.log(msgHash);
    const signature = await secp256k1.sign(msgHash, privateKey);
    console.log(signature);
    return signature;
}

async function verify( signature, msg,publicKey) {
    const msgHash = hashMsg(msg);
    console.log(msgHash)

    //还原 string 到 bigint
    signature.r = BigInt(signature.r)
    signature.s = BigInt(signature.s)

    console.log(signature)
    console.log(publicKey)
    const result = secp256k1.verify( signature,msgHash, publicKey);
    console.log(result);
    return result;
}

function uint8ArrayToHexString(uint8Array) {
    var hexString = '';
  
    for (var i = 0; i < uint8Array.length; i++) {
      var hex = uint8Array[i].toString(16);
      if (hex.length === 1) {
        hex = '0' + hex; // 确保每个字节都有两位
      }
      hexString += hex;
    }
  
    return hexString;
  }
  
  function hexStringToUint8Array(hexString) {
    // 确保字符串长度为偶数
    if (hexString.length % 2 !== 0) {
      hexString = '0' + hexString;
    }
  
    var uint8Array = new Uint8Array(hexString.length / 2);
  
    for (var i = 0; i < hexString.length; i += 2) {
      var byte = parseInt(hexString.substr(i, 2), 16);
      uint8Array[i / 2] = byte;
    }
  
    return uint8Array;
  }


module.exports = {
    getAddress,
    hashMsg,
    sign,
    verify,
    verifySenderAddress
};

/*
const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey))

const publicKey = secp256k1.getPublicKey(privateKey)

console.log('public key:', toHex(publicKey))


const address = getAddress(publicKey)

console.log('address:', '0x' + toHex(address))

*/