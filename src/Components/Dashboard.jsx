import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid } from '@material-ui/core';
import './App.css';
import {Typography} from '@material-ui/core';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Hospital', "Apollo","28-08-2024", "10:00 AM - 10:30 AM","Visited"),
    createData('Restaurant', "Shahghouse","05-06-2024", "05:00 PM -06:00 PM","Visited"),
    createData('Restaurant', "Mehfil","08-06-2024", "12:00 PM - 01:00 PM","Not Visited"),
    createData('Restaurant', "Paradise","23-01-2024", "11:00 AM - 11:30 AM","Visited"),
    createData('Salon', "Trust","12-04-2024", "09:00 AM - 10:30 AM","Not Visited"),,
  ];
  

const Dashboard = () => {
    const paperStyle={
        padding:20,height:'90vh',margin:"auto auto",textAlign:"left"
    };
    return (
        <Grid className='booking'>
        <Paper elevation={10} style={paperStyle}>
            <>
            <h1>Upcoming sessions</h1>
            <Paper
      sx={(theme) => ({
        p: 2,
        margin: 'auto',
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: '#fff',
        ...theme.applyStyles('dark', {
          backgroundColor: '#1A2027',
        }),
      })}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Type: Restaurant
              </Typography>
              <Typography variant="body2" gutterBottom>
                Name: Paradise
              </Typography>
            </Grid>
            <Grid item>
            <Button variant="contained" type='submit' color='primary' onClick={() =>{}}>Reschudule</Button>
            <span style={{marginLeft:'10px'}}></span>
            <Button variant="outlined" type='submit' color='primary' onClick={() =>{}}>Remove</Button>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: 06/09/2024
              </Typography>
            <Typography variant="body2" component="div">
               Slot: 1:00 PM -2:00 PM
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      
    </Paper>
            </>
            <>
            <h1>Completed Sessions</h1>
            <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{background :'#74b8ef'}}>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Date of Booking</TableCell>
                <TableCell align="right">Time Slot</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TableContainer>
            </>
            
        </Paper>
        </Grid>
      );
}

export default Dashboard