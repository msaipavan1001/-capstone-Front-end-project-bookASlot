import React, { useEffect, useState } from 'react';
import { Grid,Paper,Avatar, TextField ,Button, List,ListItemText,ListItem,FormHelperText} from '@material-ui/core';
import { BookmarksOutlined } from '@material-ui/icons';   
import Alert from '@mui/material/Alert';
import { Navigate } from "react-router-dom";
import './App.css';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Checkbox, FormControlLabel, Box } from '@mui/material';

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
        Login successful
    </Alert>
    );
}
const Login = () =>{
    const paperStyle={padding:20,height:'60vh',width:280,margin:"auto auto"};
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [submitVal,setSubmitVal] =useState(false);
    const [errorSelect,setErrorSelect]=useState(false);
    const [redirect,setRedirect] =useState(false);
    const [loginValidated,setLoginValidated] =useState(false);
    const [emailError,setEmailError] =useState(false);
    const [helperText, setHelperText] =useState('');
    const [alertFailed, setAlertFailed] =useState(false);
    const [alertSucess,setAlertSucess] =useState(false);
    const [isChecked,setIsChecked]=useState(false);
    // Email Validation Regex (basic pattern)
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { initateCustomerdata, initateBusinessdata,businessData,customerData } = useAppContext(); // Use the context

    console.log("customerData:",customerData,"businessData:",businessData)

    const validateEmail = () =>{
        if (emailRegex.test(email)) {
            setEmailError(false);
            setHelperText('');
            return true
        } else {
            setEmailError(true);
            setHelperText('Please enter a valid email address.');
            return false;
        }
    }

    useEffect(() =>{
        if (loginValidated) {
            const timeoutId = setTimeout(() => {
              setRedirect(true);
            }, 2000); // 2 seconds
      
            return () => clearTimeout(timeoutId);
        }
    },[loginValidated])

    useEffect(() =>{
        if (submitVal) {
            const registerUser = async () => {
                // Define the payload
                let payload = isChecked ? {
                    "business_mail": email,
                    "password": password
                  } : 
                  {
                    "customer_mail": email,
                    "password": password
                  };
                try {
                  // Make the POST request
                  const response = isChecked ? await axios.post('http://54.211.16.123:8000/business/login/', payload) : await axios.post('http://54.211.16.123:8000/customer/login/', payload);
                  
                  // Handle the response
                  if(response?.data?.customer_id){
                    setAlertSucess(true);
                    setLoginValidated(true);
                    initateCustomerdata(response?.data);
                    navigate('/booking');
                    console.log('User Logged In successfully:', response.data);
                  }else if(response?.data?.business_id){
                    setAlertSucess(true);
                    setLoginValidated(true);
                    initateBusinessdata(response?.data);
                    navigate('/adminDashBoard');
                    console.log('Business user Logged In successfully:', response.data);
                  }else{
                    setAlertFailed(true);
                  }
                } catch (error) {
                  // Handle errors
                  setAlertFailed(true);
                  console.error('Error registering user:', error.response ? error.response.data : error.message);
                }
              };
          
              // Call the registerUser function
              registerUser();
        }
    },[submitVal]);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        console.log(`Checkbox is now ${event.target.checked ? 'checked' : 'unchecked'}`);
      };

    const handleNavigateTosignUp = () => {
        navigate('/signup'); // Navigate to the Dashboard page
      };

    const validatePassword = () =>{
        if(password?.length <8){
            setErrorSelect(true);
            return false;
        }else{
            setErrorSelect(false);
            return true;
        }
    }

    const submitData = () =>{
        //const emailCheck = validateEmail();
        const passwordCheck = validatePassword();
        if(passwordCheck){
            setSubmitVal(true);
        }
        // if(emailCheck && passwordCheck){
        //     setSubmitVal(true);
        // }

    }
    const FailureAlert = () =>{
        return (
          <Alert severity="error">
           Invalid Login Credentials.
          </Alert>
        );
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
            <TextField label="Email" 
                id="outlined-error-helper-text"
                helperText={helperText}
                error={emailError} placeholder='Enter email' fullWidth required  onChange={(event) => setEmail(event.target.value)} value={email}/>
                {/* <TextField label="Email" 
                id="outlined-error-helper-text"
                helperText={helperText}
                error={emailError} placeholder='Enter email' fullWidth required  onChange={(event) => setEmail(event.target.value)} value={email}/> */}
                <MarginSpacerM />
                <TextField error={errorSelect} id="outlined-error-helper-text" label="Password" placeholder='Enter password' type='password' fullWidth required onChange={(event) => setPassword(event.target.value)} value={password}/>
                <FormControlLabel
                    control={
                    <Checkbox 
                        checked={isChecked} 
                        onChange={handleCheckboxChange} 
                        color="primary" 
                    />
                    }
                    label="Is Business"
                />
            </Grid>
            {errorSelect && <FormHelperText error>Please enter valid login details.</FormHelperText>}
            <MarginSpacerL />
            <Typography variant="subtitle2" gutterBottom onClick={() => handleNavigateTosignUp()} style={{"cursor":"pointer"}}>
            Don't have a Account! Create Account !
            </Typography>
            <MarginSpacerL />
            <Button variant="contained" type='submit' color='primary' fullWidth onClick={() => submitData()}>Login</Button>
            <MarginSpacerL />
            {alertSucess &&<SimpleAlert />}
            {alertFailed && <FailureAlert />}
            {redirect && (
                <Navigate to="/booking" replace={true} />
            )}
        </Paper>
       </Grid>
    </>
    )
}

export default Login;