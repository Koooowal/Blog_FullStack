import { Link } from 'react-router-dom';
import {useState,useEffect} from 'react'
import apiRequest from '../Utility/apiRequest';

function Home() {
  
  const [posts,setPosts] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const res = await apiRequest.get('/posts');
        setPosts(res.data);
      } catch (error) {
        console.log(err);
      }
    };
    fetchData();
  },[])

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={post.img} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              <button>Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home