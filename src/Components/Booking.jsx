import React, { useEffect, useState } from 'react'
import { Grid,Paper,Container,FormControl,InputLabel,Select,MenuItem} from '@material-ui/core';
import Avatar from '@mui/material/Avatar';
import './App.css';
import {Button} from '@material-ui/core';
import { Alert } from '@mui/material';
import { Navigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppContext } from '../context/AppContext';
import { Box } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography,  } from '@mui/material';
// //import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const MarginSpacerL = () =>{
    return (
        <div style={{margin:"16px"}}></div>
    )
}

const MarginSpacerM = () =>{
    return (
        <div style={{margin:"8px"}}></div>
    )
}

const data={
    Hospital:{
        id:1,
        type:"Hospital",
        Names:[
            {id:1, name:"Apollo Hospitals",slots:["10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM"]},
            {id:2, name:"KIMS Hospitals",slots:["09:00 AM - 10:00 AM","10:00 AM - 11:00 AM","11:00 AM - 12:00 pm","04:30 PM - 05:30 PM"]},
            {id:3, name:"Yashoda Hospitals",slots:["06:00 AM - 07:00 AM","08:00 AM - 09:00 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM"]}]
        },
        Restaurant:{
        id:1,
        type:"Restaurant",
        Names:[
        {id:1, name:"Mehfil",slots:["10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM"]},
        {id:2, name:"Shahghouse",slots:["10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","12:00 pM - 1:00 PM"]},
        {id:3, name:"Paradise",slots:["10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM","01:00 PM - 02:00 PM"]}]
    },
    Salon:{
        id:1,
        type:"Salon",
        Names:[
        {id:1, name:"Tony & Guy",slots:["10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM"]},
        {id:2, name:"Javed Habib",slots:["09:00 AM - 10:00 AM","10:00 AM - 11:00 AM","11:00 AM - 12:00 pm","04:30 PM - 05:30 PM"]},
        {id:3, name:"Trust",slots:["08:00 AM - 09:00 AM","10:00 AM - 11:00 AM","11:00 AM - 12:00 pm","05:30 PM - 06:30 PM"]}]
    }
}
const SimpleAlert = () =>{
    return (
      <Alert severity="success">
        The selected slot has been successfully booked
      </Alert>
    );
  }
  const NoSlotsAvailable = () => {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Typography 
          variant="h6" 
          color="error"
        >
          No slots available
        </Typography>
      </Box>
    );
  }

const Booking = () => {
    const navigate = useNavigate();
    const [submitVal,setSubmitVal] =useState(false);
    const [type,setType] =useState('');
    const [name,setName] =useState('');
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const types=["Hospital","Restaurant","Saloon"];
    const [nameArr,setNameArr] =useState([]);
    const [timeslotArr,setTimeSlotArr] = useState([]);
    const [selectedSlot,setSelectedSlot] = useState('');
    const [redirect,setRedirect] =useState(false);
    const [error,setError]=useState('');
    const [resturantData,setResturantData] =useState([]);
    const [hospitalData,setHospitalData] =useState([]);
    const [saloonData,setSaloonData] =useState([]);
    const [finalTime,setFinalTime]=useState([]);
    const paperStyle={
    padding:20,height:"auto",margin:"auto auto",textAlign:"left",background:'#eef7ff'
};
const { initateCustomerdata, initateBusinessdata,businessData,customerData } = useAppContext();
console.log("customerData:",customerData)
console.log("sessions:",sessions)

useEffect(() => {
    // Fetch data from the server when component mounts
    const fetchSessions = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/sessions/');
          setSessions(response.data);
          const tempData=response.data  // Set the fetched data to state   
          if(tempData){
            const restaurants =tempData.filter(session => session.business.business_type === 'Restaurant' && session?.session_status === 'isAvailable');
            setResturantData(restaurants)
            const hospitals = tempData.filter(session => session.business.business_type === 'Hospital' && session?.session_status === 'isAvailable');
            setHospitalData(hospitals)
            const saloons = tempData.filter(session => session.business.business_type === 'Saloon' && session?.session_status === 'isAvailable');
            setSaloonData(saloons)
          }
        } catch (err) {
          setError(err);               // Handle any errors
        }
      };
  
      fetchSessions();  // Call the asynchronous function
  }, []);  
  useEffect(() =>{
    if(type === 'Restaurant'){
        const names = resturantData?.map((x) => x.business.business_name)
        console.log("names:",names)
        const uniqueBusinesses = [...new Set(names)];
        setNameArr(uniqueBusinesses)
    }else if(type === 'Hospital'){
        const names = hospitalData?.map((x) => x.business.business_name)
        console.log("names:",names)
        const uniqueBusinesses = [...new Set(names)];
        setNameArr(uniqueBusinesses)
    }else if(type === 'Saloon'){
        const names = saloonData?.map((x) => x.business.business_name)
        console.log("names:",names)
        const uniqueBusinesses = [...new Set(names)];
        setNameArr(uniqueBusinesses)
    }
  },[type])
  console.log("nameArr:",nameArr)

useEffect(() =>{
    if (submitVal) {
        const timeoutId = setTimeout(() => {
          setRedirect(true);
        }, 2000); // 2 seconds
  
        return () => clearTimeout(timeoutId);
    }
},[submitVal])
function extractNamesByType(type) {
    if (data[type] && data[type].Names) {
        return data[type].Names.map(item => ({
            id: item.id,
            name: item.name,
            slots:item?.slots
        }));
    } else {
        console.log(`No data found for type: ${type}`);
        return [];
    }
}
    console.log("selectedSlot:",selectedSlot,"type:",type,"name:",name)
    // useEffect(() =>{
    //     if(type){
    //         //console.log("type:",type);
    //         if(data.hasOwnProperty(type)){
    //             const Names = extractNamesByType(type);
    //             setNameArr(Names)
    //         }
    //     }
    // },[type])
    function getSlotsByName(nameArr,name) {
        const nameList = nameArr.find(x => x.name === name);
        if (nameList) {
            return nameList.slots;
        } else {
            console.log(`"${name}" not found.`);
            return [];
        }
    }
    console.log("resturantData:",resturantData)
    console.log("filteredTimeSlots:",timeslotArr)
    useEffect(() =>{
        if(name && type === 'Restaurant'){
           //const filterTimeSlots = resturantData?.
           const filteredTimeSlots = resturantData.filter(session => session.business.business_name === name)
                            .map(session => 
                            {
                                const data = {
                                    session_uid:session.session_uid,
                                    session_date:session.session_date,
                                    timeslot:session.timeslot,
                                    timeSlotDisplay: `${session.session_date} - ${session.timeslot}`
                                }
                                return data
                            });
            setTimeSlotArr(filteredTimeSlots);
        }else if(name && type === 'Hospital'){
            //const filterTimeSlots = resturantData?.
           const filteredTimeSlots = hospitalData.filter(session => session.business.business_name === name)
           .map(session => {
            const data = {
                session_uid:session.session_uid,
                session_date:session.session_date,
                timeslot:session.timeslot,
                timeSlotDisplay: `${session.session_date} - ${session.timeslot}`
            }
            return data
        });
           setTimeSlotArr(filteredTimeSlots);
        }else if(name && type === 'Saloon'){
//const filterTimeSlots = resturantData?.
           const filteredTimeSlots = saloonData.filter(session => session.business.business_name === name)
                            .map(session => {
                                const data = {
                                    session_uid:session.session_uid,
                                    session_date:session.session_date,
                                    timeslot:session.timeslot,
                                    timeSlotDisplay: `${session.session_date} - ${session.timeslot}`
                                }
                                return data
                            });
            setTimeSlotArr(filteredTimeSlots);
        }
    },[name])

const handleChange = (event) => {
    setType(event.target.value);
};
const handleChangeSlot =(time) =>{
    setSelectedSlot(time);
    const getFinaltimeslotArr = timeslotArr?.filter((tes) => tes?.timeSlotDisplay === time);
    if(getFinaltimeslotArr?.length ===1){
        setFinalTime(getFinaltimeslotArr[0])
    }
}
const convertDateFormat = (dateString) => {
    // Split the date string into its components
    const [year, month, day] = dateString.split('-');
    
    // Rearrange and format the date to DD-MM-YYYY
    return `${day}-${month}-${year}`;
};
const submitData = async() =>{
    const val =finalTime;
    const url =  `http://127.0.0.1:8000/sessions/update/with-customer/${finalTime.session_uid}/`
    const payload={
        "session_uid" :finalTime.session_uid,
        "session_date": finalTime.session_date,
        "timeslot": finalTime.timeslot,
        "session_status": "isBooked",
        "customer_email": customerData?.customer_mail || ''
    }
    console.log("payload:",payload)
        try {
            const response = await axios.put(url, payload);
            if(response.data?.customer?.customer_id){
                setSubmitVal(true);
            }
            console.log('Response:', response.data);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error Response:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error Request:', error.request);
            } else {
                // Something else caused the error
                console.error('Error Message:', error.message);
            }
        }
    
}
console.log("timeslotArr:",timeslotArr,"name:",name)
  return (
    <div>
        <Grid className='booking'>
        <Typography variant="caption" gutterBottom style={{float:"right",margin:"1rem"}}>
              Username:{customerData?.customer_name}
            </Typography>
        <Paper elevation={10} style={paperStyle}>
            <Container maxWidth="md">
            <div class="logo"></div>
            <Button variant="outlined" type='submit' color='primary' onClick={() =>navigate('/dashboard')}>Go To Dashboard</Button>
            <h1 className='booking'>Book A Slot</h1>
            <h3 className='booking'>Follow the below instructions for booking a session with respective slot</h3>
            <ol className='booking'>
                <li>
                    Select the type of booking you are looking for.
                </li>
                <li>Select the availble place.</li>
                <li>Select the availble time slots.</li>
            </ol>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select the type of area of booking</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Select the type of area of booking"
                    onChange={handleChange}
                >
                    {types?.map((val) =>  <MenuItem value={val}>{val}</MenuItem>)}
                </Select>
            </FormControl>
            <MarginSpacerL />
            {nameArr?.length > 0 ?  
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select the name of booking</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={name}
                    label="Select the type of area of booking"
                    onChange={(e) => setName(e.target.value)}
                >
                    {nameArr?.map((val) => {
                        return (
                            <MenuItem value={val}>{val}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl> : type && nameArr?.length ===  0 ? <NoSlotsAvailable /> : <></>}
            {/* <MarginSpacerL />
            {name && slotArr?.length >0 && 
            <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date('2023-01-01')}
            maxDate={new Date('2024-12-31')}
            isClearable
            placeholderText="Click to select a date"
            />} */}
            <MarginSpacerL />
            {
                name && timeslotArr?.length >0 && nameArr?.length > 0 &&
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select the date & time slot</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedSlot}
                    label="Select the time slot"
                    onChange={(e) => handleChangeSlot(e.target.value)}
                >
                    {timeslotArr?.map((val) => {
                        return (
                            <MenuItem value={val?.timeSlotDisplay}>{val?.timeSlotDisplay}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl> 
            }
            <MarginSpacerL />
            <Button variant="contained" type='submit' color='primary' onClick={() => submitData()}>Submit</Button>
            {submitVal &&<SimpleAlert />}
            <MarginSpacerL />
            </Container>
        </Paper>
       </Grid>
       {redirect && (
                <Navigate to="/dashboard" replace={true} />
            )}
    </div>
  )
}

export default Booking