import {db} from '../db.js'
import jwt from 'jsonwebtoken'

export const getPosts = (req, res) => {
  const q = req.query.category 
  ? "SELECT * FROM posts WHERE category=?"
  : "SELECT * FROM posts";

  db.query(q,[req.query.category],(err,data)=>{
    if(err) return res.status(500).json(err);
    
    return res.status(200).json(data);
  })
}

export const getPost = (req, res) => {
  const q =
  "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `category`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
}

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Brak tokena użytkownika.");
    return res.status(401).json("Not authenticated!");
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("Błąd weryfikacji tokena:", err);
      return res.status(403).json("Token is not valid!");
    }

    console.log("Dane użytkownika:", userInfo);

    const q = "INSERT INTO posts(`title`, `desc`, `img`, `date`, `uid`, `category`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.date,
      userInfo.id,
      req.body.category
    ];

    console.log("Dane do zapytania:", values);

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("Błąd podczas zapisu do bazy danych:", err);
        return res.status(500).json(err);
      }

      console.log("Post został zapisany:", data);
      return res.json("Post has been created.");
    });
  });
}

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("Not authenticated!")
  
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if(err) return res.status(403).json("Token is not valid!")
    
    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");
      return res.json("Post has been deleted.");
    });
  })
}

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("Not authenticated!")
  
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if(err) return res.status(403).json("Token is not valid!")
    const postId = req.params.id;
    const q = "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `category`=? WHERE `id` = ? AND `uid` = ?";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.category
    ];

    db.query(q, [...values,postId,userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  })
}