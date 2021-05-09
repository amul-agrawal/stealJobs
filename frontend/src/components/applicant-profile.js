import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Typography, Card, Button} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import defaultUser from '../assets/images/defaultUser.png';
import TextField from '@material-ui/core/TextField';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import {List, ListItem, ListItemSecondaryAction, IconButton, ListItemText, ListItemAvatar, Avatar} from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import Alert from '@material-ui/lab/Alert';

import conf from '../config';

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
    marginTop: "30px",
    borderRadius: "50%"
  }
}));

const Rating = ({num}) => {
  let rows = [];
  for(let i=0; i<num;i++) {
    if(i===0) {
      rows.push(<StarIcon style={{marginLeft: "200px"}}/>)
    } else {
      rows.push(<StarIcon/>)
    }
  }
  for(let i=5;i>num;i--) {
    if(i===5 && num === 0) {
      rows.push(<StarOutlineIcon style={{marginLeft: "200px"}}/>)
    } else {
      rows.push(<StarOutlineIcon/>)
    }
  }
  console.log(rows);
  return (
    <>
    {rows}
    </>
  )
}

const Education = ({institute, setInstitute, isError, errors}) => {

  const [isSelected, setIsSelected] = useState(false);
  const [instituteId, setInstituteId] = useState(-1);
  const [newInstitute, setNewInstitute] = useState({});

  const handleClick = (e) => {
    e.preventDefault();
    const Set = (currId) => {
      currId = parseInt(currId);
      if(isSelected && instituteId === currId) {
        setNewInstitute({});
        setIsSelected(false);
        setInstituteId(-1);
      } else {
        let hereNewInstitute = institute[currId];
        hereNewInstitute.name = ("name" in hereNewInstitute) ? hereNewInstitute.name : "";
        hereNewInstitute.start_year = ("start_year" in hereNewInstitute) ? hereNewInstitute.start_year.substring(0,4) : "";
        if(("end_year" in hereNewInstitute)) {
          try {
            hereNewInstitute.end_year = hereNewInstitute.end_year.substring(0,4);
          } catch {
            delete hereNewInstitute.end_year;
          }

        }
        setNewInstitute(hereNewInstitute);
        setIsSelected(true);
        setInstituteId(parseInt(currId));
      }
    }
    if(e.target.id && e.target.id >= 0)
      Set(e.target.id);
  }
  
  const handleChange = (e) => {
    let hereNewInstitute = Object.assign({}, newInstitute);
    hereNewInstitute[e.target.id] = e.target.value;
    setNewInstitute(hereNewInstitute);
  }
  
  const getYearString = (inst) => {
    if (inst.end_year && inst.start_year) return `started: ${inst.start_year.substring(0,4)}, ended: ${inst.end_year.substring(0,4)}`;
    else if (inst.start_year) return `started: ${inst.start_year.substring(0,4)}`;
    else if(inst.end_year) return `ended: ${inst.end_year.substring(0,4)}`;
    else return "";
  }
  const getColor = (id) => {
    if (isSelected && id === instituteId) return "secondary"
    else return ""
  }

    const removeInstitute = (e) => {
      e.preventDefault();
      let newInstitute = [...institute];
      newInstitute.splice(instituteId, 1);
      setInstitute(newInstitute);
      setNewInstitute({});
      setIsSelected(false);
      setInstituteId(-1);
    }
    const setDate = (date) => {
      if (date.length >=4 ) return date.substring(0,4);
      else {
        for(let i=date.length; i<=4;i++) date+="x";
        return date;
      }
    }
    const addInstitute = (e) => {
      e.preventDefault();
      let herenewInstitute = [...institute];
      let copyNewInstitute = newInstitute;
      if("end_year" in copyNewInstitute) copyNewInstitute.end_year = `${setDate(copyNewInstitute.end_year)}-12-31T18:30:00.000+00:00`
      if("start_year" in copyNewInstitute) copyNewInstitute.start_year = `${setDate(copyNewInstitute.start_year)}-12-31T18:30:00.000+00:00`
      herenewInstitute.push(copyNewInstitute);
      setNewInstitute({});
      setIsSelected(false);
      setInstituteId(-1);
      setInstitute(herenewInstitute);
    }

    const editInstitute = (e) => {
      e.preventDefault();
      let herenewInstitute = [...institute];
      let copyNewInstitute = newInstitute;
      if(("end_year" in copyNewInstitute)) copyNewInstitute.end_year = `${setDate(copyNewInstitute.end_year)}-12-31T18:30:00.000+00:00`
      if("start_year" in copyNewInstitute) copyNewInstitute.start_year = `${setDate(copyNewInstitute.start_year)}-12-31T18:30:00.000+00:00`
      Object.assign(herenewInstitute[instituteId], newInstitute)
      setNewInstitute({});
      setIsSelected(false);
      setInstituteId(-1);
      setInstitute(herenewInstitute);
    }


  const getNewInstitute = () => {
    const hereNewInstitute = {};
    hereNewInstitute.name = ("name" in newInstitute) ? newInstitute.name : "";
    hereNewInstitute.start_year = ("start_year" in newInstitute) ? newInstitute.start_year : "";
    hereNewInstitute.end_year = ("end_year" in newInstitute) ? newInstitute.end_year : "";
    return hereNewInstitute;
  }

  return (
    <>
      <Typography style={{
            marginTop: 50,
            marginLeft: 10,
            fontSize: 30
          }}>
            Education
      </Typography>
      <List>
      {
        institute && 
        institute.map((inst, id) => {
            return <> 
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <SchoolIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                          primary={inst['name']}
                          secondary={getYearString(inst)}
                      />
                      <ListItemSecondaryAction style={{
                          marginRight: 200
                      }}>
                      <IconButton edge="end" aria-label="delete" id={id} onClick={handleClick} color={getColor(id)}>
                        <EditIcon id={id} onClick={handleClick} />
                      </IconButton>
                </ListItemSecondaryAction>
                </ListItem>
                {
                  isError && errors && errors && errors[id] && 
                  Object.keys(errors[id]).map((key, id1) => {
                    return <p key={id1} style={{color: "red", marginLeft: "70px"}}>{errors[id][key]}</p>
                  }) 
                }
            </>
          })
      }
       <Typography style={{
            marginTop: 50,
            marginLeft: 10,
            fontSize: 30
          }}>
            Add Education Institute 
        </Typography>
        <TextField
          id="name"
          value={getNewInstitute().name}
          onChange={handleChange}
          required
          label="Name"
          style={{ margin: 8 }}
          placeholder="DPS RK PURAM"
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
        />
        <TextField
          id="start_year"
          value={getNewInstitute().start_year}
          onChange={handleChange}
          label="Start Year"
          style={{ margin: 8 }}
          placeholder="2000"
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          style={{
            marginLeft: 10,
            width: "30%"
          }}
        />
        <TextField
          id="end_year"
          value={getNewInstitute().end_year}
          onChange={handleChange}
          label="End Year"
          style={{ margin: 8 }}
          placeholder="2005 "
          margin="normal" 
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          style={{
            marginLeft: 10,
            width: "30%"
          }}
        />
        {
          isSelected ?
          <>
          <Fab color="primary" aria-label="add" size="medium" color="black" onClick={removeInstitute} style={{
            marginLeft: 20  ,
            marginTop: 15
          }}>
            <RemoveIcon />
          </Fab>
          <Fab color="primary" aria-label="add" size="medium" color="black"  onClick={editInstitute}  style={{
            marginLeft: 20  ,
            marginTop: 15
          }}>
            <EditIcon />
          </Fab>
          </>
          :
          <Fab color="primary" aria-label="add" size="medium" color="black" onClick={addInstitute} style={{
            marginLeft: 20  ,
            marginTop: 15
          }}>
            <AddIcon />
          </Fab>

        }
      </List>
    </>
  )


}

const Skill = ({skills, setSkills}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [skillId, setSkillId] = useState(-1);
  const [skillName, setSkillName] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    const Set = (currId) => {
      currId = parseInt(currId);
      if(isSelected && skillId === currId) {
        setSkillName("");
        setIsSelected(false);
        setSkillId(-1);
      } else {
        setSkillName(skills[currId]);
        setIsSelected(true);
        setSkillId(parseInt(currId));
      }
    }
    if(!e.target.id)
    {
      Set(e.target.parentNode.id);
    } else {
      Set(e.target.id);
    }
  }
  const getColor = (id) => {
    if (isSelected && id === skillId) return "secondary"
    else return ""
  }
  const removeSkill = (e) => {
    e.preventDefault();
    let newSkill = [...skills];
    newSkill.splice(skillId, 1);
    setSkills(newSkill);
    setSkillName("");
    setIsSelected(false);
    setSkillId(-1);
  }
  const addSkill = (e) => {
    e.preventDefault();
    let newSkill = [...skills];
    newSkill.push(skillName);
    setSkills(newSkill);
    setSkillName("");
    setIsSelected(false);
    setSkillId(-1);
  }
  return (
    <>
    {
      skills.map((skill, id) => {
        return <Button key={id} variant="contained" id={id} style={{
          marginLeft: 15,
          marginTop: 10,
        }}
        color={getColor(id)}
        onClick={handleClick}
        >
        {skill}
        </Button>
      })
    }
    <br /> <br />
    {
      isSelected ? 
        <Fab color="primary" aria-label="add" size="medium" color="black" onClick={removeSkill} style={{
          marginLeft: 20  , 
        }}>
        <RemoveIcon  />
        </Fab>
      :
        <>
        <TextField
          id="outlined-disabled"
          label="Skills Update"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          style = {{
            marginLeft: 10,
            width: "70%"
          }}
        />
        <Fab color="primary" aria-label="remove" size="medium" color="black" onClick={addSkill} style={{
          marginLeft: 15
        }}>
          <AddIcon />
        </Fab>
        </>
    }
    </>
  )
}

const ApplicantProfile = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [skills, setSkills] = useState([]);
  const [institute, setInstitute] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${conf.SERVER_URL}applicant/profile`,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      setFormData(response.data);
      setSkills(response.data.skills);
      setInstitute(response.data.institute);
    }).catch(error => {
        if (error) {
            console.log(error.response.data);
            setIsError(true);
            setErrors(error.response.data);
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
    let newFormData = Object.assign({}, formData);
    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  }

  const handleSave = (e) => {
    e.preventDefault();
    let newFormData = Object.assign({}, formData);
    newFormData.skills = skills;
    newFormData.institute = institute;
    console.log(newFormData);
    axios({
      method: "PUT",
      url: `${conf.SERVER_URL}applicant/profile`,
      data: newFormData,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data)
      setFormData(response.data);
      setSkills(response.data.skills);
      setInstitute(response.data.institute);
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

  console.log("Institute", institute);
  console.log("formData", formData);

  return (
    <div>
    <Typography style={{textAlign: "center", fontSize: "60px"}}> Profile </Typography>
    <Card className={classes.root} variant="outlined">
      <Grid container spacing={5}>
        <Grid item xs={5}>

          <img src={formData['image'] || defaultUser} alt="Profile Picture" className={classes.profile_img}/> 
          <br></br>

          <Rating num={formData['rating']} />
          <input type="file" id="image"  onChange={handleChange} style={{marginLeft: "50px"}}></input>

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

        <Typography style={{
            marginTop: 15,
            marginLeft: 20,
            fontSize: 30
          }}>
            Skills
        </Typography>
        
        <Skill skills={skills} setSkills={setSkills} />
        
        </Grid>
        <Grid item xs={7}>
          <Education institute={institute} setInstitute={setInstitute} isError={isError} errors={errors.education}/>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="black"
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

export default ApplicantProfile;
