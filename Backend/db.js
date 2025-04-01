import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'blog',
  port: 3308
});


db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    console.log('Please make sure MySQL server is running and the database exists');
  } else {
    console.log('Connected to MySQL database successfully');
  }
});