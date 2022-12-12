import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import TransactionsTable from "../TransactionsTable/TransactionsTable";
import Credentials from "../Credentials/Credentials";

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
    address: "",
    balance: "",
  });
  const [addressesToSend, setAddressesToSend] = useState([""]);
  const [amountsToSend, setAmountsToSend] = useState([""]);
  const [activeToken, setActiveToken] = useState(tokens && tokens[0]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token = new ethers.Contract(
      activeToken.contractAddress,
      activeToken.abi,
      provider
    );

    getWalletBalance();

    token.on("Transfer", async (from, to, amount) => {
      getWalletBalance();
      const decimals = await token.decimals();
      setTransactions((currentTransactions) => [
        ...currentTransactions,
        {
          address: `${to.substring(0, 4)}...${to.substring(to.length - 5)}`,
          token: activeToken.name,
          amount: `${amount / 10 ** decimals}`,
          time: new Date().toLocaleString(),
        },
      ]);
    });

    return () => {
      token.removeAllListeners();
    };
  }, [activeToken, isConnected]);

  const handleChooseToken = (e) => {
    e.preventDefault();
    const token = tokens.find((item) => item.name === e.target.value);
    setActiveToken(token);
  };

  const getWalletBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    const signerAddress = await provider.getSigner().getAddress();

    if (ethereum.isConnected()) {
      setIsConnected(true);
      console.log("connected");
    } else {
      setIsConnected(false);
      console.log("disconnected");
    }

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
    const arr = [...addressesToSend];
    const index = arr.findIndex(
      (item, index) => `address-${index}` === e.target.id
    );
    if (index >= 0) {
      arr[index] = e.target.value;
      setAddressesToSend(arr);
    } else {
      throw Error("Can't find element in array");
    }
  };

  const handleAmountInput = (e) => {
    const arr = [...amountsToSend];

    const index = arr.findIndex(
      (item, index) => `amount-${index}` === e.target.id
    );

    if (index >= 0) {
      arr[index] = e.target.value;
      setAmountsToSend(arr);
    } else {
      throw Error("Can't find element in array");
    }
  };

  const handleAddAddress = () => {
    setAddressesToSend([...addressesToSend, ""]);
    setAmountsToSend([...amountsToSend, ""]);
  };

  const handleDeleteAddress = (e) => {
    const addresses = [...addressesToSend];
    const amounts = [...amountsToSend];
    const indexToDelete = addresses.findIndex(
      (item, index) => `deleteBtn-${index}` === e.currentTarget.id
    );

    if (indexToDelete >= 0) {
      addresses.splice(indexToDelete, 1);
      amounts.splice(indexToDelete, 1);
      setAddressesToSend(addresses);
      setAmountsToSend(amounts);
    } else {
      throw Error("Can't find element in array");
    }
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
    await token.transferToAddresses(
      addressesToSend,
      amountsToSend.map((amount) => `${amount * 10 ** decimals}`)
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
            secondary={
              isConnected
                ? balanceInfo.address
                : "Please, connect to Metamask wallet and reload page"
            }
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
            secondary={
              isConnected
                ? balanceInfo.balance
                : "Please, connect to Metamask wallet and reload page"
            }
          />
        </ListItem>
      </List>

      <Credentials
        addressInputHandler={handleAddressInput}
        amountInputHandler={handleAmountInput}
        credentialsData={{
          addressesToSend: addressesToSend,
          amountsToSend: amountsToSend,
        }}
        handleAddAddress={handleAddAddress}
        handleTransfer={handleTransfer}
        handleDeleteAddress={handleDeleteAddress}
        balance={balanceInfo.balance}
        isConnected={isConnected}
      />
      <TransactionsTable transactions={transactions} />
    </Container>
  );
};

export default Wallet;
