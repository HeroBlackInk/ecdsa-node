import { useState } from "react";
import server from "./server";
import { sign,getPublicKey } from "./cryptography";



function convertBigIntsToStrings(obj) {
  if (typeof obj !== 'object' || obj === null) {
    // 如果 obj 不是对象或为 null，则直接返回
    return obj;
  }

  // 遍历对象的属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'bigint') {
        // 如果属性值是 BigInt，将其转换为字符串
        obj[key] = value.toString();
      } else if (typeof value === 'object') {
        // 如果属性值是对象，则递归调用该函数
        obj[key] = convertBigIntsToStrings(value);
      }
    }
  }

  return obj;
}


function Transfer({ address, setBalance ,sendAmount,setSendAmount,recipient,setRecipient,privateKey}) {


  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const tx = {}
    const msg = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient:recipient,
    }
    const signature = await sign(msg,privateKey)
    const publicKey =  getPublicKey(privateKey)
    tx.msg = msg
    tx.signature = signature
    tx.publicKey =  publicKey
    console.log(tx)
    const headers = { "Content-Type": "application/json" };
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient:recipient,
        tx:convertBigIntsToStrings(tx),
      },{headers:headers});
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
