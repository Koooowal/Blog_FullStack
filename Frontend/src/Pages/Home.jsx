// Home.jsx fixed version
import { Link, useLocation } from 'react-router-dom';
import {useState, useEffect} from 'react'
import apiRequest from '../Utility/apiRequest';
import Image from '../Components/Image';

function Home() {
  const category = useLocation().search;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiRequest.get(`/api/posts${category}`);
        
        // Check if response data is an array
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          console.error("API response is not an array:", res.data);
          setPosts([]); // Set to empty array as fallback
          setError("Unexpected data format from server");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  }

  return (
    <div className="home">
      {loading && <p>Loading posts...</p>}
      {error && <p>Error: {error}</p>}
      
      <div className="posts">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="img">
                {post.img && <Image path={post.img} alt="" />}
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <p>{getText(post.desc)}</p>
                <Link to={`/post/${post.id}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          ))
        ) : !loading && (
          <p>No posts found</p>
        )}
      </div>
    </div>
  )
}

export default Home;