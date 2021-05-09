const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config('../.env')

// load validation 
const validateRegisterApplicantInput = require('../validation/register_applicant')
const validateRegisterRecruiterInput = require('../validation/register_recruiter')
const validateLoginInput = require('../validation/login')

// load models
const Applicant = require('../models/applicants')
const Recruiter = require('../models/recruiters')

// Recruiter registration route
// @route POST /auth/register/recruiter
// @desc Register recruiter
// @access Public
router.post("/register/recruiter", (req, res) => {
    
    // check input validation
    const {errors, isValid} = validateRegisterRecruiterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // check already exists and if not, create
    Recruiter.findOne({email: req.body.email}).then(recruiter => {
        if (recruiter) {
            return res.status(400).json({email: "This email already exists."});
        } else {
            const newRecruiter = new Recruiter({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,  
            });
            if(req.body.bio) newRecruiter.bio = req.body.bio;

            // hash passwords before storing in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newRecruiter.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newRecruiter.password = hash;
                    newRecruiter
                        .save()
                        .then(recruiter => res.json(recruiter))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

router.post("/register/applicant", (req, res) => {
    
    // check input validation
    console.log(res);
    const {errors, isValid} = validateRegisterApplicantInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check already exists and if not, create
    Applicant.findOne({email: req.body.email}).then(applicant => {
        if (applicant) {
            return res.status(400).json({email: "This email already exists."});
        } else {
            const newApplicant = new Applicant({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                skills: req.body.skills,  
            });
            if(req.body.institute) newApplicant.institute = req.body.institute;

            // hash passwords before storing in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newApplicant.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newApplicant.password = hash;
                    newApplicant
                        .save()
                        .then(applicant => res.json(applicant))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

function userFound(type, password, user, res) {
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            // user authenticated
            // create JWT token
            const jwtPayload = {
                id: user.id,
                name: user.name,
                type: type
            };
            jwt.sign(jwtPayload, process.env.SECRET_OR_KEY, {
                    expiresIn: 3600000 // 1000hr
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                });
        } else {
            res.status(400).json({
                password: "That password's incorrect"
            })
        }
    });
}

// login route
// @route POST auth/login
// @desc Login and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // check validation
    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Applicant.findOne({email}).then((user) => {
       if (!user) {
           Recruiter.findOne({email}).then((user2) => {
               if (user2) {
                   userFound(process.env.USER_RECRUITER, password, user2, res);
               } else {
                   res.status(404).json({
                       email: "Not Registered"
                   });
               }
           });
       } else {
           userFound(process.env.USER_APPLICANT, password, user, res);
       }
   });
    
});

module.exports = router;
































// router.post('/register', (req, res) => {
//     const { errors, isValid } = validateRegistrationInput(req.body)

//     if (!isValid) res.status(400).send(errors)

//     if (req.body.isApplicant) {
//         const {isApplicant, name, email, password, password2, contact_number, bio, date} = req.body;
//         try {
//             const applicant = await Applicant.findOne({ email: req.body.email });
//             if (applicant) throw Error('Applicant already exists');
        
//             const salt = await bcrypt.genSalt(10);
//             if (!salt) throw Error('Something went wrong with bcrypt');
        
//             const hash = await bcrypt.hash(password, salt);
//             if (!hash) throw Error('Something went wrong hashing the password');
        
//             const newApplicant = new Applicant({
//               name,
//               email,
//               password: hash
//             });
        
//             const saved = await newApplicant.save();
//             if (!savedApplicant) throw Error('Something went wrong saving the applicant');
        
//             const token = jwt.sign({ id: savedApplicant._id }, JWT_SECRET, {
//               expiresIn: 3600
//             });
        
//             res.status(200).json({
//               token,
//               applicant: {
//                 id: savedApplicant.id,
//                 name: savedApplicant.name,
//                 email: savedApplicant.email
//               }
//             });
//           } catch (e) {
//             res.status(400).json({ error: e.message });
//           }
//     } else {
//         const {isApplicant, name, email, password, password2, contact_number, bio, date} = req.body;
//         try {
//             const recruiter = await Recruiter.findOne({ email });
//             if (recruiter) throw Error('Recruiter already exists');
        
//             const salt = await bcrypt.genSalt(10);
//             if (!salt) throw Error('Something went wrong with bcrypt');
        
//             const hash = await bcrypt.hash(password, salt);
//             if (!hash) throw Error('Something went wrong hashing the password');
        
//             const newRecruiter = new Recruiter({
//               name,
//               email,
//               contact_number,
//               password: hash,
//             });
//             if (bio) newRecruiter.bio = bio; 
//             if (date) newRecruiter.date = date; 
        
//             const savedRecruiter = await newRecruiter.save();
//             if (!savedRecruiter) throw Error('Something went wrong saving the recruiter');
        
//             const token = jwt.sign({ id: savedRecruiter._id }, JWT_SECRET, {
//               expiresIn: 3600
//             });
        
//             res.status(200).json({
//               token,
//               recruiter: {
//                 id: savedRecruiter.id,
//                 name: savedRecruiter.name,
//                 email: savedRecruiter.email
//               }
//             });
//           } catch (e) {
//             res.status(400).json({ error: e.message });
//           }
//     }
// });

// router.post('/register', (req, res) => {
//     const { errors, isValid } = validateRegistrationInput(req.body)

//     if (!isValid) res.status(400).send(errors)

//     if (req.body.isApplicant) {
//         Applicant.findOne({ email: req.body.email }).then(applicant => {
//             if (applicant) {
//                 res.status(400).send({ message: 'Email already exists!' })
//             }
//             else {
//                 const newApplicant = new Applicant({
//                     name: req.body.name,
//                     email: req.body.email,
//                     password: req.body.password,
//                     skills: req.body.skills,
//                 })
//                 if ( req.body.institute ) newApplicant.institute = req.body.institute
                
//                 bcrypt.hash(newApplicant.password, 10, (err, hash) => {
//                     if (err) throw err;
//                     newApplicant.password = hash;
//                     newApplicant.save()
//                         .then(applicant => res.send(applicant))
//                         .catch(err => console.log(err))
//                 })
//             }
//         })
//     } else {
//         Recruiter.findOne({ email: req.body.email }).then(recruiter => {
//             if (recruiter) {
//                 res.status(400).send({ message: 'Email already exists!' })
//             }
//             else {
//                 const newRecruiter = new Recruiter({
//                     name: req.body.name,
//                     email: req.body.email,
//                     password: req.body.password,
//                     contact_number: req.body.contact_number,
//                 })
//                 if ( req.body.bio ) newRecruiter.bio = req.body.bio
//                 if ( req.body.date ) newRecruiter.date = req.body.date
                
//                 bcrypt.hash(newRecruiter.password, 10, (err, hash) => {
//                     if (err) throw err;
//                     newRecruiter.password = hash;
//                     newRecruiter.save()
//                         .then(recruiter => res.send(recruiter))
//                         .catch(err => console.log(err))
//                 })
//             }
//         })
//     }
// });

// router.post('/login', (req, res) => {
//     const { errors, isValid } = validateLogin(req.body)

//     if (!isValid) res.status(400).send(errors)

//     User.findOne({ email: req.body.email }).then(user => {
//         if (!user) return res.status(404).send({message:"Email not found!"})

//         bcrypt.compare(req.body.password, user.password).then(isMatch=>{
//             if(isMatch) {
//                 const payload = {
//                     id : user.id,
//                     name : user.name
//                 }

//                 jwt.sign(
//                     payload,
//                     process.env.SECRET_OR_KEY || 'secret',
//                     {
//                         expiresIn : 31556926 // 1 year in seconds
//                     },
//                     (err,token)=>{
//                         res.json({
//                             success : true,
//                             token : token
//                         })
//                     }
//                 )
//             }

//             else res.status(400).send({message:"Password Incorrect"})
//         })
//     })
// });

// module.exports = router;