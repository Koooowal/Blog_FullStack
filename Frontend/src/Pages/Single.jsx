// src/Pages/Single.jsx
import React from 'react'
import Edit from '../img/edit.png'
import Delete from '../img/delete.png'
import { Link } from 'react-router-dom'
import Logo from '../img/logo.png'
import Menu from '../Components/Menu'
function Single() {
  return (
    <div className="single">
      <div className="content">
        <img src='' alt="" />
        <div className="user">
          <img
            src={Logo}
            alt=""
          />
          <div className="info">
            <span>John</span>
            <p>Posted 2 d ago</p>
          </div>
            <div className="edit">
              <Link to={`/write?edit=2`} >
                <img src={Edit} alt="" />
              </Link>
              <img src={Delete} alt="" />
            </div>
        </div>
        <h1>Title</h1>
        <p> Post text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text </p>
         </div>
      <Menu />
    </div>
  );
};


export default Single