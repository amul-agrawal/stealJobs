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

export default function MyApplications() {
  console.log("MyApplications");
  let ratingOptions = ["0", "1", "2", "3", "4", "5"];
  const [rating, setRating] = useState("");

  const classes = useStyles();
  const [isSuccess, setIsSuccess] = useState(false);
  const [jobId, setJobId] = useState(-1);
  const [rows, setRows] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const getData = () => {
    axios({
      method: "GET",
      url: `${conf.SERVER_URL}applicant/myapplications/`,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("GetData", response.data);
      setRows(response.data);
    })
  };

  useEffect(getData, []);


  const handleRate = () => {
    if(!isSelected) return;
    let formData = {
      rating: parseInt(rating)
    }
    axios({
      method: "PUT",
      url: `${conf.SERVER_URL}applicant/myapplications/rate/${rows[jobId].job_id}`,
      data: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      getData();
      setIsSelected(false);
      setJobId(-1);
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
      if(isSelected && jobId === currId) {
        setIsSelected(false);
        setJobId(-1);
        setRating("");
      } else {
        // setFormData(rows[currId]);
        let newRating = rows[currId].rating !== -1 ? rows[currId].rating.toString() : "0";
        setRating(newRating);
        setIsSelected(true);
        setJobId(currId);
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
  

  const getColor = (id) => (isSelected && id === jobId) ? "secondary" : "";
  

  return (
    <div>
      <h3 style={{marginTop: 30, marginLeft: 40}}>Rate Job </h3>
    <Autocomplete
      id="rating"
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
    <h3 style={{marginTop: 30, marginLeft: 40}}>Your Applications </h3>

    <TableContainer >
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">Date Of Joining</StyledTableCell>
            <StyledTableCell align="right">Salary Per Month</StyledTableCell>
            <StyledTableCell align="right">Name Of Recruiter</StyledTableCell>
            <StyledTableCell align="right">Rating Given</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, id) => (
            <StyledTableRow  key={id}>
              <StyledTableCell component="th" scope="row">
                {row.title}
              </StyledTableCell>
              <StyledTableCell align="right">{row.status === "Selected" ? row.date_of_ac.toString().substring(0,10) : "NA"}</StyledTableCell>
              <StyledTableCell align="right">{row.salary}</StyledTableCell>
              <StyledTableCell align="right">{row.recruiter_name}</StyledTableCell>
              <StyledTableCell align="right">{row.status === "Selected" ? (row.rating !== -1 ? row.rating.toString() : "Not Rated") : "NA"}</StyledTableCell>
              <StyledTableCell align="right">
                {
                  row.status === "Selected" && row.rating === -1 && 
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