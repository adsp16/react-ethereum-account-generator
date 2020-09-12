import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  generateMnemonic,
  generateSeed,
  generatePrivKey,
  derivePubKey,
  deriveEthAddress,
  signTx,
  getSignerAddress,
} from "./helpers/generators";
import { Button, Grid, Container, Box, Typography } from "@material-ui/core";

const tranX = {
  nonce: "0x00",
  gasPrice: "0x09184e72a000",
  gasLimit: "0x2710",
  to: "0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6",
  value: "0x10",
  data:
    "0x7f7465737432000000000000000000000000000000000000000000000000000000600057",
  chainId: 3,
};

const App = () => {
  const [menomonic, setMnemonic] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [signedSample, setSignedSample] = useState("");
  const [recoveredAddress, setRecoveredAddress] = useState("");

  const setMem = () => {
    const mem = generateMnemonic();
    setMnemonic(mem);

    generateSeed(mem)
      .then((seed) => {
        const privateKey = generatePrivKey(seed);
        const puKey = derivePubKey(privateKey);
        const ethAdd = deriveEthAddress(puKey);
        console.log(privateKey);
        console.log(puKey);
        console.log(ethAdd);
        setPrivKey(privateKey);
        setPubKey(puKey);
        setEthAddress(ethAdd);
      })
      .catch((err) => console.log(err));
  };

  const signTrx = () => {
    const signedTransactioned = signTx(privKey, tranX);
    const signerAddress = getSignerAddress(signedTransactioned);

    console.log(signedTransactioned);

    setSignedSample(signedTransactioned);
    setRecoveredAddress(signerAddress);
  };

  useEffect(() => {
    console.log(generateMnemonic());
  }, []);

  return (
    <div className="App">
      <Container style={{ padding: "1rem" }} maxWidth="sm">
        <h2>
          Generating Ethereum accounts and signing transactions in Javascript
        </h2>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button onClick={setMem} variant="contained" color="primary">
              Generate New Mnemonic
            </Button>
          </Grid>
          <Grid item xs={12}>
            <textarea
              value={menomonic}
              rows="5"
              style={{ width: "100%", marginTop: "1.5rem" }}
            ></textarea>
            <p>
              **Note that in this demonstration application, this mnemonic will
              generate different sets of keys than Metamask or My Ether
              Wallet.**
            </p>
          </Grid>
          <Grid item xs={12}>
            {privKey && (
              <Box>
                <strong>Private Key:</strong>
                <Typography className="textWrap">{privKey}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            {pubKey && (
              <Box>
                <strong>Public Key:</strong>
                <Typography className="textWrap">{pubKey}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            {ethAddress && (
              <Box>
                <strong>Ethereum Address:</strong>
                <Typography className="textWrap">{ethAddress}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" onClick={signTrx} variant="contained">
              Sign Transaction
            </Button>
            {recoveredAddress && (
              <Box mt={2}>
                <Box my={2}>
                  <div style={{ marginBottom: "0.4rem" }}>
                    <strong>Sample Transaction</strong>
                  </div>
                  <Typography>{JSON.stringify(tranX, null, 2)}</Typography>
                </Box>
                <Box>
                  <Box my={2}>
                    <div style={{ marginBottom: "0.4rem" }}>
                      <strong>Signed Transaction</strong>
                    </div>
                    <Typography>{`{
                    nonce: '0x00',
                    gasPrice: '0x09184e72a000',
                    gasLimit: '0x2710',
                    to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6',
                    value: '0x00',
                    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
                    v : { 0x${signedSample.v.toString("hex")}}
                    r : { 0x${signedSample.r.toString("hex")}},
                    s : { 0x${signedSample.s.toString("hex")}}
                  }
                  `}</Typography>
                  </Box>
                </Box>
                <Box>
                  <strong>Signer Address</strong>
                  <Typography className="textWrap">
                    {recoveredAddress}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default App;
