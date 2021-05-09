import React, {useState, useEffect} from 'react';
import axios from 'axios';
import conf from '../config';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import StarsIcon from '@material-ui/icons/Stars';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: "bold",
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const useStyles = makeStyles({
  table: {
    marginLeft: 40,
    width: 800,
    marginTop: 10,
  },
});

export default function MyEmployees() {
  let ratingOptions = ["0", "1", "2", "3", "4", "5"];
  const [rating, setRating] = useState("");

  const classes = useStyles();
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState(-1);
  const [rows, setRows] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [sortDirection, setSortDirection] = useState(-1); // 0 inc , 1 dec
  const [isSort, setIsSort] = useState(false);
  const [savedRows, setSavedRows] = useState([]);

  console.log("saved rows: ", savedRows);

  const sortRows = (tempJobs) => {
    console.log("in sortJobs", tempJobs, sortOption, sortDirection);
    if(sortOption === "" || sortDirection === -1) return ;
    setRows(tempJobs.sort((a,b) => (sortDirection === 1 ? (a[sortOption] < b[sortOption]? 1 : -1) : (a[sortOption] > b[sortOption]? 1 : -1))));
  }

  const getData = () => {
    axios({
      method: "GET",
      url: `${conf.SERVER_URL}recruiter/myemployees/`,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("GetData", response.data);
      let newData = [...response.data];
      setRows(response.data);
      setSavedRows([...response.data]);
      if(isSort) sortRows(newData);
    })
  };

  useEffect(getData, []);

  const handleSortApply = () => {
    setIsSort(true);
    sortRows([...rows]);
  }

  const handleSortClear = (e) => {
    e.preventDefault();
    setSortOption("");
    setSortDirection(-1);
    setIsSort(false);
    setRows([...savedRows]);
  }

  const handleSortOption = (e) => {
    // console.log(e.target);
    e.preventDefault();
    if(e.target.id) setSortOption(e.target.id);
    else setSortOption(e.target.parentNode.id);
  }

  const getSortOptionColor = (str) => {
    // console.log(str);
    return (str === sortOption) ? "secondary" : "";
  }

  const handleRate = () => {
    if(!isSelected) return;
    let formData = {
      rating: parseInt(rating)
    }
    console.log("rating: ", rating);
    axios({
      method: "PUT",
      url: `${conf.SERVER_URL}recruiter/myemployees/rate/${rows[applicationId].application_id}`,
      data: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      getData();
      setIsSelected(false);
      setApplicationId(-1);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setRating("");
    })
  }

  const handleRateIcon = (e) => {
    const Set = (currId) => {
      // console.log(`currId: ${currId} skillId: ${skillId} ${isSelected}`);
      currId = parseInt(currId);
      console.log(currId);
      if(isSelected && applicationId === currId) {
        setIsSelected(false);
        setApplicationId(-1);
        setRating("");
      } else {
        // setFormData(rows[currId]);
        let newRating = rows[currId].rating !== -1 ? rows[currId].rating.toString() : "0";
        setRating(newRating);
        setIsSelected(true);
        setApplicationId(currId);
      }
    }
    console.log("here", e.target);
    if ( e.target.id && e.target.id >= 0) {
      Set(e.target.id);
    } else if (e.target.parentNode.id && e.target.parentNode.id >= 0) {
      Set(e.target.parentNode.id);
    } else if (e.target.parentNode.parentNode.id && e.target.parentNode.parentNode.id >= 0) {
      Set(e.target.parentNode.parentNode.id);
    }
  }
  

  const getColor = (id) => (isSelected && id === applicationId) ? "secondary" : "";
  

  return (
    <div>
    <h3 style={{marginTop: 30, marginLeft: 40}}>Rate Applicant </h3>
    <Autocomplete
      id="applicant_rating"
      options={ratingOptions}
      fullWidth={true}
      getOptionLabel={(option) => option}
      value={rating || ""}
      onInputChange={(event, newInputValue) => {
        setRating(newInputValue);
      }}
      style={{
        marginTop: 10,
        marginLeft: 40,
        width: "50%"
      }}
          renderInput={(params) => <TextField size="small" {...params}  label="Rate Your Job" variant="outlined" />}
      />
      <br/>
    <Button
        variant="contained"
        color="black"
        size="large"
        style = {{
          marginTop: "20px",
          marginBotton: "20px",
          marginLeft: "40px"
        }}
        onClick={handleRate}
      >
        Rate
      </Button>
      {
        isSuccess && 
        <Alert severity="success" style={{textAlign: "center", fontSize: "20px", marginTop: "20px", marginBottom: "30px",marginLeft: "40px", width: "750px"}}>Successfully Rated</Alert>
      }
            <h3 style={{marginLeft: "40px", marginTop: "20px"}}>Sort</h3>
            <Button  variant="contained" size="small" style={{
              marginLeft: 40,
              marginTop: 10,
            }}
            color={getSortOptionColor("applicant_name")}
            id="applicant_name"
            onClick={handleSortOption}
            >
            Applicant Name
            </Button>
            <Button  variant="contained" size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("title")}
            id="title"
            onClick={handleSortOption}
            >
              Job Title
            </Button>
            <Button  variant="contained"  size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("date_of_ac")}
            id="date_of_ac"
            onClick={handleSortOption}
            >
              Date Of Joining
            </Button>
            <Button  variant="contained"  size="small" style={{
              marginLeft: 15,
              marginTop: 10,
            }}
            color={getSortOptionColor("rating")}
            id="rating"
            onClick={handleSortOption}
            >
              Applicant's Rating
            </Button>
            <br/> <br/>
            <ListItem style={{marginBottom: "10px", marginLeft: "40px"}}>
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
    <h3 style={{marginTop: 30, marginLeft: 40}}>Your Employees </h3>

    <TableContainer >
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Job Title</StyledTableCell>
            <StyledTableCell align="right">Job Type</StyledTableCell>
            <StyledTableCell align="right">Date Of Joining</StyledTableCell>
            <StyledTableCell align="right">Applicant Name</StyledTableCell>
            <StyledTableCell align="right">Rating Given</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, id) => (
            <StyledTableRow  key={id}>
              <StyledTableCell component="th" scope="row">
                {row.title}
              </StyledTableCell>
              <StyledTableCell align="right">{row.job_type}</StyledTableCell>
              <StyledTableCell align="right">{row.date_of_ac.toString().substring(0, 10)}</StyledTableCell>
              <StyledTableCell align="right">{row.applicant_name}</StyledTableCell>
              <StyledTableCell align="right">{row.rating.toString() !== "-1" ? row.rating.toString() : "Not Rated" }</StyledTableCell>
              <StyledTableCell align="right">
                {
                  row.rating.toString() === "-1" &&
                    <IconButton edge="end" aria-label="edit" id={id} onClick={handleRateIcon} color={getColor(id)}>
                        <StarsIcon id={id} onClick={handleRateIcon} />
                    </IconButton>

              }
        </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}