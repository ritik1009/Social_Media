const express =require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser');

const secretKey = "ThisismySecretKey123@456#789"
const refreshSecretKey = "ThisismyRefreshSecretKey123@456#789"

dotenv.config();

// Connecting the mongoose database server
mongoose.connect('mongodb://127.0.0.1:27017/social_media',{useNewUrlParser:true})
.then(()=>{
    console.log("Connected to the Mongoose database")
}).catch((error)=>{
    console.log("There was an error while connecting to the mongodb",error)
});

//  middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(helmet());
app.use(morgan("common"));
app.use(cors())

const verify = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err){
                return res.status(401).json("Token is not Valid.")
            }
            req.user =user;
            next();
        })
    }else{
        res.status(401).json("You are not authenticated")
    }
}





app.use("/images",verify,express.static(path.join(__dirname,"public/images")))

const storage = multer.diskStorage({
    
    destination:(req,file,cb)=>{
        cb(null,"public/images");
    },
    filename:(req,file,cb)=>{
        cb(null, req.params.name)
        
    }

})

const upload = multer({storage}); 

app.post('/api/upload/:name',upload.single("file"),(req,res)=>{
    try {
        console.log("NAME_____-",req.params.name)
        return res.status(200).json("File Uploaded Successfully.");
    } catch (error) {
        console.log(error)

    }
})



// Routes
app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);

app.get('/',(req,res)=>{
    res.send("<h1>hello</h1>");
})

app.listen(8800,()=>{
    console.log("Backend has started on the port 8800")
})