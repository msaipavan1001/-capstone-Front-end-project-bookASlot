import React, { useEffect, useState } from 'react';
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
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import MarginSpacer from './MarginSpacer';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

const CompletedAlert = () =>{
    return (
      <Alert severity="success">
        Session Marked as completed
    </Alert>
    );
}

const CancelAlert = () =>{
  return (
    <Alert severity="warning">
      Session Marked as cancelled
  </Alert>
  );
}

const Dashboard = () => {
  const [rows,setRows] = useState([]);
  const [upcomingSessions,setUpcomingSessions] = useState([]);
  const navigate = useNavigate();
  // useState([
  //   createData('Hospital', "Apollo","28-08-2024", "10:00 AM - 10:30 AM","Visited"),
  //   createData('Restaurant', "Shahghouse","05-06-2024", "05:00 PM -06:00 PM","Visaited"),
  //   createData('Restaurant', "Mehfil","08-06-2024", "12:00 PM - 01:00 PM","Not Visited"),
  //   createData('Restaurant', "Paradise","23-01-2024", "11:00 AM - 11:30 AM","Visited"),
  //   createData('Salon', "Trust","12-04-2024", "09:00 AM - 10:30 AM","Not Visited"),
  // ]);
  const [completeAlert,setCompleteAlert] =useState(false);
  const [getSessions,setGetSessions] =useState(false);
  const [cancelAlert,setCancelAlert] =useState(false);
  const { initateCustomerdata, initateBusinessdata,businessData,customerData,resetData } = useAppContext(); // Use the context
  const paperStyle={
        padding:20,height:'auto',margin:"auto auto",textAlign:"left",background:'#eef7ff'
    };
  useEffect(()=>{
    if(completeAlert){
      setTimeout(()=>{
        setCompleteAlert(false);
      },[3000])
    }
    if(cancelAlert){
      setTimeout(()=>{
        setCancelAlert(false);
      },[3000])
    }
  },[completeAlert,cancelAlert]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://54.211.16.123:8000/sessions/');
      if(response.data){
        const filteredData = response.data?.filter(session => session?.customer?.customer_id === customerData.customer_id);
        const upcomingSessions = filteredData?.filter(session => session?.session_status === "isBooked");
        setUpcomingSessions(upcomingSessions);
        const completedOrCanclleld = filteredData?.filter(session => session?.session_status === "isCancelled" || session?.session_status === "isCompleted");
        // setRows((prevData) => [...prevData,createData(session.Type,session.Name,session.Date,session.Slot,"Visited")]);
        if(completedOrCanclleld?.length >0){
          const tempArr=[];
          for(let session of completedOrCanclleld){
            const val = session?.session_status === 'isCompleted' ? "Visited" : session?.session_status === 'isCancelled' ? "Not Visited" : "N/A"
            tempArr?.push(createData(session?.business?.business_type,session?.business?.business_name,session.session_date,session.timeslot,val))
          }
          setRows(tempArr);
        }
      } 
    } catch (err) {
      //setError(err);               // Handle any errors
      console.log("err:",err)
    }
  };

  useEffect(() => {
    // Fetch data from the server when component mounts
      fetchSessions();  // Call the asynchronous function
  }, []); 
  useEffect(() => {
    // Fetch data from the server when component mounts
    if(getSessions){
      fetchSessions();  // Call the asynchronous function
      setGetSessions(false);
    }
  }, [getSessions]); 
  
    // const [upcomingSessions,setUpcomingSessions] = useState([{id:1,Type: "Restaurant",Name: "Paradise",Date: "06/10/2024","Slot":"01:00 PM -02:00 PM"},{id:2,Type: "Saloon",Name: "Trust",Date: "07/10/2024","Slot":"12:00 PM -01:00 PM"},{id:3,Type: "Hospital",Name: "Apollo",Date: "05/10/2024","Slot":"04:00 PM -06:00 PM"}])
    const completeSession = async (session) =>{
      const url =  `http://54.211.16.123:8000/sessions/update/with-customer/${session.session_uid}/`
      const slotData ={
          "session_uid" :session?.session_uid,
          "session_date": session?.session_date,
          "timeslot": session?.timeslot,
          "session_status": "isCompleted",
          "customer_email": session?.customer?.customer_mail
        }
        console.log('Slot data:', slotData); // For debugging

        try {
          const response = await axios.put(url, slotData); 
          console.log('API response:', response.data);
          setCompleteAlert(true);
          setGetSessions(true);
          // Handle successful response (e.g., show success message, reset form, etc.)
          } catch (error) {
          console.error('Error making API call:', error);
          // Handle error appropriately (e.g., show error message)
        }
      // const updateSessions = upcomingSessions?.filter((x) => x?.id !== session?.id);
      // setUpcomingSessions(updateSessions);
      // setRows((prevData) => [...prevData,createData(session.Type,session.Name,session.Date,session.Slot,"Visited")]);
      
    }
    const cancelSession =  async(session) =>{
      const url =  `http://54.211.16.123:8000/sessions/update/with-customer/${session.session_uid}/`
      const slotData ={
          "session_uid" :session?.session_uid,
          "session_date": session?.session_date,
          "timeslot": session?.timeslot,
          "session_status": "isCancelled",
          "customer_email": session?.customer?.customer_mail
        }

      try {
        const response = await axios.put(url, slotData);
        console.log('API response:', response.data);
        setCancelAlert(true);
        setGetSessions(true);
        // Handle successful response (e.g., show success message, reset form, etc.)
        } catch (error) {
        console.error('Error making API call:', error);
        // Handle error appropriately (e.g., show error message)
      }
      // const updateSessions = upcomingSessions?.filter((x) => x?.id !== session?.id);
      // setUpcomingSessions(updateSessions);
      // setRows((prevData) => [...prevData,createData(session.Type,session.Name,session.Date,session.Slot,"Not Visited")]);
    }
    const handleLogout = () =>{
      resetData();
      navigate('/login')
    }
    return (
        <>
        <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLogout}
        style={{float:"right"}}
        >
      Logout
    </Button>
        {completeAlert && <CompletedAlert />}
        {cancelAlert && <CancelAlert />}
        <Grid className='booking'>
        <Paper elevation={10} style={paperStyle}>
            <>
            <Button variant="outlined" type='submit' color='primary' onClick={() =>navigate('/booking')}>Go To Booking</Button>
            <MarginSpacer />
            <div>
            <div>
            <Typography variant="caption" gutterBottom style={{float:"right"}}>
              Username:{customerData?.customer_name}
            </Typography>
            </div>
            <Typography variant="h4" gutterBottom>
            Upcoming sessions
            </Typography>
           
           {upcomingSessions?.length > 0 ? upcomingSessions?.map((session) =>{
             return (
               <Paper
               sx={(theme) => ({
                 p: 2,
                 margin: '2px',
                 maxWidth: 500,
                 flexGrow: 1,
                 display:'inline-block',
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
                   Type: {session?.business?.business_type}
                 </Typography>
                 <Typography variant="body2" gutterBottom>
                   Name: {session?.business?.business_name}
                 </Typography>
               </Grid>
               <Grid item style={{marginBottom:'10px'}}>
               <Button variant="contained" type='submit' color='primary' onClick={() =>completeSession(session)}>Complete</Button>
               <span style={{marginLeft:'10px'}}></span>
               <Button variant="outlined" type='submit' color='primary' onClick={() =>cancelSession(session)}>Cancel</Button>
               </Grid>
             </Grid>
             <Grid item>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                   Date: {session?.session_date}
                 </Typography>
               <Typography variant="body2" component="div">
                 Slot: {session?.timeslot}
               </Typography>
             </Grid>
           </Grid>
           </Grid>
               </Paper>)
           }) : 
                <Paper
                sx={(theme) => ({
                p: 2,
                margin: '3px',
                maxWidth: 500,
                flexGrow: 1,
                display:"inline-block",
                backgroundColor: '#fff',
                ...theme.applyStyles('dark', {
                  backgroundColor: '#1A2027',
                }),
              })}
            >
                No Upcoming Sessions
            </Paper>
          }
            </div>
           
         
            </>
            <>
            <h1>Completed Sessions</h1>
            {rows?.length > 0 ? <TableContainer component={Paper}>
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
            </TableContainer> : <>
            <Paper
                sx={(theme) => ({
                p: 2,
                margin: '3px',
                maxWidth: 500,
                flexGrow: 1,
                display:"inline-block",
                backgroundColor: '#fff',
                ...theme.applyStyles('dark', {
                  backgroundColor: '#1A2027',
                }),
              })}
            >
                No Completed Sessions
            </Paper>
            </>}
            </>
            
        </Paper>
        </Grid>
        </>
       
      );
}

export default Dashboard