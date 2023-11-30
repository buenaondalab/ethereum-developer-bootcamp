const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

function recoverPubKey(msg, signature) {
    return signature.recoverPublicKey(hashMessage(msg)).toRawBytes(false);
}

function validate(msg, signature) {
    const publicKey = recoverPubKey(msg, signature);
    const address = `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`;
    return address;
}

module.exports = validate;