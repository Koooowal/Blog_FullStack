import {createBrowserRouter, RouterProvider,Route} from 'react-router-dom'
import "./style.scss";
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Write from './Pages/Write'
import Single from './Pages/Single'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return(
    <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
  )
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/post/:id",
        element: <Single/>,
      },
      {
        path: "/write",
        element: <Write/>,
      },
    ]
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

function App() {
  return (
    <div className='app'>
      <div className='container'>
        <RouterProvider router={router} />
      </div>
    </div>
  )
}



export default App
