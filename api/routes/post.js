const router = require('express').Router();
const Post = require('../models/post')
const User = require('../models/users')
const {verify} = require('../utils')

// Create a post

router.post('/',verify,async(req,res)=>{
    // console.log(req.body)
    const newPost = new Post(req.body)
    console.log(newPost)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})




// Delete a post

router.delete('/:id/like',verify,async(req,res)=>{
    try{
        const postId = req.params.postId
        const post = Post.findById(postId)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("Post has been Deleted")
        }
        else{
            res.status(403).json("You cannot delete the post")
        }
    }catch{
        res.status(500).json(error)
    }
})


// like a post

router.put('/like/:postId',verify,async(req,res)=>{
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("Post has been Liked");
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been DisLiked");
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

// Update a post

router.put('/:postId',verify,async(req,res)=>{
    try{
        console.log("PostId",postId)
        const postId = req.params.postId
        const post = Post.findById(postId)
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post has been updated")
        }
        else{
            res.status(403).json("You cannot update the post")
        }
    }catch(error){
        res.status(500).json(error)
    }
})

// comment a post
// get a post

router.get('/:id',verify,async(req,res)=>{
    try {
        const postId = req.params.id
        const postData = await Post.findById(postId)
        res.status(200).json(postData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/profile/:username',verify,async(req,res)=>{
    try {
        const user =await User.findOne({username:req.params.username});
        const post = await Post.find({userId:user._id});
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)     
    }
})

// get timeline posts

router.get("/:id/timeline",verify,async(req,res)=>{
    try {
        const currentUser = await User.findById(req.params.id)
        const userPost = await Post.find({userId:req.params.id})
        const friendsPost = await Promise.all(
            currentUser.following.map((friendId)=>{
                return Post.find({userId:friendId})
            })
            )
        res.status(200).json(userPost.concat(...friendsPost))
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})



module.exports = router