import React, { useEffect, useState } from 'react'
import { Grid,Paper,Container,Box,FormControl,InputLabel,Select,MenuItem} from '@material-ui/core';
import Avatar from '@mui/material/Avatar';
import './App.css';
import {Button} from '@material-ui/core';
import { Alert } from '@mui/material';
import { Navigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
        {id:3, name:"Paradise",slots:["10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM"]}]
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

const Booking = () => {
    const [submitVal,setSubmitVal] =useState(false);
    const [type,setType] =useState('');
    const [name,setName] =useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const types=["Hospital","Restaurant","Salon"];
    const [nameArr,setNameArr] =useState([]);
    const [slotArr,setSlotArr] = useState([]);
    const [selectedSlot,setSelectedSlot] = useState('');
    const [redirect,setRedirect] =useState(false);
    const paperStyle={
    padding:20,height:'85vh',margin:"auto auto",textAlign:"left"
};
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
    useEffect(() =>{
        if(type){
            //console.log("type:",type);
            if(data.hasOwnProperty(type)){
                const Names = extractNamesByType(type);
                setNameArr(Names)
            }
        }
    },[type])
    function getSlotsByName(nameArr,name) {
        const nameList = nameArr.find(x => x.name === name);
        if (nameList) {
            return nameList.slots;
        } else {
            console.log(`"${name}" not found.`);
            return [];
        }
    }
    useEffect(() =>{
        if(name){
            const slotsData= getSlotsByName(nameArr,name);
            setSlotArr(slotsData);
        }
    },[name])

const handleChange = (event) => {
    setType(event.target.value);
};
const handleChangeSlot =(event) =>{
    setSelectedSlot(event.target.value)
}
const submitData = () =>{
    setSubmitVal(true);
}
  return (
    <div>
        <Grid className='booking'>
        <Paper elevation={10} style={paperStyle}>
            <Container maxWidth="md">
            <div class="logo"></div>
            <h1 className='booking'>Book A Slot</h1>
            <h3 className='booking'>Follow the below instructions for booking a session with respective slot</h3>
            <ol className='booking'>
                <li>
                    Select the type of booking you are looking for.
                </li>
                <li>Select the availble place.</li>
                <li>Select the availble time slots.</li>
                <li>Book the slot.</li>
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
            {nameArr?.length > 0 && 
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
                            <MenuItem value={val.name}>{val?.name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>}
            <MarginSpacerL />
            {name && slotArr?.length >0 && 
            <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date('2023-01-01')}
            maxDate={new Date('2024-12-31')}
            isClearable
            placeholderText="Click to select a date"
            />}
            <MarginSpacerL />
            {
                name && slotArr?.length >0 && 
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select the time slot</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedSlot}
                    label="Select the time slot"
                    onChange={handleChangeSlot}
                >
                    {slotArr?.map((val) => {
                        return (
                            <MenuItem value={val}>{val}</MenuItem>
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