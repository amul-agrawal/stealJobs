import React, { Component, useHistory } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import Lottie from 'react-lottie';
import SearchData from '../assets/lotties/search.json';
import Typography from '@material-ui/core/Typography';

const Landing = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SearchData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <div >
      <div style={{display: "flex", justifyContent: "center", paddingTop: "30px"}}>
        <Lottie 
          options={defaultOptions}
          height={500}
          width={500}
          />
      </div>
      <Typography variant="h2" align="center" component="div" color="textSecondary" marginBottom="100px">
        Wanna spend summer in Singapore ?
      </Typography>
      <br/>
      <div className="col-12 d-flex flex-direction-column flex-md-row justify-content-center" style={{paddingTop: "10px"}}>
      <a href="/register"> 
        <button
            type="button"
            class="btn btn-secondary btn-lg"
            >Register</button>
      </a>
      <a href="/login">
          <button type="button" class="btn btn-secondary btn-lg" style={{marginLeft: "26px"}}>Login</button>
      </a>
      </div>

  </div>
  )
}

export default Landing;