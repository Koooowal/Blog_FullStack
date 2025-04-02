import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useState } from 'react'
import apiRequest from '../Utility/apiRequest'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'

function Write() {
  const state = useLocation().state;
  
  const [title, setTitle] = useState(state?.title || "");
  const [value, setValue] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(state?.category || '')
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const upload = async (file) => {
    if (!file) {
      console.error("No file selected for upload.");
      return null;
    }
  
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      const res = await apiRequest.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // ImageKit returns the URL directly
      return res.data;
    } catch (error) {
      console.error("File upload failed:", error);
      setError("File upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!value.trim()) {
      setError("Content is required");
      return;
    }
    
    try {
      let imgUrl = null;
      if (file) {
        imgUrl = await upload(file);
        if (!imgUrl && file) {
          return; // Stop if file upload failed
        }
      }
      
      if (state) {
        await apiRequest.put(`/api/posts/${state.id}`, {
          title,
          desc: value,
          category,
          img: imgUrl
        });
      } else {
        await apiRequest.post('/api/posts', {
          title,
          desc: value,
          category,
          img: imgUrl,
          date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
      }
      navigate('/');
    } catch (error) {
      console.error("Post submission error:", error);
      setError(error.response?.data || "Failed to submit post. Please try again.");
    }
  }

  return (
    <div className='add'>
      {error && <div className="error-message" style={{color: 'red', padding: '10px'}}>{error}</div>}
      <div className="content">
        <input type="text" value={title} placeholder='Title' onChange={e=>setTitle(e.target.value)}/>
        <div className="edit">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span><b>Status: </b>Draft</span>
          <span><b>Visibility: </b>Public</span>
          <input type="file" id="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
          <label className='file' htmlFor="file">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
          {file && <p style={{fontSize: '0.8rem', marginTop: '5px'}}>Selected: {file.name}</p>}
          <div className="buttons">
            <button disabled={uploading}>Save as a draft</button>
            <button onClick={handleSubmit} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Publish'}
            </button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
          <input type="radio" name='cat' checked={category==='art'} value='art' id='art' onChange={e=>setCategory(e.target.value)}/>
          <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
          <input type="radio" name='cat' checked={category==='science'} value='science' id='science' onChange={e=>setCategory(e.target.value)}/>
          <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
          <input type="radio" name='cat' checked={category==='technology'} value='technology' id='technology' onChange={e=>setCategory(e.target.value)}/>
          <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
          <input type="radio" name='cat' checked={category==='cinema'} value='cinema' id='cinema' onChange={e=>setCategory(e.target.value)}/>
          <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
          <input type="radio" name='cat' checked={category==='design'} value='design' id='design' onChange={e=>setCategory(e.target.value)}/>
          <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
          <input type="radio" name='cat' checked={category==='food'} value='food' id='food' onChange={e=>setCategory(e.target.value)}/>
          <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Write