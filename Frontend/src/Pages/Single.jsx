// src/Pages/Single.jsx
import React, { useContext } from 'react'
import Edit from '../img/edit.png'
import Delete from '../img/delete.png'
import { Link,useLocation,useNavigate} from 'react-router-dom'
import Menu from '../Components/Menu'
import {useState,useEffect} from 'react'
import apiRequest from '../Utility/apiRequest';
import moment from 'moment'
import { AuthContext } from '../Context/authContext';

function Single() {
  const location = useLocation();
  const [post,setPost] = useState({});
  const postId = location.pathname.split('/')[2];
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await apiRequest.delete(`/posts/${postId}`);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg && <img
            src={post?.userImg}
            alt=""
          />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
            {currentUser.username === post.username && <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img src={Delete} alt="" onClick={handleDelete}/>
            </div>}
        </div>
        <h1>{post.title}</h1>
        {post.desc}
         </div>
      <Menu cat={post.category}/>
    </div>
  );
};


export default Single