import './rightbar.css'
import {Users} from '../../dummyData';
import Online from '../online/Online';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';
import { axiosJWT } from '../../apiCalls';
const Rightbar = ({user}) => {
  const{user:currentUser,dispatch} = useContext(AuthContext)
  const [friends,setFriends] = useState([])
  const [followed, setFollowed] = useState(currentUser.following.includes(user?.id)
  );

  useEffect(()=>{
    setFollowed(currentUser.following.includes(user?.id));
  },[currentUser,user])

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await axios.get(
          `http://localhost:8800/api/user/friends/${user._id}`,
        );
        setFriends(friendsList.data);
      } catch (error) {
        console.log(error)
      };
      
    };
    getFriends();
  }, [user]);

  const handleClick = async ()=>{
    try {
      if(followed){
        await axios.put(`http://localhost:8800/api/user/${user._id}/unfollow`,{userId:currentUser._id});
        dispatch({type:"UNFOLLOW",payload:user._id})
      }else{
        await axios.put(`http://localhost:8800/api/user/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error)
      
    }
    setFollowed(!followed)
  }
  const HomeRightbar = ()=>{
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today
          </span>
        </div>
        <img src="assets/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  }
  const ProfileRightbar = ()=>{
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">MyInfo</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Followings</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => {
            return (
              <Link key={friend._id} to={`/profile/${friend.username}`}>
                <div className="rightbarFollowing">
                  <img
                    src={friend.profilePicture}
                    className="rightbarFollowingImg"
                    alt=""
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </>
    );
  }
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user?<ProfileRightbar/>:<HomeRightbar/>}
      </div>
    </div>
  );
}

export default Rightbar