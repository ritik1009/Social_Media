const router = require('express').Router();
const User = require('../models/users')
const bcrypt = require('bcrypt');
const {verify} = require("../utils")


// Updating the User Details
router.put('/:id',verify, async (req,res)=>{
    console.log("user")
    const user = await User.findById(req.params.id)
    if(req.body.userId===req.params.id || user.isAdmin ){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("Account has been Updated")
        }
        catch(err){
                return res.status(500).json(err);
            }
    }
})

// Deleting the User
router.delete('/:id',verify, async (req,res)=>{
    const user = await User.findById(req.params.id)
    if(req.body.userId===req.params.id || user.isAdmin ){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been Deleted")
        }
        catch(err){
                return res.status(500).json(err);
            }
    }else{
        req.statusCode(403).json("You can delete only your account")
    }
})

// Get a user data
router.get('/',verify,async(req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    console.log("Useranme",userId)
    try{
        const user = userId? await User.findById(userId): await User.findOne({username:username})
        const{password,updatedAt,...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        console.log(err)
        res.status(403).json(err)
    }
})

// get Friends
router.get("/friends/:userId",async(req,res)=>{
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map(friendId=>{
                return User.findById(friendId)
            })
        )
        let friendList = []
        friends.map(friend=>{
            const {_id,username,profilePicture} = friend;
            friendList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendList)
    } catch (error) {
        console.log(error)
        
    }
})



// Follow a User

router.put('/:id/follow',async(req,res)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await  user.updateOne({$push:{followers:req.body.userId}});
                await  currentUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("user has been Followed")
            }else{
                res.status(403).json("You have already Followed the User")
            }
        }catch(err){
            console.log("ERRRRRRR",err)
            res.status(403).json("you cannot follow yourself")
        }
    }
})

router.put('/:id/unfollow',async(req,res)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await  user.updateOne({$pull:{followers:req.body.userId}});
                await  currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("user has been Unfollowed")
            }else{
                res.statusCode(403).json("You have already Unfollowed the User")
            }
        }catch(err){
            res.status(403).json("you cannot Unfollow yourself")
        }
    }
})

module.exports = router