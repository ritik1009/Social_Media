const router = require('express').Router();
const User = require('../models/users')
const bcrypt = require('bcrypt');
const {verify,generateAccessToken,generateRefreshAccessToken,generateNewToken}= require('../utils')
const RefreshToken = require('../models/refreshToken')

router.post('/register',async (req,res)=>{
    try{
        
        const salt = await bcrypt.genSalt(10);
        console.log("body--",req.body);
        const hashedPaswword = await bcrypt.hash(req.body.password,salt);
        console.log("register")
        
        const newUser = await new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPaswword,
        })
        const user =await newUser.save()
        res.status(200).json("The user has been created")
        console.log(user)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("User not found") ;
        const validateUser = await bcrypt.compare(req.body.password,user.password);
        if(!validateUser) return res.status(400).json("Email or Password does'nt match");
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshAccessToken(user);
        const{password,updatedAt,...other} = user._doc
        try {
            const tokenRecord = await new RefreshToken({refreshToken:refreshToken,userId:user._id})
            await tokenRecord.save()
        } catch (error) {
            console.log("creating the refresh token record - ",error)
            const old_record = await RefreshToken.findOneAndUpdate({userId:user._id},{$set:{refreshToken:refreshToken}})
            // return res.status(200).json("user is already logged in")
        }
        res.status(200).json({user:other,accessToken:accessToken,refreshToken});
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
    
})

router.post("/refresh/:id",(req,res)=>{
    const refresh_token = req.body.token;
    const user_id = req.params.id;
    let response ={}
    if(!refresh_token) return res.status(401).json("You are not authenticated");
    generateNewToken(refresh_token,user_id)
    .then((data)=>{
        console.log("dadaadaddad",data)
        response=data
        return res.status(response.status).json(response.data)
    })    
});



module.exports = router