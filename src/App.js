import React,{createContext,useEffect,useReducer} from 'react';
import './App.css';
import Header from './partials/Header';
import Sidebar from './partials/Sidebar';
import AppRoute from './AppRoute';
import 'react-toastify/dist/ReactToastify.css';
import { Routes,Route,useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';


function App() {
  const navigate=useNavigate();
useEffect(()=>{
  const token=localStorage.getItem("token")
  if(!token){
    navigate("/login")
  }
},[])
  return (
  <>

  <Routes>
  <Route path="/login" exact element={<Login/>}/>
  <Route path="/register" element={<Register/>}/> 
  </Routes>
   <div className="container-scroller">
        <Header/>
      <div className="container-fluid page-body-wrapper">
            <Sidebar/>
            <AppRoute/>
             </div>
             </div>

  </>

  );
  
}



export default App;
