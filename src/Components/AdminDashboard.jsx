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
  const [getSessions,setGetSessions] =useState(false);
  const [errorTime,setErrorTime]=useState(false);
  const [completeAlert,setCompleteAlert] =useState(false);
  const [cancelAlert,setCancelAlert] =useState(false);
  const [startTime,setStartTime]=useState(dayjs().hour(10).minute(0));
  const [endTime,setEndTime]=useState(dayjs().hour(10).minute(0));
  const [upcomingSessions,setUpcomingSessions] = useState([])
  const { initateCustomerdata, initateBusinessdata,businessData,customerData } = useAppContext(); // Use the context
console.log("businessData:",businessData)
const resetTimeSlots = () =>{
  setSelectedDate(minDate)
  setFormatedDate('')
  setFinalEndTime('')
  setFinalStartTime('')
}
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
const fetchSessions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/sessions/');
    if(response.data){
      const filteredData = response.data?.filter(session => session?.business?.business_id === businessData.business_id);
      const upcomingSessions = filteredData?.filter(session => session?.session_status === "isBooked");
      setUpcomingSessions(upcomingSessions);
      const completedOrCanclleld = filteredData?.filter(session => session?.session_status === "isCancelled" || session?.session_status === "isCompleted");
      // setRows((prevData) => [...prevData,createData(session.Type,session.Name,session.Date,session.Slot,"Visited")]);
      if(completedOrCanclleld?.length >0){
        const tempArr=[];
        for(let session of completedOrCanclleld){
          const val = session?.session_status === 'isCompleted' ? "Visited" : session?.session_status === 'isCancelled' ? "Not Visited" : "N/A"
          tempArr?.push(createData(session?.session_uid,session?.customer?.customer_name,session.session_date,session.timeslot,val))
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
  const url =  `http://127.0.0.1:8000/sessions/update/by-business/${session?.session_uid}/`
  const slotData ={
          "session_date": session?.session_date,
          "timeslot": session?.timeslot,
          "session_status": "isCompleted",
          "business_mail": session?.business?.business_mail
        }

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
// setRows((prevData) => [...prevData,createData(session.id,session.customer_name,session.Date,session.Slot,"Visited")]);

}
const cancelSession =  async(session) =>{
  const url =  `http://127.0.0.1:8000/sessions/update/by-business/${session?.session_uid}/`
  const slotData ={
          "session_date": session?.session_date,
          "timeslot": session?.timeslot,
          "session_status": "isCompleted",
          "business_mail": session?.business?.business_mail
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
// setRows((prevData) => [...prevData,createData(session.id,session.customer_name,session.Date,session.Slot,"Not Visited")]);

}
useEffect(()=>{
  if(sucessWait){
    setTimeout(()=>{
      setSuccessWait(false);
      setShowAdminSlotCreation(false);
      setSucess(false);
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
let session_Id = () => Math.floor(Math.random() * 900) + 100;

const handleSubmitSlotCreation = async () => {
  const validateTimeError = validateTime(startTime,endTime)
  if(validateTimeError && businessData?.business_mail){
    const timeslot = `${finalStartTime} - ${finalEndTime}`;
  const sessionStatus = "isAvailable";
  const customer = null; // Assuming customer is null
console.log("timeslot:",timeslot)
  const slotData = {
    "session_uid": session_Id(),
    "session_date": formatedDate,
    "timeslot": timeslot,
    "session_status": sessionStatus,
    "business_email": businessData?.business_mail
}

  console.log('Slot data:', slotData,"timeslot:",timeslot); // For debugging

  try {
    const response = await axios.post('http://127.0.0.1:8000/sessions/create/', slotData); 
    if(response.data?.business?.business_id){
      setSucess(true);
      setSuccessWait(true)
      resetTimeSlots();
    }
    console.log('API response:', response.data);
    // Handle successful response (e.g., show success message, reset form, etc.)
  } catch (error) {
    console.error('Error making API call:', error);
    // Handle error appropriately (e.g., show error message)
  }
  }
};

const handleCancelSlotCraetion = () =>{
  setShowAdminSlotCreation(false);
  resetTimeSlots();
}
console.log("start time:",startTime,"endTime:",endTime)
    return (

        <Grid className='booking'>
          {completeAlert && <CompletedAlert />}
          {cancelAlert && <CancelAlert />}
        <Typography variant="caption" gutterBottom style={{float:"right",margin:"1rem"}}>
              Business Name:{businessData?.business_name || ''}
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
                      Booking Id: {session.session_uid}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                      Customer Name: {session?.customer?.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item>
                    <Button variant="outlined" type='submit' color='primary' onClick={() =>completeSession(session)}>Completed</Button>
                    <Button variant="outlined" type='submit' color='secondary' onClick={() =>cancelSession(session)}>Cancel</Button>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Date: {session.session_date}
                      </Typography>
                    <Typography variant="body2" component="div">
                       Slot: {session.timeslot}
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
            {rows?.length > 0 ? <>
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
            </> : <>
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
    <Button variant="outlined" type='submit' color='secondary' onClick={() =>handleCancelSlotCraetion() }>Cancel</Button>
    <MarginSpacer />
    {sucess &&<SucessAlert />}
    {errorTime &&<ErrorTimeAlert />}
    </>}
  
        </Paper>
        </Grid>
      );
}

export default AdminDashboard