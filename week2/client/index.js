const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const process = require('process');

const serverUrl = 'http://localhost:1225';

async function main(name) {
  // TODO: how do we prove to the server we're on the nice list?
  const proof = new MerkleTree(niceList).getProof(niceList.findIndex(n => n === name))

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof,
    name,
  });

  console.log({ gift });
}

main(process.argv[2]);