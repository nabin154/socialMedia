import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'

const FriendRequests = ({name, occupation, picturePath}) => {


     const { palette } = useTheme();
     const primaryLight = palette.primary.light;
     const primaryDark = palette.primary.dark;
     const main = palette.neutral.main;
     const medium = palette.neutral.medium;
  return (
    <>
    <Box color={main} height={'30px'} width={'80px'}>
            <Typography>{name}</Typography>
        <Box>
            <Button color='white' sx={{backgroundColor: 'red'}}>confirm</Button>
            <Button>cancel</Button>

        </Box>
    </Box>
      
    </>
  )
}

export default FriendRequests
