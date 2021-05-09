import React, {useState, useEffect} from 'react'
import axios from 'axios';
import conf from '../config';
import {Grid, Paper, Typography, Card, CardHeader, Button, ButtonGroup} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Skill = ({skills, setSkills, isError, errors}) => {
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
  const getMargin = (id) => (id===0) ? 45 : 15;
  return (
    <>
    {
      skills.map((skill, id) => {
        return <Button key={id} variant="contained" id={id} style={{
          marginLeft: getMargin(id),
          marginTop: 10,
        }}
        color={getColor(id)}
        onClick={handleClick}
        >
        {skill}
        </Button>
      })
    }
    {
      skills.length > 0 &&
        <> <br /> <br /> </>
    }
    {
      isSelected ? 
        <Fab color="" aria-label="add" size="medium" onClick={removeSkill} style={{
          marginLeft: 40  , 
        }}>
        <RemoveIcon  />
        </Fab>
      :
        <>
        <TextField
          id="outlined-disabled"
          label="Skills Required"
          placeholder="Enter Required skills for the Job"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          style = {{
            marginTop: 10,
            marginLeft: 40,
            width: "80%"
          }}
        />
        <Fab color="" aria-label="remove" size="medium" onClick={addSkill} style={{
          marginLeft: 15, marginTop: 10
        }}>
          <AddIcon />
        </Fab>
        </>
    }
    {
            isError && errors.skills_req && 
            <>
            <br/>
            <span style={{color: "red", marginLeft: "42px"}}>{errors.skills_req}</span>
            <br/>
            </>
          }
    </>
  )
}

const RecHome = () => {
  const jobTypes = ["Part Time", "Full Time", "Work From Home"];
  const durations = ["0", "1", "2", "3", "4", "5", "6"];
  const [formData, setFormData] =  useState({});
  const [skills, setSkills] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  console.log("formData", formData);
  console.log("skills", skills);
  console.log("isError", isError);
  console.log("errors: ", errors);

  const onSubmit = () => {
    let newFormData = Object.assign({}, formData);
    newFormData.skills_req = skills;
    console.log(newFormData);
    axios({
      method: "POST",
      url: `${conf.SERVER_URL}recruiter/createjob`,
      data: JSON.stringify(newFormData),
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      setFormData({});
      setSkills([]);
      setIsError(false);
      setErrors({});
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }).catch(error => {
        if (error) {
            console.log(error.response.data);
            setIsError(true);
            setErrors(error.response.data.errors);
        }
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    const newFormData = Object.assign({}, formData);
    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  }

  return (
    <div>
    <Typography style={{textAlign: "center", fontSize: "60px"}}> Create Job </Typography>
    <Card style={{marginRight: "500px", marginLeft: "500px"}} variant="outlined">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <TextField
            id="title"
            label="Title"
            style={{ margin: 8 }}
            placeholder="Job Title"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{
              marginTop: 30,
              marginLeft: 40,
              width: "90%"
            }}
            onChange={handleChange}
            required={true}
            value={formData['title'] || ""}
            />
          {
            isError && errors.title && 
            <>
            <br/>
            <span style={{color: "red", marginLeft: "42px"}}>{errors.title}</span>
            <br/>
            </>
          }

        <TextField
          id="max_applications"
          label="Max Applications"
          style={{ margin: 8 }}
          placeholder="Enter max applications"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          style={{
            marginTop: 15,
            marginLeft: 40,
            width: "90%"
          }}
          required={true}
          onChange={handleChange}
          value={formData['max_applications'] || ""}
        />
        
        {
            isError && errors.max_applications && 
          <>
          <br/>
          <span style={{color: "red", marginLeft: "42px"}}>{errors.max_applications}</span>
          <br/>
          </>
        }

        <TextField
          id="max_positions"
          label="Max Positions"
          style={{ margin: 8 }}
          placeholder="Enter max positions"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required={true}
          variant="outlined"
          style={{
            marginTop: 15,
            marginLeft: 40,
            width: "90%"
          }}
          onChange={handleChange}
          value={formData['max_positions'] || ""}
        />

        {
          isError && errors.max_positions && 
          <>
          <br/>
          <span style={{color: "red", marginLeft: "42px"}}>{errors.max_positions}</span>
          <br/>
          </>
        }

        <TextField
            id="deadline"
            label="Deadline"
            type="date"
            // defaultValue="9999-12-31"
            style={{
              marginTop: 10,
              marginLeft: 40,
              width: "90%"
            }}
            variant="outlined"
            required={true}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            value={formData['deadline'] || ""}

          />
          
          {
            isError && errors.deadline && 
            <>
            <br/>
            <span style={{color: "red", marginLeft: "42px"}}>{errors.deadline}</span>
            <br/>
            </>
          }
          <Autocomplete
            id="job_type"
            options={jobTypes}
            fullWidth={true}
            getOptionLabel={(option) => option}
            value={formData['job_type'] || ""}
            onInputChange={(event, newInputValue) => {
              let newFormData = Object.assign({}, formData);
              newFormData.job_type = newInputValue;
              setFormData(newFormData);
            }}
            style={{
              marginTop: 10,
              marginLeft: 40,
              width: "90%"
            }}
                renderInput={(params) => <TextField size="small" {...params}  label="Select Job Type" variant="outlined" />}
            />
            {
              isError && errors.job_type && 
              <>
              <br/>
              <span style={{color: "red", marginLeft: "42px"}}>{errors.job_type}</span>
              <br/>
              </>
            }

            <Autocomplete
              id="duration"
              options={durations}
              fullWidth={true}
              getOptionLabel={(option) => option}
              value={formData['duration'] || ""}
              onInputChange={(event, newInputValue) => {
                let newFormData = Object.assign({}, formData);
                newFormData.duration = newInputValue;
                setFormData(newFormData);
              }}
              style={{
                marginTop: 10,
                marginLeft: 40,
                width: "90%"
              }}
              renderInput={(params) => <TextField size="small" {...params}  label="Select Job Duration" variant="outlined" />}
            />
            {
              isError && errors.duration && 
              <>
              <br/>
              <span style={{color: "red", marginLeft: "42px"}}>{errors.duration}</span>
              <br/>
              </>
            }

            <TextField
              id="salary"
              label="Salary"
              style={{ margin: 8 }}
              placeholder="Enter Salary in Rupees"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required={true}
              variant="outlined"
              style={{
                marginTop: 15,
                marginLeft: 40,
                width: "90%"
              }}
              onChange={handleChange}
              value={formData['salary'] || ""}
            />
            {
              isError && errors.salary && 
              <>
              <br/>
              <span style={{color: "red", marginLeft: "42px"}}>{errors.salary}</span>
              <br/>
              </>
            }
            <br/>
            <Skill skills={skills} setSkills={setSkills} isError={isError} errors={errors}/>

        
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color=""
        size="large"
        style = {{
          marginTop: "30px",
          marginBottom: "20px",
          marginLeft: "300px"
        }}
        startIcon={<SaveIcon />}
        onClick={onSubmit}
      >
        Post
      </Button>
      {
        isSuccess && 
        <Alert severity="success" style={{textAlign: "center", fontSize: "20px", marginBottom: "30px",marginLeft: "50px", width: "750px"}}>Successfully Posted</Alert>
      }
    </Card>
    </div>
  )
}

export default RecHome;

// work left
// 1. backend for put Done
// 2. save submit
// 2. axios put from here
// 3. error validation