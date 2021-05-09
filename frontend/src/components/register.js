import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { InputAdornment, IconButton, MenuItem } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from 'axios';
import conf from '../config';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    marginLeft: "9px",
    // paddingLeft: "100px"
  }
}));

const register_options = [
  {
    key: 'recruiter',
    value: 'Recruiter'
  },
  {
    key: 'applicant',
    value: 'Applicant'
  }
]

export default function Register() {
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [isError, setIsError] = useState(true);
  const [errors, setErrors] = useState({});
  const [registerOption, setRegisterOption] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);

  console.log("on render", errors);


  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    const newFormData = Object.assign({}, formData);
    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  }

  const handleSubmit = (e) =>  {
    e.preventDefault();
    console.log("here", formData);
    console.log(registerOption);
    if (registerOption === null)
    {
      setIsError(true);
      setErrors((prev) => ({...prev, register_option: "You must choose a registration choice"}));
      console.log(errors);
      return;
    }
    const choice = (registerOption === "Recruiter") ? "recruiter" : "applicant";
    axios({
        method: "POST",
        url: `${conf.SERVER_URL}register/${choice}`,
        data: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        alert("Welcome! We have you successfully registered.");
        window.location.replace("http://localhost:3000/login");
    }).catch(error => {
        if (error) {
            console.log(error.response);
            setIsError(true);
            setErrors(error.response.data)
        }
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockTwoToneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            {
              isError && errors.name && 
              <p style={{color: "red", marginLeft: "10px"}}>{errors.name}</p>
            }
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
              />
            </Grid>
            {
              isError && errors.email && 
              <p style={{color: "red", marginLeft: "10px"}}>{errors.email}</p>
            }
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"} 
                InputProps={{ // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {
              isError && errors.password && 
              <p style={{color: "red", marginLeft: "10px"}}>{errors.password}</p>
            }
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password2"
                id="password2"
                autoComplete="current-password2"
                onChange={handleChange}
                type={showPassword2 ? "text" : "password"} 
                InputProps={{ // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword2}
                      >
                        {showPassword2 ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {
              isError && errors.password2 && 
              <p style={{color: "red", marginLeft: "10px"}}>{errors.pasisError && errors.password2}</p>
            }
            <Grid item xs={12}>
              <TextField
                id="select-register-option"
                select
                required
                fullWidth
                label="Select"
                value={registerOption}
                onChange={(e) => setRegisterOption(e.target.value)}
                helperText="Please select your registration choice"
                variant="outlined"
              >
                {register_options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {
              isError && errors.register_option && 
              <p style={{color: "red", marginLeft: "10px"}}>{errors.register_option}</p>
            }
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <Button variant="contained">Default</Button> */}
    </Container>
  );
}