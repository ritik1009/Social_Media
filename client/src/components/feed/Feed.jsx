import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { axiosJWT } from "../../apiCalls";
// import {Posts} from '../../dummyData'

const Feed = ({username}) => {
  const { user } = useContext(AuthContext);
  const [post,setPost] = useState([])
  useEffect(() => {
    const fetchPost = async () => {
      const res = username
        ? await axiosJWT.get(
            "http://localhost:8800/api/post/profile/" + username
          )
        : await axiosJWT.get(
            `http://localhost:8800/api/post/${user._id}/timeline`
          );
      setPost(res.data.sort((p1,p2)=>{
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }));
    };
    fetchPost();
  }, [user.username, user._id,username]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username)?<Share />:null}
        {post.map((post_data )=>(
          <Post key={post_data._id} post_data={post_data}/>
        ))}
      </div>
    </div>
  );
};

export default Feed;
