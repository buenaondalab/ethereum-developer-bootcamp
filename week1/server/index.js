const express = require("express");
const app = express();
const cors = require("cors");
const validate = require("./validator")
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1").secp256k1;

app.use(cors());
app.use(express.json());

const accounts = new Map([
  ["0x4581765743aa3e85a6758bda1507af52362f24c4", {balance: 100, nonce: 0}], //a945614326341b350bc3f080bffd4bcc46aa9099a35d00513783ef986a9dd03e
  ["0xdc253b9b479e54872b5b1dc48497360b58c4f52d", {balance: 50, nonce: 0}], //85c87d259c2f1b51b3b74c2f0e7c664c1110897d55ab53683d31ef2f534a2b5e
  ["0x06fff8f739a4e1d06df76b14523a7566244f3554", {balance: 75, nonce: 0}], //6d2cf8d055155d466cedae84e18ace859e38f0638dd1baf2d84f2b16e364648f
]);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const account = accounts.get(address)
  const balance = account?.balance || 0;
  const nonce = account?.nonce || 0;
  res.send({ balance, nonce });
});

app.post("/send", (req, res) => {
  const { signature, recipient, amount, nonce } = req.body;
  const msg = recipient + amount + nonce;
  
  try {
    const sig = new secp.Signature(
      BigInt(signature.r),
      BigInt(signature.s)
    ).addRecoveryBit(signature.recovery);

    const senderAddress = validate(msg, sig);
    setInitialBalance(senderAddress);
    setInitialBalance(recipient);
  
    const senderAccount = accounts.get(senderAddress);
    const recipientAccount = accounts.get(recipient);
  
    if (senderAccount.nonce !== nonce) {
      res.status(400).send({ message: "Malformed request" });
    }
    else if (senderAccount.balance < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      senderAccount.balance -= amount;
      recipientAccount.balance += amount;
      senderAccount.nonce += 1;
      res.send({ ...senderAccount });
    }
  } catch (e) {
    res.status(400).send({ message: "Signature is not valid" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!accounts.get(address)) {
    accounts.set(address, {balance: 0, nonce: 0});
  }
}
