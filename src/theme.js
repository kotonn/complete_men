import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: '#eeeeee',
        },
    },
    // define the default font family
    typography: {
        fontFamily: "Arial unicode ms",
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
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