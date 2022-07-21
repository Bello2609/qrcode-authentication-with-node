const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.postUser = (req, res, next)=>{
    const { name, email, password } = req.body;
    User.find({ email: email }).exec().then(user=>{
        console.log(user)
        if(user.length >= 1){
            return res.status(409).json({
                message: "The email is already registered"
            })
        }else{
            bcrypt.hash(password, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        message: err
                    })
                }else {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hash
                    });
                    user.save().then(newuser=>{
                        return res.status(201).json({
                            message: "A new user has been registered",
                            user: newuser,
                            method: {
                                type: "POST",
                                url: "http://localhost:2200/signup"
                            }
                        })
                    }).catch(err=>{
                        return res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
}
exports.loginUser = (req, res, next)=>{
    const { email, password } = req.body;
    User.find({ email: email }).exec().then(user=>{
     
        if(user.length < 1){
            return res.status(401).json({
                message: "The email entered cannot be found or the user is not registered "
            })
        }
            bcrypt.compare(password, user[0].password, (err, pass)=>{
                if(err){
                    return res.status(500).json({
                        message: "User athentication failed"
                    })
                }
                if(pass){
                    
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_kEY,
                    {
                        expiresIn: "1hr"
                    });
                    return res.status(201).json({
                        message: "User authenticated",
                        token: token
                    })
                }
            });
            return res.status(401).json({
                message: "User not authenticated"
            })
        
    })
}