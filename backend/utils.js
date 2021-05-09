const jwt = require("jsonwebtoken");
require('dotenv').config()

function protect(func) {
    return function (req, res) {
        let token = req.headers.authorization;
        if (!token) {
            res.status(403).json({error: "Forbidden"});
            return;
        }

        // split the 'Bearer' part
        [, token] = token.split(" ");
        
        jwt.verify(token, process.env.SECRET_OR_KEY, (err, result) => {
            if (err) {
                res.status(403).json({error: "Forbidden"});
                return;
            }
            func(req, res, result);
        });
    };
}

module.exports = protect
