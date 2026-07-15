import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import BottomNav from '../components/bottom-nav'
import TopBar from '../components/top-bar'
import { modules } from '../config/modules'

function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background-default">
      <TopBar />

      <main className="flex-1 px-5 pt-5 pb-28">
        {/* <TextField
          fullWidth
          placeholder="Buscar votante por cédula"
          aria-label="Buscar votante por cédula"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon className="text-text-secondary" />
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              backgroundColor: 'background.paper'
            }
          }}
        /> */}

        <div className="mt-5 grid grid-cols-2 gap-4">
          {modules.map((module) => (
            <Card
              key={module.key}
              elevation={0}
              className="rounded-md border border-outline-variant shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
              <CardActionArea className="flex flex-col items-center gap-3 px-4 py-6">
                <span className="flex size-16 items-center justify-center rounded-full bg-surface-container text-primary">
                  <module.Icon className="size-7" />
                </span>
                <Typography
                  variant="body1"
                  component="span"
                  className="font-semibold text-text-primary"
                >
                  {module.label}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default HomePage
