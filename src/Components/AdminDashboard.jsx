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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import MarginSpacer from './MarginSpacer';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { Alert } from '@mui/material';
import axios from 'axios';

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


const AdminDashboard = () => {
    const paperStyle={
        padding:20,height:"auto",margin:"auto auto",textAlign:"left",background:'#eef7ff'
    };
    const minDate = dayjs().add(1, 'day');
    const [showAdminSlotCreation,setShowAdminSlotCreation]=useState(false);
    const [selectedDate, setSelectedDate] = useState(minDate);
    const [formatedDate,setFormatedDate] =useState('');
    const [finalEndTime,setFinalEndTime] =useState('');
    const [finalStartTime,setFinalStartTime] =useState('');
    const [sucess,setSucess]=useState(false);
    const [sucessWait,setSuccessWait]=useState(false);
    console.log("newDate:",selectedDate,"formatedDate:",formatedDate);

    const [rows,setRows]=useState([
    ])
    // const [rows,setRows]=useState([
    //   createData('10021', "Pavan","28-08-2024", "10:00 AM - 10:30 AM","Visited"),
    //   createData('10024', "Rahul","05-06-2024", "05:00 PM -06:00 PM","Visited"),
    //   createData('10026', "Rajesh","08-06-2024", "12:00 PM - 01:00 PM","Not Visited"),
    // ])

    const handleDateChange = (newDate) => {
      const formatDate = newDate.toISOString().split('T')[0];
      setSelectedDate(newDate);
      setFormatedDate(formatDate)
  };
  const [errorTime,setErrorTime]=useState(false);
  const [completeAlert,setCompleteAlert] =useState(false);
  const [cancelAlert,setCancelAlert] =useState(false);
  const [startTime,setStartTime]=useState(dayjs().hour(10).minute(0));
  const [endTime,setEndTime]=useState(dayjs().hour(10).minute(0));
  const [upcomingSessions,setUpcomingSessions] = useState([{id:10025,customer_name:"Rajini",Date: "05/10/2024",Slot: "04:00 PM -06:00 PM"},{id:10022,customer_name:"Paritosh",Date: "05/10/2024","Slot": "05:00 PM -06:30 PM"},{id:10032,customer_name:"Harini",Date: "10/10/2024","Slot": "02:00 PM -03:00 PM"}])
  const { initateCustomerdata, initateBusinessdata,businessData,customerData } = useAppContext(); // Use the context
console.log("businessData:",businessData)
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
},[completeAlert,cancelAlert])
  const handleStartTimeChange = (newTime) => {
  const testTime = formattedTime(newTime);
  console.log("test time:",testTime)
  const AmOrPm = testTime?.split(":")[0] ?  testTime?.split(":")[0] >= 12 ? 'PM' : 'AM' : 'AM';
  setFinalStartTime(`${testTime} ${AmOrPm}`)
  setStartTime(newTime);
};
const formattedTime = (selectedTime) =>{
  return format(selectedTime, 'HH:mm')
};
const handleEndTimeChange = (newTime) => {
  const testTime = formattedTime(newTime);
  console.log("test time:",testTime)
  const AmOrPm = testTime?.split(":")[0] ?  testTime?.split(":")[0] >= 12 ? 'PM' : 'AM' : 'AM';
  setFinalEndTime(`${testTime} ${AmOrPm}`)
  setEndTime(newTime);
};
const completeSession = async (session) =>{
  const slotData = {
    business:  1 ,
    id:session.id,
    session_date: session.Date,
    slot:session.Slot,
    session_status: "IsCompleted",
    customer_id:customerData.customer_id,
    customer_name:customerData.customer_name,
    customer_mail:customerData.customer_mail
  };
  console.log('Slot data:', slotData); // For debugging

  try {
    const response = await axios.post('http://127.0.0.1:8000/sessions/', slotData); // Replace with your actual API endpoint
    console.log('API response:', response.data);
    // Handle successful response (e.g., show success message, reset form, etc.)
    } catch (error) {
    console.error('Error making API call:', error);
    // Handle error appropriately (e.g., show error message)
  }
const updateSessions = upcomingSessions?.filter((x) => x?.id !== session?.id);
setUpcomingSessions(updateSessions);
setRows((prevData) => [...prevData,createData(session.id,session.customer_name,session.Date,session.Slot,"Visited")]);
setCompleteAlert(true)
}
const cancelSession =  async(session) =>{
const slotData = {
  business: 1 ,
  id:session.id,
  session_date: session.Date,
  slot:session.Slot,
  session_status: "isCancelled",
  customer_id:customerData.customer_id,
  customer_name:customerData.customer_name,
  customer_mail:customerData.customer_mail
};
console.log('Slot data:', slotData); // For debugging

try {
  const response = await axios.post('http://127.0.0.1:8000/sessions/', slotData); // Replace with your actual API endpoint
  console.log('API response:', response.data);
  // Handle successful response (e.g., show success message, reset form, etc.)
  } catch (error) {
  console.error('Error making API call:', error);
  // Handle error appropriately (e.g., show error message)
}
const updateSessions = upcomingSessions?.filter((x) => x?.id !== session?.id);
setUpcomingSessions(updateSessions);
setRows((prevData) => [...prevData,createData(session.id,session.customer_name,session.Date,session.Slot,"Not Visited")]);
setCancelAlert(true)
}
useEffect(()=>{
  if(sucessWait){
    setTimeout(()=>{
      setSuccessWait(false);
      setShowAdminSlotCreation(false);
    },2000)
  }
},[sucessWait])
const validateTime = (start, end) => {
  if (start && end) {
    if (start > end) {
      setErrorTime(true);
      return false;
    } else {
      setErrorTime(false);
      return true;
    }
  }
};
const SucessAlert = () =>{
  return (
    <Alert severity="success">
      Slot has been created sucessfully
    </Alert>
  );
}

const ErrorTimeAlert = () =>{
  return (
    <Alert severity="error">
      Start time cannot be greater than end time.
    </Alert>
  );
}

const handleSubmitSlotCreation = async () => {
  const validateTimeError = validateTime(startTime,endTime)
  if(validateTimeError){
    const timeslot = `${finalStartTime} - ${finalEndTime}`;
  const sessionStatus = "isAvailable";
  const customer = null; // Assuming customer is null

  const slotData = {
    business: 2 ,
    session_date: formatedDate,
    timeslot,
    session_status: sessionStatus,
    customer,
  };

  console.log('Slot data:', slotData); // For debugging

  try {
    const response = await axios.post('http://127.0.0.1:8000/sessions/', slotData); // Replace with your actual API endpoint
    if(response.data?.id){
      setSucess(true);
      setSuccessWait(true)
    }
    console.log('API response:', response.data);
    // Handle successful response (e.g., show success message, reset form, etc.)
  } catch (error) {
    console.error('Error making API call:', error);
    // Handle error appropriately (e.g., show error message)
  }
  }
};

console.log("start time:",startTime,"endTime:",endTime)
    return (

        <Grid className='booking'>
          {completeAlert && <CompletedAlert />}
          {cancelAlert && <CancelAlert />}
        <Typography variant="caption" gutterBottom style={{float:"right",margin:"1rem"}}>
              Business Name:Shahghouse
        </Typography>  
        <Paper elevation={10} style={paperStyle}>
          {!showAdminSlotCreation ? 
          <>
          <>
            <Button variant="outlined" type='submit' color='primary' onClick={() =>setShowAdminSlotCreation(true)}>Create Slots</Button>
            <h1>Upcoming sessions</h1>
            {upcomingSessions?.length > 0 ? 
            upcomingSessions?.map((session)=>{
              return  (
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1" component="div">
                      Booking Id: {session.id}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                      Customer Name: {session.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item>
                    <Button variant="outlined" type='submit' color='primary' onClick={() =>completeSession(session)}>Completed</Button>
                    <Button variant="outlined" type='submit' color='secondary' onClick={() =>cancelSession(session)}>Cancel</Button>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Date: {session.Date}
                      </Typography>
                    <Typography variant="body2" component="div">
                       Slot: {session.Slot}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
                    </Paper>
              )
            })
            : 
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
            </>
            <>
            <h1>Completed Sessions</h1>
            <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{background :'#74b8ef'}}>
              <TableRow>
                <TableCell>Booking Id</TableCell>
                <TableCell align="right">Customer Name</TableCell>
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
          </> :

  <>
     <Typography variant="h4" gutterBottom>
        Please create a new slot by selecting the below fields
      </Typography>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker 
        label="Select the date of time slot" 
        value={selectedDate}
        onChange={handleDateChange}
        minDateTime={minDate}
        inputFormat="dd/MM/yyyy"
        />
      </DemoContainer>
    </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label="Start Time" value={startTime}
                    onChange={handleStartTimeChange} ampm={false}/>
      </DemoContainer>
    </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label="End time" value={endTime}
                    onChange={handleEndTimeChange} ampm={false} format="HH:mm"/>
      </DemoContainer>
    </LocalizationProvider>
    <MarginSpacer  />
    <Button variant="outlined" type='submit' color='primary' onClick={() =>handleSubmitSlotCreation()}>Submit</Button>
    <Button variant="outlined" type='submit' color='secondary' onClick={() =>setShowAdminSlotCreation(false)}>Cancel</Button>
    <MarginSpacer />
    {sucess &&<SucessAlert />}
    {errorTime &&<ErrorTimeAlert />}
    </>}
  
        </Paper>
        </Grid>
      );
}

export default AdminDashboard