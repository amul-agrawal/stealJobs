import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import logo from '../assets/images/job-search.svg';


const NavBar = (props) => {
    console.log(props);
    const home = (props.isLoggedIn) ? (props.userType === "0" ? "/applicant/home" : "/recruiter/home") : "/"; 
    const profile = (props.isLoggedIn) ? (props.userType === "0" ? "/applicant/profile" : "/recruiter/profile") : "/"; 
    return (
        <div>                
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to={home}>
                <img src={logo} width="30" height="30" alt="" />
            </Link>
            <Link to={home} className="navbar-brand">StealJobs</Link>
                {
                    props.isLoggedIn &&
                      (  <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to={profile} className="nav-link">Profile</Link>
                                </li>                            
                                {
                                    props.userType === "1" ? 
                                    <>
                                    <li className="navbar-item">
                                    <Link to="/recruiter/myjobs" className="nav-link">MyJobs</Link>
                                    </li>
                                    <li className="navbar-item">
                                    <Link to="/recruiter/myemployees" className="nav-link">MyEmployees</Link>
                                    </li>
                                    </>
                                    :
                                    <li className="navbar-item">
                                    <Link to="/applicant/myapplications" className="nav-link">MyApplications</Link>
                                    </li>
                                }
                                <li className="navbar-item">
                                    <Link to="/logout" className="nav-link">Logout</Link>
                                </li>
                            </ul>
                            {
                                props.isLoggedIn &&
                            <span className="navbar-text">
                                Logged in as {props.userName}
                            </span>

                            }
                        </div>
                      )
                }
            </nav>
        </div>
    )

}
export default NavBar;
//     // render() {
//     }
// }