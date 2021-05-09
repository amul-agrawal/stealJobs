
import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import MyJobApplications from './job-applications';

const EnforceLogin =  (props) => {
    const {id} = props.match.params;
    let isLoggedIn = true;
    if (!props.isLoggedIn) {
        isLoggedIn = false;
    }
    if (!props.desiredType.includes(props.type)) {
        isLoggedIn = false;
    }
    
    if(!isLoggedIn && localStorage && localStorage.logToken) {
        props.afterLogin(localStorage.logToken);
        isLoggedIn = true;
    }

    let userTypes = ["applicant", "recruiter"];
    let str = ""; 
    for(let i=1;i<props.path.length; i++)
    {
        if(props.path[i] === '/') break;
        str += props.path[i];
    } 
    if (!isLoggedIn || userTypes[1-parseInt(props.type)] === str) {
        return <Redirect to="/login" />;
    } else {
        if(id) return <Route to={props.path} exact component={() => <MyJobApplications id={id} /> } />
        
        if (props.hasProps) {
            return <Route to={props.path} render={
                (props) => props.component
            } />;
        } else {
            return <Route to={props.path} exact component={props.component}/>
        }
    }
}

export default EnforceLogin;