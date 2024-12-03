import React from "react";

import { Paper, Typography } from "@mui/material";

export default function Topbar({ header }) {
  return (
    <Paper
        square
        elevation={3}
        sx={{
          backgroundColor: "#6d3b79",
          color: "white",
          paddingY: "3%",
          position: "fixed",
          bottom: "0",
          left: 0,
          right: 0,
          textAlign: "center"
        }}
      >
        <Typography variant="h4">"Bottom Bar"</Typography>
      </Paper>
  );
}