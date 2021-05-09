import React, { useState, Component, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import jwt_decode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css'

import conf from './config';
import './App.css';
import setAuthToken from './set-auth-token';

// Importing Components
import EnforceLogout from './components/enforce-logout'
import EnforceLogin from './components/enforce-login'
import Navbar from './components/Navbar'
import Landing from './components/landing'
import Register from './components/register'
import Login from './components/login'
import ApplicantProfile from './components/applicant-profile'
import RecruiterProfile from './components/recruiter-profile'
import JobList from './components/job-list'
import RecHome from './components/rec-home'
import MyJobs from './components/myjobs'
import MyApplications from './components/myapplications'
import MyJobApplications from './components/job-applications'
import MyEmployees from './components/myemployees'

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");

  const afterLogin = (token) => {
    localStorage.setItem("logToken", token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    console.log("decoded", decoded);
    setLoggedIn(true);
    setUserId(decoded.id);
    setUserType(decoded.type);
    setUserName(decoded.name);
    setToken(token);
  }

  const logout = () => {
    if (localStorage && localStorage.logToken) {
      localStorage.removeItem("logToken");
    }
    setLoggedIn(false);
    setUserId("");
    setUserType("");
    setUserName("");
    setToken("");

    return <Redirect to="/" />
  }

  useEffect( () => {
    if (localStorage && localStorage.logToken) {
			afterLogin(localStorage.logToken);
		}
  }, [])


  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} userType={userType} userName={userName}/>

      <Route exact path="/" 
        render = {
          (props) => <EnforceLogout {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_APPLICANT, conf.USER_RECRUITER]}
          path='/'
          hasProps={false}
          component={Landing}
          />} />

      <Route exact path = "/register"
				render = {
						(props) => <EnforceLogout {...props}
						isLoggedIn={isLoggedIn}
						type={userType}
						desiredType={[conf.USER_APPLICANT, conf.USER_RECRUITER]}
						path='/register'
						hasProps={false}
						component={Register}
						/>} />
				
				
				<Route exact path = "/login"
				render = {
						(props) => <EnforceLogout {...props}
						isLoggedIn={isLoggedIn}
						type={userType}
						desiredType={[conf.USER_APPLICANT, conf.USER_RECRUITER]}
						path='/login'
            hasProps={true}
            afterLogin={afterLogin}
            component={<Login afterLogin={afterLogin}/>}
						/>} />

        <Route exact path="/logout" render={logout} />

        <Route exact path = "/applicant/profile"
          render = {
            (props) => <EnforceLogin {...props}
            isLoggedIn={isLoggedIn}
            type={userType}
            desiredType={[conf.USER_APPLICANT]}
            path='/applicant/profile'
            hasProps={false}
            afterLogin={afterLogin}
            component={ApplicantProfile}
            />} />

      <Route exact path = "/applicant/home"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_APPLICANT]}
          path='/applicant/home'
          hasProps={false}
          afterLogin={afterLogin}
          component={JobList}
          />} />
      
      <Route exact path = "/applicant/myapplications"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_APPLICANT]}
          path='/applicant/myapplications'
          hasProps={false}
          afterLogin={afterLogin}
          component={MyApplications}
          />} />
      
      <Route exact path = "/recruiter/home"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_RECRUITER]}
          path='/recruiter/home'
          hasProps={false}
          afterLogin={afterLogin}
          component={RecHome}
          />} />

      <Route exact path = "/recruiter/profile"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_RECRUITER]}
          path='/recruiter/profile'
          hasProps={false}
          afterLogin={afterLogin}
          component={RecruiterProfile}
          />} />

      <Route exact path = "/recruiter/myjobs"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_RECRUITER]}
          path='/recruiter/myjobs'
          hasProps={false}
          afterLogin={afterLogin}
          component={MyJobs}
          />} />
      
      <Route  path = "/recruiter/myjobs/:id"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_RECRUITER]}
          path='/recruiter/myjobs/:id'
          hasProps={false}
          afterLogin={afterLogin}
          component={MyJobApplications}
          />} />
      
      <Route  path = "/recruiter/myemployees/"
        render = {
          (props) => <EnforceLogin {...props}
          isLoggedIn={isLoggedIn}
          type={userType}
          desiredType={[conf.USER_RECRUITER]}
          path='/recruiter/myemployees/'
          hasProps={false}
          afterLogin={afterLogin}
          component={MyEmployees}
          />} />
        
    </Router>
  )
}

export default App;

