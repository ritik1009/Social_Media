var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = "ThisismySecretKey123@456#789";
const refreshSecretKey = "ThisismyRefreshSecretKey123@456#789";
const RefreshToken = require('./models/refreshToken')

const verify = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token,secretKey,(err,user)=>{
            if(err){
                return res.status(403).json("Token is not Valid.")
            }
            req.user =user;
            next();
        })
    }else{
        res.status(401).json("You are not authenticated")
    }
}

const generateAccessToken=(user)=>{
    return jwt.sign({id:user._id,isAdmin:user.isAdmin,username:user.username},secretKey,{expiresIn:"30s"})
}

const generateRefreshAccessToken = (user)=>{
    return jwt.sign({id:user._id,isAdmin:user.isAdmin},refreshSecretKey)
}

const generateNewToken = async(refresh_token,user_id)=>{
    let rr= {}
    const userRefreshToken = await RefreshToken.findOne({userId:user_id})
    if(!userRefreshToken){
        return rr = {status:403,data:"Refresh token is not Generated!"}
    }else if(refresh_token!==userRefreshToken.refreshToken){
        return rr = {status:403,data:"Refresh token is not valid!"}
    }
    jwt.verify(refresh_token,refreshSecretKey,(err,user)=>{
        if(err || user.id!==user_id){
            rr ={status:403,data:"Refresh token is not valid!"}
        }
        // refreshTokens.filter((token)=> token!==refresh_token);
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshAccessToken(user)
        
        rr = {status:200,data:{
            accessToken:newAccessToken,
            refreshToken:newRefreshToken,
        }}
        
        console.log("genenene",rr)
        
    })
    const update = await RefreshToken.findOneAndUpdate({userId:user_id},{$set:{refreshToken:rr.data.refreshToken}},)
    console.log("updated_data",update)
    return rr;
}

module.exports = {verify, generateAccessToken, generateRefreshAccessToken,generateNewToken}