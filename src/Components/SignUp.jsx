import React, { useEffect, useState } from 'react';
import { Grid,Paper,Avatar, TextField ,Button, List,ListItemText,ListItem,InputLabel,Select,MenuItem,FormControl,FormHelperText} from '@material-ui/core';
import { BookmarksOutlined } from '@material-ui/icons';   
import Alert from '@mui/material/Alert';
import { Navigate } from "react-router-dom";
import './App.css';
import axios from 'axios';
import { generateRandom4DigitNumber } from './utils';

const MarginSpacerL = () =>{
    return (
        <div style={{margin:"16px"}}></div>
    )
}
const MarginSpacerS = () =>{
    return (
        <div style={{margin:"4px"}}></div>
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
  const FailureAlert = () =>{
    return (
      <Alert severity="error">
        Account Creation failed. Please try again.
      </Alert>
    );
  }
const SignUp = () =>{
    const paperStyleCustomer={padding:20,height:'60vh',width:300,margin:"auto auto"};
    const paperStyleBusiness={padding:20,height:'80vh',width:300,margin:"auto auto",};
    const [email,setEmail]=useState('');
    const [username,setUserName] =useState('');
    const [password,setPassword]=useState('');
    const [businessName,setBusinessName]=useState('');
    const [submitVal,setSubmitVal] =useState(false);
    const [redirect,setRedirect] =useState(false);
    const [accountCreated,setAccountCreated] =useState(false);
    const [type,setType] =useState('');
    const [isBusiness,setIsBusiness]=useState(false);
    const [emailError,setEmailError] =useState(false);
    const [helperText, setHelperText] =useState('');
    const [passwordError,setPasswordError]=useState(false);
    const [helperPasswordText,setHelperPasswordText]=useState('');
    const [userNameerror,setUserNameerror]=useState(false);
    const [helperUserText,setHelperUserText]=useState('');
    const [errorSelect,setErrorSelect] =useState(false);
    const [businessNameError,setBusinessNameError]=useState(false);
    const [helperBusinessText,setHelperBusinessText]=useState('');
    const [alertSucess,setAlertSucess] =useState(false);
    const [alertFailed,setAlertFailed] =useState(false);
    // Email Validation Regex (basic pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() =>{
        if(accountCreated){
            const timeoutId = setTimeout(() => {
                setRedirect(true);
              }, 2000); // 2 seconds
        
              return () => clearTimeout(timeoutId);
        }
    },[accountCreated])
    useEffect(() =>{
        if (submitVal) {
            const registerUser = async () => {
                const newNumber = generateRandom4DigitNumber();
                // Define the payload
                let payload='';
                if(!isBusiness){
                    //  payload = {
                    //     username,
                    //     password,
                    //     email
                    //   };
                      payload= {
                        "customer_id": newNumber,
                        "customer_name": username,
                        "customer_mail": email,
                        "password": password
                      }
                }else{
                    //  payload = {
                    //     username,
                    //     password,
                    //     email,
                    //     businessName,
                    //     type
                    //   };
                      payload = {
                        "business_id": newNumber,
                        "business_name": businessName,
                        "business_type": type,
                        "business_mail": email,
                        "password": password
                      }
                }
               
                try {
                  // Make the POST request
                  const response = !isBusiness ? await axios.post('http://127.0.0.1:8000/customer/signup/', payload) :  await axios.post('http://127.0.0.1:8000/business/signup/', payload);
                  
                  // Handle the response    
                
                if(response.data?.message === "Customer created successfully!" || response.data?.message === "Business created successfully!"){
                    setAlertSucess(true);
                    setAccountCreated(true);
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
    },[submitVal])

    const validateUserName = () =>{
        if(username==='' || username?.length === 0){
            setUserNameerror(true);
            setHelperUserText('User Name cannot be empty.');
            return false;
        }else{
            setUserNameerror(false);
            setHelperUserText('');
            return true
        }
    }
    const validateEmail = () =>{
        if (emailRegex.test(email)) {
            setEmailError(false);
            setHelperText(''); // Clear error if email is valid
            return true
        } else {
            setEmailError(true);
            setHelperText('Please enter a valid email address.');
            return false;
        }
    }

    const validatePassword = () =>{
        if(password?.length <8){
            setPasswordError(true);
            setHelperPasswordText('Please enter password of minimum 8 characters.');
            return false;
        }else{
            setPasswordError(false);
            setHelperPasswordText('');
            return true;
        }
    }
    const validateBusinessName= ()=>{
        if(businessName==='' || businessName?.length === 0){
            setBusinessNameError(true);
            setHelperBusinessText('Business Name cannot be empty.');
            return false;
        }else{
            setBusinessNameError(false);
            setHelperBusinessText('');
            return true
        }
    }
    const validateType = ()=>{
        if(type === '' || type?.length === 0){
            setErrorSelect(true)
            return false
        }else{
            setErrorSelect(false)
            return true
        }
    }
    const submitData = () =>{
        if(!isBusiness){
            const userNameCheck = validateUserName();
            const emailCheck = validateEmail();
            const passwordCheck = validatePassword();
            if(userNameCheck && emailCheck && passwordCheck){
                setSubmitVal(true);
            }
        }else{
            const userNameCheck = validateUserName();
            const emailCheck = validateEmail();
            const passwordCheck = validatePassword();
            const businessNameCheck=validateBusinessName();
            const type=validateType();
            if(userNameCheck && emailCheck && passwordCheck && businessNameCheck && type){
                setSubmitVal(true);
            }
        }
    }

    const handleChange = (e) =>{
        setType(e.target.value)
    }
    const resetFormData = () =>{
        setEmail('');
        setUserName('');
        setPassword('');
        setBusinessName('');
        setType('');
    }
    const businessClick = () =>{
        setIsBusiness(true);
        resetFormData();
    }
    const customerClick = () =>{
        setIsBusiness(false);
        resetFormData();
    }
    return (
    <>
       <Grid>
        <Paper elevation={10} style={!isBusiness ? paperStyleCustomer : paperStyleBusiness}>
            <Grid align="center">
                <Avatar><BookmarksOutlined fontSize="large" color="primary"/></Avatar>
                <h2>BookASlot</h2>
            </Grid>
            <Grid align="center">
                <TextField 
                error={userNameerror}
                id="outlined-error-helper-text"
                helperText={helperUserText}
                label="User Name" placeholder='Enter username' type='username' fullWidth required  onChange={(event) => setUserName(event.target.value)} value={username}/>
                <MarginSpacerM />
                <TextField label="Email" placeholder='Enter email' type='email' fullWidth required  
                error={emailError}
                id="outlined-error-helper-text"
                helperText={helperText}
                onChange={(event) => setEmail(event.target.value)} value={email}/>
                <MarginSpacerM />
                <TextField 
                error={passwordError}
                id="outlined-error-helper-text"
                helperText={helperPasswordText}
                label="Password" placeholder='Password should be min 8 characters' type='password' fullWidth required onChange={(event) => setPassword(event.target.value)} value={password}/>
                {!isBusiness && 
                <>
                <MarginSpacerM />
                <Button variant="outlined" type='submit' color='primary' size="small" onClick={() => businessClick()}>Signup as Business</Button>
                </>}

                <MarginSpacerM />
                {isBusiness && 
                <>
                <TextField error={businessNameError}
                id="outlined-error-helper-text"
                helperText={helperBusinessText}
                label="Business Name" placeholder='Enter Business Name' type='text' fullWidth required onChange={(event) => setBusinessName(event.target.value)} value={businessName}/>
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
                        <MenuItem value={"Restaurant"}>Restaurant</MenuItem>
                        <MenuItem value={"Hospital"}>Hospital</MenuItem>
                        <MenuItem value={"Saloon"}>Saloon</MenuItem>
                    </Select>
                    {errorSelect && <FormHelperText error>Please select an option.</FormHelperText>}
                 </FormControl>
                </>}
            </Grid>
            <MarginSpacerS />
            {isBusiness && <Button variant="outlined" type='submit' color='primary' size="small" onClick={() => customerClick()}>Signup as Customer</Button>}
            <MarginSpacerL />
            <Button variant="contained" type='submit' color='primary' fullWidth onClick={() => submitData()}>SignUp</Button>
            <MarginSpacerL />
            {alertSucess &&<SimpleAlert />}
            {alertFailed && <FailureAlert />}
            {redirect && (
                <Navigate to="/login" replace={true} />
            )}
        </Paper>
       </Grid>
    </>
    )
}

export default SignUp;