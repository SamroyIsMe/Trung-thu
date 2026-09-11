"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#f08a2a",
      contrastText: "#fff",
    },
    secondary: {
      main: "#7c5ce0",
    },
    background: {
      default: "#4eb7e6",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e2a4a",
      secondary: "#3d4d73",
    },
  },
  typography: {
    fontFamily: "var(--font-be-vietnam), Be Vietnam Pro, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingInline: 20,
          paddingBlock: 10,
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
