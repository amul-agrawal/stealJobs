import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Typography from "@material-ui/core/Typography"
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import conf from '../config'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Alert from '@material-ui/lab/Alert';


const ApplicationCard = (props) => {
  let data = props.data;
  let jobs = props.jobs;
  let setJobs = props.setJobs;

  const handleClick = (e) => {
    const Change = (param) => {
        const data = {
          status: param
        }
        axios({
          method: "PUT",
          url: `${conf.SERVER_URL}recruiter/myjobs/application/${props.data.id}`,
          data: data,
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {
          if(response.data.status === "Rejected") {
            let newJobs = [...jobs];
            newJobs.splice(props.id, 1);
            setJobs(newJobs);
          } else {
            let newJobs = [...jobs];
            newJobs[props.id].status = response.data.status;
            setJobs(newJobs);
          }
        }).catch((error) => {
          props.setIsError(true);
          props.setErrors(error.response.data);
          setTimeout(() => {
            props.setIsError(false);
            props.setErrors({});

          }, 3000);
        })
      }
      if(e.target.id) Change(e.target.id);
      else if(e.target.parentNode.id) Change(e.target.parentNode.id);
    }
  const getSkills = (skills) => {
    let ret="";
    skills.forEach((skill, id) => {
      ret += " ";
      ret += skill.toString();
    })
    return ret;
  } 

  const getEducation = (education) => {
    let ret1 = [];
    education.forEach((edu, id) => {
      ret1.push(<br />)
      let ret = "";
      ret += (id+1).toString();
        ret += ". Name: ";
        ret += edu.name;
        if(edu.start_year) 
        {
          ret += ", started: "
          ret += edu.start_year.substring(0, 10);
        }
        if(edu.end_year) 
        {
          ret += ", ended: "
          ret += edu.end_year.substring(0, 10);
        }
        ret1.push(<span>{ret}</span>);
    })
    return ret1;
  }

  return (
    <Card style={{
      width: "600px",
      marginTop: "30px",
      marginLeft: "10px",
      backgroundColor: '#F0F0F0'
    }}
    variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h5">
          {data ? data.applicant_name  : ""}
        </Typography>
        <Typography  color="textSecondary">
          <b>Applied On</b>: {data ? data.date ? data.date.toString().substring(0,10) : "" : ""}
        </Typography>
        <Typography  color="textSecondary">
         <b>Skills</b> : {data ? data.skills ? getSkills(data.skills) : "" : ""} 
        </Typography>
        <Typography  color="textSecondary">
          <b>Education</b>: {data ? data.education ? getEducation(data.education) : "" : ""}
        </Typography>
        <Typography  color="textSecondary">
          <b>Applicant's Rating</b>: {data ?  data.applicant_rating : ""} stars
        </Typography>
        <Typography  color="textSecondary">
          <b>SOP</b>: {data ? data.sop ? data.sop : "" : ""} 
        </Typography>
      </CardContent>
        <CardActions>
          {
            data && data.status && data.status === "Selected" ?
                <Button size="small" disabled style={{color: "green"}}>Selected</Button>
            :
            <>
            { data.status === "Shortlisted" ?
            <>
                <Button size="small" id="Selected" style={{color: "blue"}} onClick={handleClick}>Accept</Button>
               <Button size="small"  id="Rejected" style={{color: "red"}} onClick={handleClick}>Reject</Button>
              </>
                :
            <>
                <Button size="small" id="Shortlisted" style={{color: "blue"}} onClick={handleClick}>Shortlist</Button>
               <Button size="small"  id="Rejected" style={{color: "red"}} onClick={handleClick}>Reject</Button>
            </>
          }
            </>
          }
  </CardActions>
    </Card>
  )
}

const MyJobApplications = (props) => {

  let jobId = props.id;

  const [sortOption, setSortOption] = useState("");
  const [sortDirection, setSortDirection] = useState(-1); // 0 inc , 1 dec
  const [isSort, setIsSort] = useState(false);
  
  const [jobs, setJobs] = useState([]);
  
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  
  const sortJobs = (tempJobs) => {
    if(sortOption === "" || sortDirection === -1) return ;
    setJobs(tempJobs.sort((a,b) => (sortDirection === 1 ? (a[sortOption] < b[sortOption] ? 1 : -1) : (a[sortOption] > b[sortOption] ? 1 : -1))));
  }

  const handleSortApply = () => {
    setIsSort(true);
    sortJobs(jobs);
  }

  const handleSortClear = (e) => {
    e.preventDefault();
    setSortOption("");
    setSortDirection(-1);
    setIsSort(false);
    getData();
  }

  const getData = () => {
    axios({
      method: "GET",
      url: `${conf.SERVER_URL}recruiter/myjobs/${jobId}`,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      setJobs(response.data);
      if(isSort) sortJobs(response.data);
    })
  }

  useEffect(getData, [])


  const handleSortOption = (e) => {
    e.preventDefault();
    if(e.target.id) setSortOption(e.target.id);
    else setSortOption(e.target.parentNode.id);
  }

  const getSortOptionColor = (str) => {
    return (str === sortOption) ? "secondary" : "";
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2} lg={2} >
          <Card variant="outlined" style={{marginTop: "10px", marginLeft: "30px", marginRight: "40px", marginBotton: "20px"}} >
            <h3 style={{marginLeft: "20px", marginTop: "20px"}}>Sort</h3>
            <Button  variant="contained" size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("applicant_name")}
            id="applicant_name"
            onClick={handleSortOption}
            >
              Applicant Name
            </Button>
            <br/>
            <Button  variant="contained" size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("date")}
            id="date"
            onClick={handleSortOption}
            >
              Date of Application
            </Button>
            <br/>
            <Button  variant="contained"  size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("rating")}
            id="rating"
            onClick={handleSortOption}
            >
              Rating of Applicant
            </Button>
            <br/> 
            <ListItem style={{marginBottom: "5px", marginTop: "5px"}}>
          <Fab color={(0 === sortDirection) ? "secondary" : ""} aria-label="add" size="small" onClick={() => setSortDirection(0)}  >
            <ArrowUpwardIcon  onClick={() => setSortDirection(0)}/>
          </Fab>
          <Fab color={(1 === sortDirection) ? "secondary" : ""} aria-label="add" size="small" style={{
            marginLeft: 20  , 
          }} onClick={() => setSortDirection(1)}>
            <ArrowDownwardIcon onClick={() => setSortDirection(1)} />
          </Fab>
          </ListItem>
          <ListItem >
          <Button variant="contained" style={{
            marginLeft: 5
          }}
          color="primary"
          onClick={handleSortApply}
          >
            Apply
          </Button>
          </ListItem>
          <ListItem>
          <Button variant="contained" style={{
            marginLeft: 5
          }}
          color="primary"
          onClick={handleSortClear}
          >
          Clear
        </Button>
          </ListItem>
        </Card>
        </Grid>
        <Grid item xs={12} md={10} lg={10}>
          {
            isError && errors.error && 
              <Alert severity="error" style={{textAlign: "center", fontSize: "20px", marginTop: "20px", marginBottom: "30px",marginLeft: "40px", width: "750px"}}>{errors.error}</Alert>
            
          }
          <Grid container spacing={3} >

          <Grid item xs={9} md={5} lg={5}>
            {
              jobs.map((job, id) => {
                if (id % 2 === 0) {
                  return <ApplicationCard 
                  id={id}
                  key={id} 
                  data={job} 
                  jobs={jobs}
                  isError={isError}
                  setIsError={setIsError}
                  setErrors={setErrors}
                  errors={errors}
                  setJobs={setJobs}
                  />
                }
              })
            }
          </Grid>
          <Grid item xs={9} md={5} lg={5}>
           {
             jobs.map((job, id) => {
               if (id % 2 === 1) {
                 return <ApplicationCard 
                 id={id}
                 key={id} 
                 data={job} 
                 jobs={jobs}
                 isError={isError}
                 setIsError={setIsError}
                 setErrors={setErrors}
                 errors={errors}
                  setJobs={setJobs}
                 />
                }
              })
            }
          </Grid>
          
        </Grid>
      </Grid>
      </Grid>
    </div>
  )
}



export default MyJobApplications;
