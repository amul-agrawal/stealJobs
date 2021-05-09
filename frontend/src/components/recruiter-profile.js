import React, {useState, useEffect} from 'react'
import axios from 'axios';
import conf from '../config';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, Typography, Card, CardHeader, Button, ButtonGroup} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import defaultUser from '../assets/images/defaultUser.png';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 50,
    marginRight: 50
  },
  heading: {
    paddingLeft: 10,
    fontSize: 30
  },
  profile_img: {
    width: "180px",
    height: "155px",
    marginLeft: "180px",
    marginTop: "30px"
  }
}));


const RecruiterProfile = () => {
  console.log("RecruiterProfile");
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${conf.SERVER_URL}recruiter/profile`,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      setFormData(response.data);
    }).catch(error => {
        if (error) {
            console.log(error.response.data);
            setIsError(true);
            setErrors(error.response.data.errors);
        }
    });
  }, [])

  const handleChange = (e) => {
    if (e.target.type == "file") {
      
      var reader = new FileReader();
      var file = e.target.files[0];

      reader.onload = function(upload) {
          let newformData = Object.assign({}, formData);
          newformData.image = upload.target.result;
          setFormData(newformData);
      }
      reader.readAsDataURL(file);
  }
    e.preventDefault();
    console.log(e.target.value);
    const newFormData = Object.assign({}, formData);
    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  }

  const handleSave = (e) => {
    e.preventDefault();
    let newFormData = Object.assign({}, formData);
    console.log(newFormData);
    axios({
      method: "PUT",
      url: `${conf.SERVER_URL}recruiter/profile`,
      data: JSON.stringify(newFormData),
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data)
      setFormData(response.data);
      setIsError(false);
      setErrors({});
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }).catch(error => {
        if (error) {
            console.log(error.response.data);
            setIsError(true);
            setErrors(error.response.data.errors)
        }
    });
  }

  return (
    <div>
    <Typography style={{textAlign: "center", fontSize: "60px"}}> Profile </Typography>
    <Card className={classes.root} variant="outlined">
      <Grid container spacing={5}>
        <Grid item xs={5}>
          {/* <img src={defaultUser} alt="Profile Picture" className={classes.profile_img}/> 
           */}
           <img src={formData['image'] || defaultUser} alt="Profile Picture" className={classes.profile_img}/> 
          <br></br>

          {/* <Rating num={formData['rating']} /> */}
          <input type="file" id="image"  onChange={handleChange} style={{marginLeft: "450px"}}></input>
          <br/> <br/>
          <TextField
            id="name"
            label="Name"
            style={{ margin: 8 }}
            placeholder="Bob"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{
              marginTop: 30,
              marginLeft: 10,
              width: "90%"
            }}
            onChange={handleChange}
            value={formData['name']}
          />
          {
            isError && errors.name && 
            <p style={{color: "red", marginLeft: "10px"}}>{errors.name}</p>
          }
          <TextField
            id="email"
            label="Email"
            style={{ margin: 8 }}
            placeholder="bob@gmail.com"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{
              marginTop: 15,
              marginLeft: 10,
              width: "90%"
            }}
            onChange={handleChange}
            value={formData['email']}
          />
          {
            isError && errors.email && 
            <p style={{color: "red", marginLeft: "10px"}}>{errors.email}</p>
          }
          <TextField
            id="phone"
            label="Phone"
            style={{ margin: 8 }}
            placeholder="9879965409"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{
              marginTop: 15,
              marginLeft: 10,
              width: "90%"
            }}
            onChange={handleChange}
            value={formData['phone']}
          />
          {
            isError && errors.phone && 
            <p style={{color: "red", marginLeft: "10px"}}>{errors.phone}</p>
          }
        </Grid>
        <Grid item xs={7}>
          <h3 style={{marginTop: "45px", marginLeft: "10px"}}>Bio</h3>
          <TextField
            id="bio"
            label="Bio"
            style={{ margin: 8 }}
            placeholder="Write Something about yourself here"
            fullWidth
            margin="normal"
            multiline
            rows={18}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{
              marginTop: 15,
              marginLeft: 10,
              width: "90%"
            }}
            onChange={handleChange}
            value={formData['bio']}
          />
          {
            isError && errors.bio && 
            <p style={{color: "red", marginLeft: "10px"}}>{errors.bio}</p>
          }
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color=""
        size="large"
        style = {{
          marginTop: "50px",
          marginBottom: "20px",
          marginLeft: "700px"
        }}
        startIcon={<SaveIcon />}
        onClick={handleSave}
      >
        Save
      </Button>
      {
        isSuccess && 
        <Alert severity="success" style={{textAlign: "center", fontSize: "20px"}}>Successfully Updated</Alert>
      }
    </Card>
    </div>
  )
}

export default RecruiterProfile;
