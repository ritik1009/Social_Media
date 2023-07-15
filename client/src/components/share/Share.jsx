import { Cancel, EmojiEmotions, Label, PermMedia, Room } from "@mui/icons-material"
import "./share.css"
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { axiosJWT } from "../../apiCalls";

const Share = () => {
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const[file,setFile] = useState(null);
  const submitHandler =async(e)=>{
    e.preventDefault()
    const post ={
      userId:user._id,
      desc:desc.current.value,
    }
    if(file){
      const data = new FormData();
      const fileName = Date.now().toString()+file.name;
      data.append("file",file);
      post.img = "http://localhost:8800/images/" + fileName;
      
      try {
        await axiosJWT.post("http://localhost:8800/api/upload/"+fileName,data);
      } catch (error) {
        console.log(error)
      }
    }
    try {
      await axiosJWT.post("http://localhost:8800/api/post", post);
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img src={user.profilePicture} alt="" className="shareProfileImg" />
          <input
            type="text"
            className="shareInput"
            placeholder="Whats in your mind?"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={()=>setFile(null)}/>
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input style={{display:"none"}} type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e)=>setFile(e.target.files[0])}/>
            </label>
            <div className="shareOption">
              <Label htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="Red" className="shareIcon" />
              <span className="shareOptionText">Locations</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="orange" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
            <button className="shareButton" type='submit'>Share</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Share