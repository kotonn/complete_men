import { Card, Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';



const Home = () => {

  return (
    <Box sx={{height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center", background: 'linear-gradient(to bottom right, pink, lightblue)', paddingTop: '4vh'}}>
      <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, marginRight: 'auto', marginLeft: 'auto'}}
      >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Google Maps"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
      </Paper>

      <Card sx={{ width: "90vw", height: "85vh", marginTop: "3vh", marginRight: 'auto', marginLeft: 'auto'}}>
      test
      </Card>
    </Box>
  )
}

export default Home