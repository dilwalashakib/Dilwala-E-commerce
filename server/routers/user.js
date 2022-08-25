const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {loginValidator, signUpValidator} = require("../utils/validate");
const isVerify = require("../utils/verify");

router.put("/profile", isVerify, async(req, res) => {
    const {name, email, password, confirmPassword} = req.body;
    try {
        const userId = req.user.id;
        const {isValid, error} = signUpValidator({name, email, password, confirmPassword});
        if(isValid) {
            const hashPassword = await bcrypt.hash(password, 10);
            let user = await User.findByIdAndUpdate(userId, {
                name,
                email,
                password: hashPassword
            }, {new : true});
        
            let {name:userName, email:userEmail, isAdmin, _id} = user;
            
            const token = await jwt.sign({
                id: _id,
                name: userName,
                email: userEmail,
                isAdmin
            }, process.env.SECRET_KEY, {expiresIn: "30d"});
        
            res.send({
                name: userName,
                email: userEmail,
                isAdmin,
                id: _id,
                token
            });
        } else {
            res.status(403).json(error);
        }
        
    } catch(err) {
        res.status(500).json({error: err.message});
    }
})

router.post('/signup', async(req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        // validation
        const {isValid, error} = signUpValidator({name, email, password, confirmPassword});
        if(isValid) {
            const existEmail = await User.findOne({email});
            
            if(!existEmail) {
                const hashPassword = await bcrypt.hash(password, 10);
                if(hashPassword) {
                    const data = new User({
                        name,
                        email,
                        password: hashPassword
                    });
                    const saveData = await data.save();
                    // Token Created
                    let token = jwt.sign({
                        id: saveData._id,
                        email: saveData.email,
                        isAdmin: saveData.isAdmin
                    }, process.env.SECRET_KEY, {expiresIn: "30d"});

                    res.status(201).json({
                        id: saveData._id,
                        name: saveData.name,
                        email: saveData.email,
                        isAdmin: saveData.isAdmin,
                        token
                    });
                } else {
                    res.status(500).json({error: "Server Side Error"});
                }
            } else {
                res.send({error: "Email Already Exists"});
            }
        } else {
            res.status(403).json(error);
        }
        
    } catch(err) {
        res.status(500).json({error: err.message});
    }
})

router.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;
        let {error, isValid} = loginValidator({email, password});
        if(isValid) {
            let existEmail = await User.findOne({email});
            if(existEmail) {
                const hassPassword = existEmail.password;
                let checkPassword = await bcrypt.compare(password, hassPassword);
                if(checkPassword) {
                    const {_id, email, name, isAdmin} = existEmail._doc;
                    let token = jwt.sign({
                        id: _id,
                        email,
                        isAdmin
                    }, process.env.SECRET_KEY, {expiresIn: "10d"});
                    res.status(200).json({name, email, token});
                } else {
                    res.status(401).json({error: "Password Dosn't Match !!!"});
                }
            } else {
                res.status(404).json({error: "Not Found Email"});
            }
        } else {
            res.status(403).json(error);
        }
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = router;