import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';

import IconButton from '@mui/material/IconButton';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Icon } from '@mui/material';

export default function Bottombar() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
          <IconButton><RestoreIcon></RestoreIcon></IconButton>
          <IconButton><RestoreIcon></RestoreIcon></IconButton>
          <IconButton><RestoreIcon></RestoreIcon></IconButton>
      </Paper>
    </Box>
  );
}