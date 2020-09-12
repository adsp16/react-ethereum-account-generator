import { hdkey } from "ethereumjs-wallet";
import wallet from "ethereumjs-wallet";
const BIP39 = require("bip39");
const keccak256 = require("js-sha3").keccak256;
const eethereumTx = require("ethereumjs-tx").Transaction;

export const generateMnemonic = () => {
  return BIP39.generateMnemonic();
};

//Function to check if generatedMem is valid mem
export const isValid = (genMem) => {
  return BIP39.validateMnemonic(genMem);
};

//Function to generate Hex Seed
export const generateSeed = (mem) => {
  return BIP39.mnemonicToSeed(mem);
};

//generate private key
export const generatePrivKey = (seed) => {
  return hdkey
    .fromMasterSeed(seed)
    .derivePath(`m/44'/60'/0'/0/0`)
    .getWallet()
    .getPrivateKey();
};

//generate public key
export const derivePubKey = (privKey) => {
  const walletz = wallet.fromPrivateKey(privKey);
  return walletz.getPublicKey();
};

export const deriveEthAddress = (pubKey) => {
  const address = keccak256(pubKey);
  return "0x" + address.substring(address.length - 40, address.length);
};

export const signTx = (privKey, txData) => {
  const tx = new eethereumTx(txData);
  console.log(tx);
  tx.sign(privKey);
  return tx;
};

export const getSignerAddress = (signedTx) => {
  return "0x" + signedTx.getSenderAddress().toString("hex");
};
