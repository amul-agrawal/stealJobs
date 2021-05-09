// called from `/app` + attemptlogin(), after login is done
// purpose: to add token to all header requests

import axios from "axios";

const setAuthToken = token => {
    if (token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common["Authorization"];
    }
};
export default setAuthToken;