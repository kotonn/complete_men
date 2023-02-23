import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: '#eeeeee',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 400,
            md: 750,
            lg: 1200,
            xl: 1600,
        },
    },
});

export default theme;