import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak"
import { toHex } from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, nonce, setNonce }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp256k1.getPublicKey(privateKey, false);
    const address = `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`;
    setAddress(address);
    if (address) {
      const {
        data: { balance, nonce },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      setNonce(nonce)
    } else {
      setBalance(0);
      setNonce(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div className="field">Address: {address}</div>
      <div className="field">Balance: {balance}</div>
      <div className="field">Nonce: {nonce}</div>
    </div>
  );
}

export default Wallet;
