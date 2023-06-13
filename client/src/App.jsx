import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState(null);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");


  return (
    <div className="app">
      <Wallet
        privateKey = {privateKey}
        setPrivateKey = {setPrivateKey}
        error = {error}
        setError = {setError}
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        sendAmount = {sendAmount}
        recipient = {recipient}
      />
      <Transfer 
        setBalance={setBalance} 
        address={address}
        sendAmount = {sendAmount}
        setSendAmount = {setSendAmount}
        recipient = {recipient}
        setRecipient = {setRecipient}
        privateKey = {privateKey}
      />
    </div>
  );
}

export default App;
