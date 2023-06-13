import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex,utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";



export function hashMsg(msg){
    const msgStr = JSON.stringify(msg)
    const bytes = utf8ToBytes(msgStr);
    const hash = keccak256(bytes)
    return(hash)
}


export async function sign(msg,privateKey){
    const msgHash = hashMsg(msg)
    console.log(msgHash)
    console.log(msg)
    console.log(getPublicKey(privateKey))
    const signature = await secp256k1.sign(msgHash,privateKey)
    console.log(signature)
    return(signature)
}

export async function recoverKey(msg, signature, recoveryBit) {
    const msgHash = hashMessage(msg)
    const publicKey = secp256k1.recoverPublicKey(msgHash,signature,recoveryBit)
    console.log(publicKey)
    return(publicKey)
}

export function getAddress(privateKey) {
    const publicKey = secp256k1.getPublicKey(privateKey)
    const a = publicKey.slice(1);
    const hash = keccak256(a);
    const address = hash.slice(-20);
    return('0x' + toHex(address))
  }

export function getPublicKey(privateKey) {
    const publicKey = secp256k1.getPublicKey(privateKey)
    return(toHex(publicKey))
}