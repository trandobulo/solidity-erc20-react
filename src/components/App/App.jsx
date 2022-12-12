import React, { useState, useEffect } from "react";
import Wallet from "../Wallet/Wallet";
import TATokenAbi from "../../contracts/TATokenAbi";
import Typography from "@mui/material/Typography";

function App() {
  const TOKENS = [
    {
      name: "TA",
      contractAddress: "0xade4228f9DE91099928647397bA5114Ea85D7F81",
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
