import React from 'react';
import './App.css';
import Header from './partials/Header';
import Sidebar from './partials/Sidebar';
import AppRoute from './AppRoute';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
  <>
   <div class="container-scroller">
        <Header/>
      <div class="container-fluid page-body-wrapper">
            <Sidebar/>
            <AppRoute/>
             </div>
             </div>
    
  </>

  );
  
}


export default App;
