import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookASlotIntro = () => {
    const navigate = useNavigate();
 // Handler for Sign In button click
 const handleSignIn = () => {
    // Add your sign-in logic here
    navigate('/signUp')
  };

  // Handler for Login button click
  const handleLogin = () => {
    // Add your login logic here
    navigate('/login')
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        background:'aliceblue'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Book A Slot
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSignIn}
        >
          Sign Up
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default BookASlotIntro