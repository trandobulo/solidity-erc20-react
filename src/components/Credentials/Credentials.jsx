import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const Credentials = ({
  addressInputHandler,
  amountInputHandler,
  credentialsData,
  handleAddAddress,
  handleTransfer,
  handleDeleteAddress,
  balance,
  isConnected,
}) => {
  const [notValidAddress, setNotValidAddress] = useState([]);
  const [notValidAmount, setNotValidAmount] = useState([]);

  useEffect(() => {
    setNotValidAddress(
      [...credentialsData.addressesToSend].map((item) =>
        isNotValidAddress(item)
      )
    );
    setNotValidAmount(
      [...credentialsData.amountsToSend].map((item) => isNotValidAmount(item))
    );
  }, [credentialsData]);

  const credentialsArray = [];
  credentialsData.addressesToSend.map((item, index) =>
    credentialsArray.push({
      address: credentialsData.addressesToSend[index],
      amount: credentialsData.amountsToSend[index],
    })
  );

  const amountsSum = credentialsArray.reduce(
    (sum, current) => Number(current.amount) + sum,
    0
  );

  const isNotValidAddress = (address) => {
    return address.length > 0 && !address.match(/^0x[a-fA-F0-9]{40}$/);
  };

  const isNotValidAmount = (amount) => {
    if (amount.length > 0) {
      return !amount.match(/^\d+$/) || amountsSum > balance;
    }
    return false;
  };

  return (
    <FormControl>
      {credentialsArray.map((item, index) => {
        return (
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            autoComplete="off"
            key={index}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography textAlign="center" variant="h6" gutterBottom>
                {`Address ${index + 1}`}
              </Typography>
              {credentialsArray.length > 1 && (
                <Button
                  id={`deleteBtn-${index}`}
                  startIcon={<ClearIcon />}
                  onClick={handleDeleteAddress}
                ></Button>
              )}
            </Box>
            <TextField
              id={`address-${index}`}
              label="Sent to address"
              variant="outlined"
              error={notValidAddress[index]}
              required
              onChange={addressInputHandler}
              value={item.address}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              error={notValidAmount[index]}
              required
              id={`amount-${index}`}
              label="Amount"
              variant="outlined"
              value={item.amount}
              onChange={amountInputHandler}
              sx={{ marginBottom: "10px" }}
            />
          </Box>
        );
      })}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          onClick={handleTransfer}
          disabled={
            notValidAddress.includes(true) ||
            notValidAmount.includes(true) ||
            credentialsData.amountsToSend.includes("") ||
            !isConnected
          }
        >
          Send tokens
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
        >
          add address
        </Button>
      </Box>
    </FormControl>
  );
};

export default Credentials;
