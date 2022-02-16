import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import PropertyType from './pages/propertyType';
import PropertyStatus from './pages/propertyStatus';
import Properties from "./pages/Properties"
import Amenities from './pages/Amenities';
import Testing from './pages/Testing';

const AppRoute = () => {
    return (
        <>
    <Routes>
  <Route path="/login" exact element={<Login/>}></Route>
  <Route path="/register" element={<Register/>}/> 
  <Route path='/dashboard' element={<Dashboard/>}/>
  <Route path="/property" element={<Properties/>}/>
  <Route path='/propertyType' element={<PropertyType/>}/>
  <Route path='/propertyStatus' element={<PropertyStatus/>}/>
  <Route path='/amenities' element={<Amenities/>}/>
  <Route path='/testing' element={<Testing/>}/>
  </Routes>

      </>
    );
};

export default AppRoute;