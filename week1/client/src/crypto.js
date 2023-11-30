import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";

export function signMessage(msg, pk) {
    return secp256k1.sign(hashMessage(msg), pk);
}

export function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}