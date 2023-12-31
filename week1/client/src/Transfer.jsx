import { useState } from "react";
import server from "./server";
import { signMessage } from "./crypto"

function Transfer({ address, setBalance, setNonce, nonce, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const msg = recipient+sendAmount+nonce;
    const {r,s,recovery} = signMessage(msg, privateKey);
    const signature = {
      r: r.toString(),
      s: s.toString(),
      recovery,
    };

    try {
      const {data} = await server.post(`send`, {
        signature,
        amount: parseInt(sendAmount),
        recipient,
        nonce,
      });
      setBalance(data.balance);
      setNonce(data.nonce);
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
