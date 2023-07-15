import { Link } from "react-router-dom";
import "./topbar.css"
import { Chat, Notifications, Person, Search } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
const Topbar = () => {
  const {user} = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const logoutFunc = ()=>{
    localStorage.clear()
    window.location.reload()
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/">
          <span className="logo">Nerdsocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            type="text"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">4</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">4</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">4</span>
          </div>
          <div className="topbarIconItem" onClick={logoutFunc}>
            <LogoutIcon/>
          </div>
        </div>

        <Link to={"/profile/" + user.username}>
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : `${PF}/assets/person/noAvatar.jpg`
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}

export default Topbar