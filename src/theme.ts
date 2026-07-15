import { createTheme } from "@mui/material/styles";

// `cssVariables: true` makes MUI emit its theme as `--mui-*` CSS custom
// properties on :root, which the Tailwind `@theme inline` block in index.css
// maps into Tailwind tokens (bg-primary, text-secondary, …).
const theme = createTheme({
  cssVariables: true,
});

export default theme;
