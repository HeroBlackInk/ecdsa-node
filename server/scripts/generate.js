const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");


function getAddress(publicKey) {
    const a = publicKey.slice(1);
    const hash = keccak256(a);
    const address = hash.slice(-20);
    return(address)
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

module.exports = {
    getAddress,
    hashMsg,
    sign,
    verify
};

/*
const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey))

const publicKey = secp256k1.getPublicKey(privateKey)

console.log('public key:', toHex(publicKey))


const address = getAddress(publicKey)

console.log('address:', '0x' + toHex(address))

*/