import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import TransactionsTable from "../TransactionsTable/TransactionsTable";
import Credentials from "../Credentials.jsx/Credentials";
import Button from "@mui/material/Button";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import Avatar from "@mui/material/Avatar";

const Wallet = ({ tokens }) => {
  const [transactions, setTransactions] = useState([]);
  const [balanceInfo, setBalanceInfo] = useState({
    address: "Connect wallet",
    balance: "Connect wallet",
  });
  const [addressesToSend, setAddressesToSend] = useState([""]);
  const [amountsToSend, setAmountsToSend] = useState([""]);
  const [activeToken, setActiveToken] = useState(tokens && tokens[0]);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token = new ethers.Contract(
      activeToken.contractAddress,
      activeToken.abi,
      provider
    );

    token.on("Transfer", async (from, to, amount, event) => {
      const decimals = await token.decimals();
      setTransactions((currentTransactions) => [
        ...currentTransactions,
        {
          address: String(
            to.substring(0, 4) + "..." + to.substring(to.length - 5)
          ),
          token: activeToken.name,
          amount: String(amount / 10 ** decimals),
          time: new Date().toLocaleString(),
        },
      ]);
    });

    return () => {
      token.removeAllListeners();
    };
  }, [activeToken]);

  const handleChooseToken = (e) => {
    e.preventDefault();
    const token = tokens.find((item) => item.name === e.target.value);
    setActiveToken(token);
  };

  const handleConnectToWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const token = new ethers.Contract(
      activeToken.contractAddress,
      activeToken.abi,
      provider
    );
    const balance = await token.balanceOf(signerAddress);
    const decimals = await token.decimals();

    setBalanceInfo({
      address: signerAddress,
      balance: balance / 10 ** decimals,
    });
  };

  const handleAddressInput = (e) => {
    e.preventDefault();
    const arr = [...addressesToSend];
    arr[arr.findIndex((item, index) => `address-${index}` === e.target.id)] =
      e.target.value;
    setAddressesToSend(arr);
  };

  const handleAmountInput = (e) => {
    e.preventDefault();
    const arr = [...amountsToSend];
    arr[arr.findIndex((item, index) => `amount-${index}` === e.target.id)] =
      e.target.value;
    setAmountsToSend(arr);
  };

  const handleAddAddress = () => {
    const addresses = [...addressesToSend];
    addresses.push("");
    const amounts = [...amountsToSend];
    amounts.push("");
    setAddressesToSend(addresses);
    setAmountsToSend(amounts);
  };

  const handleDeleteAddress = (e) => {
    e.preventDefault();
    const addresses = [...addressesToSend];
    const amounts = [...amountsToSend];
    const indexToDelete = addresses.findIndex(
      (item, index) => `address-${index}` == e.target.id
    );
    addresses.splice(indexToDelete, 1);
    amounts.splice(indexToDelete, 1);
    setAddressesToSend(addresses);
    setAmountsToSend(amounts);
  };

  const handleTransfer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const token = new ethers.Contract(
      activeToken.contractAddress,
      activeToken.abi,
      signer
    );
    const decimals = await token.decimals();
    const transaction = await token.transferToAddresses(
      addressesToSend,
      amountsToSend.map((amount) => String(amount * 10 ** decimals))
    );
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10px 0px",
        width: "50%",
        minWidth: "300px",
      }}
      fixed
    >
      <Box>
        <FormControl fullWidth>
          <InputLabel id="chooseTokenLabel">Choose Token</InputLabel>
          <Select
            labelId="chooseTokenLabel"
            id="chooseToken"
            value={activeToken.name}
            label="Choose Token"
            onChange={handleChooseToken}
          >
            {tokens.map((token) => (
              <MenuItem key={token.contractAddress} value={token.name}>
                {token.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <List sx={{ width: "100%" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountBalanceWalletOutlinedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Wallet address"
            secondary={balanceInfo.address}
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SavingsOutlinedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Balance"
            secondary={String(balanceInfo.balance)}
          />
        </ListItem>
      </List>
      <Button
        variant="contained"
        onClick={handleConnectToWallet}
        sx={{ margin: "10px 0px 20px" }}
      >
        connect wallet
      </Button>
      <Credentials
        addressInputHandller={handleAddressInput}
        amountInputHandler={handleAmountInput}
        credentialsData={{
          addressesToSend: addressesToSend,
          amountsToSend: amountsToSend,
        }}
        handleAddAddress={handleAddAddress}
        handleTransfer={handleTransfer}
        handleDeleteAddress={handleDeleteAddress}
      />
      <TransactionsTable transactions={transactions} />
    </Container>
  );
};

export default Wallet;
