const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require('dotenv').config()

const Applicant = require("./models/applicants");
const Recruiter = require("./models/recruiters");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;
module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            Applicant.findById(jwt_payload.id)
                .then(applicant => {
                    if (applicant) {
                        return done(null, applicant);
                    }
                })
                .catch(err => console.log(err));
            Recruiter.findById(jwt_payload.id)
                .then(recruiter => {
                    if (recruiter) {
                        return done(null, recruiter);
                    }
                })
                .catch(err => console.log(err));
            return done(null, false)
        })
    );
};