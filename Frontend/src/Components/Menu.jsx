import React from 'react';
import { useState, useEffect } from 'react';
import apiRequest from '../Utility/apiRequest';
import { Link } from 'react-router-dom';

function Menu({ category }) {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest.get(`/api/posts/?cat=${category}`);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [category]);
  
  return (
    <div className='menu'>
      <h1>Other posts you may like</h1>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          {/* Display ImageKit image directly from URL */}
          {post.img && <img src={post.img} alt="" />}
          <h2>{post.title}</h2>
          <Link to={`/post/${post.id}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Menu;