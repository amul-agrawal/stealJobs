import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography"
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import conf from '../config'
import Validator from 'validator'
import Alert from '@material-ui/lab/Alert';


import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const JobCard = (props) => {
  let data = props.data;

  const getColor = (status) => (status === "Full" ? "brown" : "red");
  const handleClick = () => {
    props.setHaveApplied(true);
    props.setApplicationId(props.id);
  }
  return (
    <Card style={{
      width: "300px",
      marginTop: "30px",
      marginLeft: "10px",
      backgroundColor: '#F0F0F0'
    }}
    variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h5">
          {data ? data.title  : ""}
        </Typography>
        <Typography  color="textSecondary">
         <b> Posted By:</b> {data? data.recruiter_name : ""}
        </Typography>
        <Typography  color="textSecondary">
          <b>Rating:</b> {data ? data.rating : ""} star
        </Typography>
        <Typography  color="textSecondary">
          <b>Salary:</b> {data ? data.salary : ""} Rupees 
        </Typography>
        <Typography  color="textSecondary">
          <b>Duration:</b> {data ? data.duration : ""} months
        </Typography>
        <Typography  color="textSecondary">
          <b>Deadline:</b> {data ? data.deadline.substring(0,10) : ""}
        </Typography>
      </CardContent>
        <CardActions>
          {
            data && data.status && data.status === "Apply" ?
                <Button size="small" style={{color: "green"}} onClick={handleClick}>Apply</Button>
                :
                <Button size="small" disabled style={{color: getColor(data.status)}}>{data.status}</Button>

          }
  </CardActions>
    </Card>
  )
}

const JobList = (props) => {

  const jobTypes = ["Part Time", "Full Time", "Work From Home"];
  const durations = ["1", "2", "3", "4", "5", "6"];

  const [salaryFilter, setSalaryFilter] = useState({"min": "", "max": ""});
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [jobDurationFilter, setJobDurationFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortDirection, setSortDirection] = useState(-1); // 0 inc , 1 dec

  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedFilteredJobs, setSavedFilteredJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);

  const [haveApplied, setHaveApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(-1);
  const [sop, setSop] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const sortJobs = (tempJobs) => {
    if(sortOption === "" || sortDirection === -1) return ;
    setJobs(tempJobs.sort((a,b) => (sortDirection === 1 ? (a[sortOption] < b[sortOption]? 1 : -1) : (a[sortOption] > b[sortOption]? 1 : -1))));
  }

  const setFilter = (tempJobs) => {
    if(!Validator.isEmpty(salaryFilter.min) && !Validator.isInt(salaryFilter.min)) 
    {
      setIsError(true);
      setErrors({salaryFilter: "Need a non negative number there"});
      return;
    }
    if(!Validator.isEmpty(salaryFilter.max) && !Validator.isInt(salaryFilter.max)) 
    {
      setIsError(true);
      setErrors({salaryFilter: "Need a non negative number there"});
      return;
    }
    let newJobs = [];
    tempJobs.forEach((job, id) => {
      let toPush = true;
      salaryFilter.min = salaryFilter.min.toString();
      salaryFilter.max = salaryFilter.max.toString();
      if (!Validator.isEmpty(salaryFilter.min) && parseInt(job.salary) < parseInt(salaryFilter.min)) 
        toPush = false;
      if (!Validator.isEmpty(salaryFilter.max) && parseInt(job.salary) > parseInt(salaryFilter.max))
        toPush = false;
      if (!Validator.isEmpty(jobTypeFilter) && job.type !== jobTypeFilter) 
        toPush = false;
      if (!Validator.isEmpty(jobDurationFilter) && job.duration > parseInt(jobDurationFilter))
        toPush = false; 

      if ( toPush ) newJobs.push(job);
    })
    setSavedFilteredJobs([...newJobs]);
    setJobs([...newJobs]);
    setIsError(false);
    setErrors({});
    if(isSort)
    sortJobs([...newJobs]);
  }

  const handleFilterApply = () => {
      setIsFilter(true);
      setFilter([...savedJobs]);
  }

  const handleFilterClear = (e) => {
    e.preventDefault();
    setJobTypeFilter("");
    setJobDurationFilter("");
    setSalaryFilter({"min": "", "max": ""});
    getData();
  }

  const handleSortApply = () => {
    setIsSort(true);
    sortJobs([...jobs]);
  }

  const handleSortClear = (e) => {
    e.preventDefault();
    setSortOption("");
    setSortDirection(-1);
    setIsSort(false);
    setJobs([...savedFilteredJobs]);
  }

  const getData = () => {
    const data = {
      search: searchValue
    };
    axios({
      method: "POST",
      url: `${conf.SERVER_URL}applicant/home`,
      data: data,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      setSavedJobs([...response.data]);
      if(!isFilter)
      setSavedFilteredJobs([...response.data]);
      if(!isFilter && !isSort)
      setJobs([...response.data]);
      if(isFilter) setFilter([...response.data]);
      else if(isSort) sortJobs([...response.data]);
    })
  }

  useEffect(getData, [])

  const handleSalaryFilterChange = (e) => {
    let newSalaryFilter = Object.assign({}, salaryFilter);
    e.target.value = e.target.value.toString();
    newSalaryFilter[e.target.id.substring(0,3)] = e.target.value;
    setSalaryFilter(newSalaryFilter);
  }

  const handleSortOption = (e) => {
    e.preventDefault();
    if(e.target.id) setSortOption(e.target.id);
    else if(e.target.parentNode.id) setSortOption(e.target.parentNode.id);
  }

  const getSortOptionColor = (str) => (str === sortOption) ? "secondary" : "";

  const handleJobApply = (e) => {
    const data = {
      sop: sop
    }
    axios({
      method: "POST",
      url: `${conf.SERVER_URL}applicant/jobs/${jobs[applicationId].id}`,
      data: data,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
        setApplicationSuccess(true);
    }).catch(error => {
        if (error) {
          console.log(error.response.data);
            setIsError(true);
            setErrors(error.response.data.errors);
        }
    });
  }

  const goBack = () => window.location.reload();

  return (
    <div>
      {
        haveApplied ? 
        <>
        <h1 style={{marginTop: "20px", marginLeft: "40px"}}>Apply to {jobs[applicationId].title}</h1>
        <TextField
            id="sop"
            label="SOP"
            placeholder="Why do you want to work here ? At max 250 words"
            fullWidth
            margin="normal"
            multiline
            rows={25}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{
              marginTop: 15,
              marginLeft: 40,
              width: "90%"
            }}
            onChange={(e) => setSop(e.target.value)}
            value={sop || ""}
            />
            {
              isError && errors.sop && 
              <Alert severity="error" style={{textAlign: "center", fontSize: "20px", marginTop: "10px",marginLeft: "40px", width: "750px"}}>{errors.sop} </Alert>

            }
            {
              applicationSuccess ? 
              <>
                <Alert severity="success" style={{textAlign: "center", fontSize: "20px", marginTop: "10px",marginLeft: "50px", width: "750px"}}>Successfully Posted</Alert>
              <br></br>
              <Button  variant="contained" onClick={goBack}  style={{
                marginLeft: 40,
                      marginTop: 10,
                    }}
                    color="primary"
                    >
                    Back
                </Button>
                  </>
                :
                <>
                <br></br>
                  <Button  variant="contained" onClick={handleJobApply}  style={{
                        marginLeft: 40,
                        marginTop: 10,
                      }}
                      color="primary"
                  >
                      Apply
                  </Button>
                  <Button  variant="contained" onClick={goBack}  style={{
                        marginLeft: 20,
                        marginTop: 10,
                      }}
                      color="primary"
                  >
                      Cancel
                  </Button>
                </>
            }
        </>
        :

      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={3} >
          <Card variant="outlined" style={{marginTop: "30px", marginLeft: "30px", marginRight: "40px"}}>
            <h3 style={{marginLeft: "20px", marginTop: "20px"}}>Filter</h3>
            <List component="nav" aria-label="mailbox folders">
              <h5 style={{marginLeft: "20px"}}>Salary</h5>
              <ListItem button>
                <form noValidate autoComplete="off">
                    <TextField id="min-salary" size="small" label="Enter Min" variant="outlined" value={salaryFilter.min} onChange={handleSalaryFilterChange} fullWidth={true} /> 
                    <TextField id="max-salary" size="small" label="Enter Max" variant="outlined" value={salaryFilter.max} onChange={handleSalaryFilterChange} style={{marginTop: "5px"}} fullWidth={true}/>
                    {
                      isError && errors.salaryFilter && 
                      <span style={{color: "red", marginLeft: "10px"}}>{errors.salaryFilter}</span>
                    }
                </form>                                                                
              </ListItem>
              <Divider /> 
              <h5 style={{marginLeft: "20px", marginTop: "10px"}}>Job Type</h5>
              <ListItem button divider>
                <Autocomplete
                    id="combo-box-demo"
                    options={jobTypes}
                    fullWidth={true}
                    getOptionLabel={(option) => option}
                    value={jobTypeFilter}
                    onInputChange={(event, newInputValue) => {
                      setJobTypeFilter(newInputValue);
                    }}
                    size="small"
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField size="small" {...params}  label="Select Job Type" variant="outlined" />}
                    />
              </ListItem> 
              <h5 style={{marginLeft: "20px", marginTop: "10px"}}>Duration</h5>
              <ListItem button >
                <Autocomplete
                    id="combo-box-demo"
                    options={durations}
                    fullWidth={true}
                    getOptionLabel={(option) => option}
                    value={jobDurationFilter}
                    onInputChange={(event, newInputValue) => {
                      setJobDurationFilter(newInputValue);
                    }}
                    size="small"
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField size="small" {...params} label="Not more than" variant="outlined" />}
                    />
              </ListItem>
              <Button  variant="contained" onClick={handleFilterApply}  style={{
                marginLeft: 20,
                marginTop: 10,
              }}
              color="primary"
              >
                Apply
              </Button>
              <Button  variant="contained" onClick={handleFilterClear}  style={{
                marginLeft: 20,
                marginTop: 10,
              }}
              color="primary"
              >
                Clear
              </Button>
              <br/>
            </List>
          </Card>
          <Card variant="outlined" style={{marginTop: "10px", marginLeft: "30px", marginRight: "40px", marginBotton: "20px"}} >
            <h3 style={{marginLeft: "20px", marginTop: "20px"}}>Sort</h3>
            <Button  variant="contained" size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("salary")}
            id="salary"
            onClick={handleSortOption}
            >
              Salary
            </Button>
            <Button  variant="contained" size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("duration")}
            id="duration"
            onClick={handleSortOption}
            >
              Duration
            </Button>
            <Button  variant="contained"  size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("rating")}
            id="rating"
            onClick={handleSortOption}
            >
              Rating
            </Button>
            <br/> <br/>
            <ListItem style={{marginBottom: "10px"}}>
          <Fab color={(0 === sortDirection) ? "secondary" : ""} aria-label="add" size="small" onClick={() => setSortDirection(0)}  >
            <ArrowUpwardIcon  onClick={() => setSortDirection(0)}/>
          </Fab>
          <Fab color={(1 === sortDirection) ? "secondary" : ""} aria-label="add" size="small" style={{
            marginLeft: 20  , 
          }} onClick={() => setSortDirection(1)}>
            <ArrowDownwardIcon onClick={() => setSortDirection(1)} />
          </Fab>
          <Button variant="contained" style={{
            marginLeft: 20
          }}
          color="primary"
          onClick={handleSortApply}
          >
            Apply
          </Button>
          <Button variant="contained" style={{
            marginLeft: 20
          }}
          color="primary"
          onClick={handleSortClear}
          >
          Clear
        </Button>
          </ListItem>
        </Card>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <List component="nav" aria-label="mailbox folders">
              <TextField 
              id="standard-basic" 
              label="Search" 
              fullWidth={true}  
              variant="outlined" 
              style={{
                width: "60%",
                marginLeft: "10px",
                marginTop: "30px"
              }}
              value={searchValue}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                          <IconButton onClick={getData}>
                              <SearchIcon />
                          </IconButton>
                      </InputAdornment>
                  )}}
                  onChange={(e) => setSearchValue(e.target.value)}
                  />
          </List>
          <Grid container spacing={3} >

          <Grid item xs={9} md={3} lg={3}>
            {
              jobs.map((job, id) => {
                if (id % 3 === 0) {
                  return <JobCard haveApplied={haveApplied}
                  setHaveApplied={setHaveApplied}
                  applicationId={applicationId} 
                  setApplicationId={setApplicationId}
                  id={id}
                  key={id} 
                  data={job} 
                  />
                }
              })
            }
          </Grid>
          <Grid item xs={9} md={3} lg={3}>
           {
             jobs.map((job, id) => {
               if (id % 3 === 1) {
                 return <JobCard haveApplied={haveApplied}
                 setHaveApplied={setHaveApplied}
                 applicationId={applicationId} 
                 setApplicationId={setApplicationId}
                 id={id}
                 key={id} 
                 data={job} 
                 />
                }
              })
            }
          </Grid>
          <Grid item xs={9} md={3} lg={3}>
           {
             jobs.map((job, id) => {
               if (id % 3 === 2) {
                 return <JobCard haveApplied={haveApplied}
                 setHaveApplied={setHaveApplied}
                 applicationId={applicationId} 
                 setApplicationId={setApplicationId}
                 id={id}
                 key={id} 
                 data={job} 
                 />
                }
              })
            }
          </Grid>
          
        </Grid>
      </Grid>
      </Grid>
    }
    </div>
  )
}



export default JobList;