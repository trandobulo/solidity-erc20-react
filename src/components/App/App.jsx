import Typography from "@mui/material/Typography";
import React from "react";
import TATokenAbi from "../../contracts/TATokenAbi";
import Wallet from "../Wallet/Wallet";

function App() {
  const TOKENS = [
    {
      name: "TA",
      contractAddress: process.env.TATOKENADDRESS,
      abi: TATokenAbi,
    },
  ];

  return window && window.ethereum ? (
    <Wallet tokens={TOKENS} />
  ) : (
    <Typography
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      variant="h5"
    >
      Please, install Metamask
    </Typography>
  );
}

export default App;
