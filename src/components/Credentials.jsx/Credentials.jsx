import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const Credentials = ({
  addressInputHandller,
  amountInputHandler,
  credentialsData,
  handleAddAddress,
  handleTransfer,
  handleDeleteAddress,
}) => {
  const credentialsArray = [];
  for (let i = 0; i < credentialsData.addressesToSend.length; i++) {
    credentialsArray.push({
      address: credentialsData.addressesToSend[i],
      amount: credentialsData.amountsToSend[i],
    });
  }

  return (
    <>
      {credentialsArray.map((item, index) => (
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
                startIcon={<ClearIcon />}
                onClick={handleDeleteAddress}
              ></Button>
            )}
          </Box>
          <TextField
            id={`address-${index}`}
            label="Sent to address"
            variant="outlined"
            error={
              item.address.length > 0 &&
              !item.address.match(/^0x[a-fA-F0-9]{40}$/)
            }
            onChange={addressInputHandller}
            value={item.address}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            id={`amount-${index}`}
            label="Amount"
            variant="outlined"
            value={item.amount}
            onChange={amountInputHandler}
            sx={{ marginBottom: "10px" }}
          />
        </Box>
      ))}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={handleTransfer}>
          Send tokens
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
        >
          add adress
        </Button>
      </Box>
    </>
  );
};

export default Credentials;
