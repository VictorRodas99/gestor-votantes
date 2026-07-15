import Button from '@mui/material/Button'

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background-default">
      <h1 className="text-3xl font-medium text-primary">MUI + Tailwind</h1>
      <Button variant="contained" className="px-8">
        Click me
      </Button>
    </div>
  )
}

export default App
