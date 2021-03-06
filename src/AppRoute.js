import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import PropertyType from './pages/propertyType';
import PropertyStatus from './pages/propertyStatus';
import Properties from "./pages/Properties"
import Amenities from './pages/Amenities';
import Blog from './pages/Blog';
import Seller from './pages/Seller';
import Builder from './pages/Builder';
import LoanData from './pages/LoanData';
import BuilderContact from './pages/BuilderContact';
const AppRoute = () => {
    return (
        <>
    <Routes>
  {/* <Route path="/login" exact element={<Login/>}></Route>
  <Route path="/register" element={<Register/>}/>  */}
  <Route path='/dashboard' element={<Dashboard/>}/>
  <Route path="/property" element={<Properties/>}/>
  <Route path='/propertyType' element={<PropertyType/>}/>
  <Route path='/propertyStatus' element={<PropertyStatus/>}/>
  <Route path='/amenities' element={<Amenities/>}/>
  <Route path='/blog' element={<Blog/>}/>
  <Route path='/seller' element={<Seller/>}/>
  <Route path='/builder' element={<Builder/>}/>
  <Route path='/LoanRequestData' element={<LoanData/>}/>
  <Route path='/contactBuilderData' element={<BuilderContact/>}/>
  </Routes>
      </>
    );
};

export default AppRoute;