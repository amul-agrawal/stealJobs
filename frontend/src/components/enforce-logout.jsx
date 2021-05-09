import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import conf from '../config';
import Login from './login'


const EnforceLogout = (props) => {
  let isLoggedIn = true;
  if (!props.isLoggedIn) {
      isLoggedIn = false;
  }
  if (!props.desiredType.includes(props.type)) {
      isLoggedIn = false;
  }
  if (isLoggedIn) {
      if (props.type === conf.USER_APPLICANT) {
          return <Redirect to="/applicant/home" />;
      } else {
          return <Redirect to="/recruiter/home" />;
      }
  } else {
      if (props.hasProps) {
        return <Route to={props.path} component={() => <Login afterLogin={props.afterLogin} />} />
      } else {
        return <Route to={props.path} exact component={props.component} />
      }
  }
}

export default EnforceLogout;