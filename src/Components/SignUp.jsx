import React, { useEffect, useState } from 'react';
import { Grid,Paper,Avatar, TextField ,Button, List,ListItemText,ListItem,InputLabel,Select,MenuItem,FormControl} from '@material-ui/core';
import { BookmarksOutlined } from '@material-ui/icons';   
import Alert from '@mui/material/Alert';
import { Navigate } from "react-router-dom";
import './App.css';

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
const SimpleAlert = () =>{
    return (
      <Alert severity="success">
        Account has been created
      </Alert>
    );
  }
const SignUp = () =>{
    const paperStyle={padding:20,height:'60vh',width:280,margin:"auto auto"};
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [submitVal,setSubmitVal] =useState(false);
    const [redirect,setRedirect] =useState(false);
    const [type,setType] =useState('')

    useEffect(() =>{
        if (submitVal) {
            const timeoutId = setTimeout(() => {
              setRedirect(true);
            }, 2000); // 2 seconds
      
            return () => clearTimeout(timeoutId);
        }
    },[submitVal])

    const submitData = () =>{
        setSubmitVal(true);
    }

    const handleChange = (e) =>{
        setType(e.target.value)
    }
    return (
    <>
       <Grid>
        <Paper elevation={10} style={paperStyle}>
            <Grid align="center">
                <Avatar><BookmarksOutlined fontSize="large" color="primary"/></Avatar>
                <h2>BookASlot</h2>
            </Grid>
            <Grid align="center">
                <TextField label="Email" placeholder='Enter email' type='email' fullWidth required  onChange={(event) => setEmail(event.target.value)}/>
                <MarginSpacerM />
                <TextField label="Password" placeholder='Enter password' type='password' fullWidth required onChange={(event) => setPassword(event.target.value)}/>
                <MarginSpacerM />
                <TextField label="BussinesName" placeholder='Enter Bussiness Name' type='text' fullWidth required onChange={(event) => setPassword(event.target.value)}/>
                <MarginSpacerM />
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select the type of booking</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Select the type of area of booking"
                    onChange={(handleChange)}
                >
                    <MenuItem value={"Restuarant"}>Restuarant</MenuItem>
                    <MenuItem value={"Hospital"}>Hospital</MenuItem>
                    <MenuItem value={"Salon"}>Salon</MenuItem>
                </Select>
            </FormControl>
            </Grid>
            <MarginSpacerL />
            <Button variant="contained" type='submit' color='primary' fullWidth onClick={() => submitData()}>SignUp</Button>
            <MarginSpacerL />
            {submitVal &&<SimpleAlert />}
            {redirect && (
                <Navigate to="/adminDashboard" replace={true} />
            )}
        </Paper>
       </Grid>
    </>
    )
}

export default SignUp;