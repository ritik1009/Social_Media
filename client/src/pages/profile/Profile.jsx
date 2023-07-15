import Feed from '../../components/feed/Feed'
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import './profile.css'
import Rightbar from '../../components/rightbar/Rightbar';
import { useEffect, useState } from 'react';
import { axiosJWT } from '../../apiCalls';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const {username} = useParams()
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosJWT.get(
        `http://localhost:8800/api/user?username=${username}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [username]);
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={user.coverPicture}
                alt=""
                className="profileCoverImg"
              />
              <img
                src={user.profilePicture}
                alt=""
                className="profileUserImg"
              />
            </div>
            <div className="profileInfo">
                <h4 className='profileInfoname'>{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={user.username}/>
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile