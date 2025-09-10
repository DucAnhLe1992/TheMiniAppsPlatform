import { css } from "styled-components";

export const glassmorphism = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

export const theme = {
  colors: {
    primary: "#5A67D8",
    background: "#121212",
    text: "#e0e0e0",
    accent: "#B794F4",
  },
  glassmorphism,
};
