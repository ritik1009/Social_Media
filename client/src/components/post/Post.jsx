import { MoreVert } from '@mui/icons-material';
import './post.css';
// import {Users} from '../../dummyData';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {format} from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Post = ({post_data}) => {
  const[like,setLike] = useState(post_data.likes.length)
  const[isliked,setisliked] = useState(false)
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [user,setUser] = useState({})
  const {user:currentUser} = useContext(AuthContext)

  useEffect(() => {
    setisliked(post_data.likes.includes(currentUser._id));
  }, [currentUser._id, post_data.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/user?userId=${post_data.userId}`
      );
      console.log("user_data", res);
      setUser(res.data);
    };
    fetchUser();
  }, [post_data.userId]);
  const likeHandler = async()=>{
    try {
      await axios.put(`http://localhost:8800/api/post/like/${post_data._id}`,{userId:currentUser._id});
    } catch (error) {
      console.log(error)
    }
    setLike(likeCount=>(isliked?likeCount-1:likeCount+1))
    setisliked(!isliked)
  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={user.profilePicture || PF + "person/noAvatar.jpg"}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post_data.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert className="postTopRightIcon" />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post_data?.desc}</span>
          <img src={post_data.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              onClick={likeHandler}
              src="/assets/like.png"
              alt=""
            />
            <img
              className="likeIcon"
              src="/assets/heart.png"
              alt=""
              onClick={likeHandler}
            />
            <span className="postLikedCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentCount">
              {post_data.comments.length} Comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post