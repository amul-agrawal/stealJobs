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

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const useStyles = makeStyles({
  table: {
    marginLeft: 40,
    width: 800,
    marginTop: 10,
  },
});

export default function CustomizedTables() {
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [jobId, setJobId] = useState(-1);
  const [rows, setRows] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  console.log(formData);
  // console.log(new Date().toISOString());
  const getData = () => {
    axios({
      method: "GET",
      url: `${conf.SERVER_URL}recruiter/myjobs/`,
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      setRows(response.data);
    }).catch(error => {
        if (error) {
            console.log(error.response.data);
            setIsError(true);
            setErrors(error.response.data.errors);
        }
    });
  };
  useEffect(getData, []);

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    const newFormData = Object.assign({}, formData);
    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  }

  const handleEdit = (e) => {
    const Set = (currId) => {
      // console.log(`currId: ${currId} skillId: ${skillId} ${isSelected}`);
      currId = parseInt(currId);
      setIsError(false);
      setErrors({});
      console.log(currId);
      if(isSelected && jobId === currId) {
        setFormData({});
        setIsSelected(false);
        setJobId(-1);
      } else {
        // setFormData(rows[currId]);
        let newData = rows[currId];
        newData.deadline = newData.deadline.toString().substring(0,10);
        setFormData(newData);
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

  const handleDelete = (e) => {
    const Del = (id) => {
      id = parseInt(id);
      axios({
        method: "DELETE",
        url: `${conf.SERVER_URL}recruiter/myjobs/delete/${rows[id]._id}`,
        headers: {
            'Content-Type': 'application/json',
        }
      }).then((response) => {
        console.log("DATA", response.data);
        getData();
      })
    }
    if ( e.target.id && e.target.id >= 0) {
      Del(e.target.id);
    } else if (e.target.parentNode.id && e.target.parentNode.id >= 0) {
      Del(e.target.parentNode.id);
    } else if (e.target.parentNode.parentNode.id && e.target.parentNode.parentNode.id >= 0) {
      Del(e.target.parentNode.parentNode.id);
    }
  };

  const handleSave = () => {
    if(!isSelected) return;
    axios({
      method: "PUT",
      url: `${conf.SERVER_URL}recruiter/myjobs/${rows[jobId]._id}`,
      data: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("DATA", response.data);
      getData();
      setFormData({});
      setIsError(false);
      setErrors({});
      setIsSelected(false);
      setJobId(-1);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }).catch(error => {
        if (error) {
            console.log("ERRRRRRRR", error.response.data);
            setIsError(true);
            setErrors(error.response.data.errors);
        }
    });
  }

  const getColor = (id) => (isSelected && id === jobId) ? "secondary" : "";
  

  return (
    <div>
    <h3 style={{marginTop: 30, marginLeft: 40}}>Edit Job </h3>
    <TextField
      id="deadline"
      label="Deadline"
      type="date"
      style={{
        marginTop: 10,
        marginLeft: 40,
        width: "20%"
      }}
      variant="outlined"
      required={true}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={handleChange}
      // defaultValue="2019-10-10"
      value={formData['deadline'] || ""}
    />
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
        marginTop: 10,
        marginLeft: 40,
        width: "20%"
      }}
      onChange={handleChange}
      value={formData['max_positions'] || ""}
    />
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
      required={true}
      variant="outlined"
      style={{
        marginTop: 10,
        marginLeft: 40,
        width: "20%"
      }}
      onChange={handleChange}
      value={formData['max_applications'] || ""}
      />
      <br/>
    {
      isError && errors.deadline &&
      <>
      <span style={{color: "red", marginLeft: 40}}> Deadline: {errors.deadline} </span>
      <br/>
      </>
    }
    {
      isError && errors.max_positions &&
      <>
       <span style={{color: "red", marginLeft: 40}}> Max Positions: {errors.max_positions} </span>
       <br/>
       </>
    }
    {
      isError && errors.max_applications &&
      <>
       <span style={{color: "red", marginLeft: 40}}> Max Applications: {errors.max_applications} </span>
       <br/>
       </>
    }
    <Button
        variant="contained"
        color="black"
        size="large"
        style = {{
          marginTop: "20px",
          marginBotton: "20px",
          marginLeft: "40px"
        }}
        startIcon={<SaveIcon />}
        onClick={handleSave}
      >
        Save
      </Button>
      {
        isSuccess && 
        <Alert severity="success" style={{textAlign: "center", fontSize: "20px", marginTop: "20px", marginBottom: "30px",marginLeft: "40px", width: "750px"}}>Successfully Updated</Alert>
      }
    <h3 style={{marginTop: 30, marginLeft: 40}}>Your Jobs </h3>

    <TableContainer >
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">Date Of Posting</StyledTableCell>
            <StyledTableCell align="right">Maximum Positions</StyledTableCell>
            <StyledTableCell align="right">Maximum Applicants</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, id) => (
            <StyledTableRow  key={id}>
              <StyledTableCell component="th" scope="row">
                {row.title}
              </StyledTableCell>
              <StyledTableCell align="right">{row.post_date.substring(0,10)}</StyledTableCell>
              <StyledTableCell align="right">{row.max_positions}</StyledTableCell>
              <StyledTableCell align="right">{row.max_applications}</StyledTableCell>
              <StyledTableCell align="right">
              <IconButton edge="end" aria-label="edit" id={id} onClick={handleEdit} color={getColor(id)}>
                  <EditIcon id={id} onClick={handleEdit} />
              </IconButton>
              <IconButton edge="end" aria-label="delete" id={id} onClick={handleDelete} style={{marginLeft: "10px"}} >
                  <DeleteIcon id={id} onClick={handleDelete} />
              </IconButton>
              <IconButton href={`/recruiter/myjobs/${row._id}`} edge="end" aria-label="delete" style={{marginLeft: "10px"}}>
              <LaunchIcon href={`/recruiter/myjobs/${row._id}`} />
            </IconButton>
                    </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}