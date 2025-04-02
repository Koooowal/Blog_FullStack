import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Context/authContext'

function Login() {
  const [inputs,setInputs]= useState({
    username: "",
    password: ""
  })

  const [err,setErr]= useState(null)
  const navigate = useNavigate()
  const {login} = useContext(AuthContext)

  const handleChange = e =>{ 
    setInputs(prev=>({...prev,[e.target.name]: e.target.value}));
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log("Submitting login with data:", inputs);
    try {
      await login(inputs);
      navigate('/');
    } catch (error) {
      setErr(error.response.data);
    }
  }

  return (
    <div className='auth'>
      <h1>Login</h1>
      <form action="">
        <input type="text" placeholder='Username' required name='username' onChange={handleChange}/>
        <input type="password" placeholder='Password' required name='password' onChange={handleChange}/>
        <button type='submit' onClick={handleSubmit}>Login</button>
        {err && <p>This is an error</p>}
        <span>Don't have an account? <Link to='/register'>Register</Link></span>
      </form>
    </div>
  )
}

export default Login