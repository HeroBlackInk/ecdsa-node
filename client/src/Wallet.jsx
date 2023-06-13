import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";


function isSecp256k1PrivateKey(privateKey) {
  // secp256k1私钥应为64个十六进制字符
  if (privateKey.length !== 64) {
    return false;
  }

  // 检查私钥是否只包含十六进制字符
  const privateKeyRegex = /^[0-9a-fA-F]+$/;
  if (!privateKeyRegex.test(privateKey)) {
    return false;
  }

  // 进一步验证私钥的有效性
  // 这里可以使用具体的secp256k1库进行验证，例如bitcoinjs-lib、secp256k1等

  // 如果私钥通过了上述验证，则可以认为它是有效的secp256k1私钥
  return true;
}


function getAddress(privateKey) {
  const publicKey = secp256k1.getPublicKey(privateKey)
  const a = publicKey.slice(1);
  const hash = keccak256(a);
  const address = hash.slice(-20);
  return('0x' + toHex(address))
}


function Wallet({ address, setAddress, balance, setBalance ,privateKey,setPrivateKey,error,setError,sendAmount,recipient}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if(!isSecp256k1PrivateKey(privateKey)){
      setError("Invalid private key format");
      return
    } else {
      setError(null);
      // 如果私钥有效，你可以进一步处理私钥，例如通过私钥来获取钱包地址
      // setAddress(...);
    }

    const address = getAddress(privateKey)
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }


  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an private key" value={privateKey} onChange={onChange}></input>
      </label>
      {error && <div className="error">{error}</div>}
      <label>
        Wallet Address: {address}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
