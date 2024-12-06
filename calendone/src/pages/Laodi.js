import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Laodi() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
      <CircularProgress size="5rem" sx={{ color: "#6d3b79" }} />
    </Box>
  );
}
