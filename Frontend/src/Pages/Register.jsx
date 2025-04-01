import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import apiRequest from '../Utility/apiRequest'
import { useNavigate } from 'react-router-dom'

function Register() {

  const [inputs,setInputs]= useState({
    username: "",
    email: "",
    password: ""
  })

  const [err,setErr]= useState(null)
  const navigate = useNavigate()

  const handleChange = e =>{ 
    setInputs(prev=>({...prev,[e.target.name]: e.target.value}));
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log("Submitting registration with data:", inputs);
    try {
      await apiRequest.post('/auth/register', inputs);
      navigate('/login');
    } catch (error) {
      setErr(error.response.data);
    }
  }

  return (
    <div className='auth'>
      <h1>Register</h1>
      <form action="">
        <input type="text" placeholder='Username' required onChange={handleChange} name='username'/>
        <input type="email" placeholder='Email' required onChange={handleChange} name='email'/>
        <input type="password" placeholder='Password' required onChange={handleChange} name='password'/>
        <button type='submit' onClick={handleSubmit}>Login</button>
        {err && <p>{err}</p>}
        <span>Already have an account? <Link to='/login'>Login</Link></span>
      </form>
    </div>
  )
}

export default Register