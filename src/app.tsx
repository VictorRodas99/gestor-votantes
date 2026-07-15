import Button from "@mui/material/Button";

function App() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-4 bg-background-default">
      <h1 className="text-primary text-3xl font-medium">MUI + Tailwind</h1>
      <Button variant="contained" className="px-8">
        Click me
      </Button>
    </div>
  );
}

export default App;
