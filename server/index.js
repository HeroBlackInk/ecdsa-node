const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;



const generate = require("./scripts/generate")

app.use(cors());
app.use(express.json(strict = false));

const balances = {
  "0xf368223f8815fcce0469af27413a7c9e8a61b7fa": 100,
  "0xd39d40d68773d288ce2a3ed65973dcb8b75903a1": 50,
  "0x58cdf0c788a5625eeadf93f9973fab964e92bc91": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { tx} = req.body;
  console.log(tx.msg)
  console.log(tx.signature)
  console.log(tx.signature["recovery"])
  console.log(tx.publicKey)

  if(!generate.verify(tx.signature,tx.msg,tx.publicKey)){
    console.log(`Invalid signature`)
    return
  }

  if(!generate.verifySenderAddress(tx.publicKey,tx.msg.sender)){
    console.log(`Invalid sender address`)
    return
  }else{
    console.log(`Sender address verification successful.`)
  }

  let sender = tx.msg.sender
  let recipient = tx.msg.recipient 
  let amount = tx.msg.amount
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
