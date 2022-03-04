import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <>
            <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="mdi mdi-home menu-icon"></i>
              <span className="menu-title">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
              <i className="mdi mdi-circle-outline menu-icon"></i>
              <span className="menu-title">Properties</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-basic">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className="nav-link" to="/property">Property</Link></li>
                <li className="nav-item"> <Link className="nav-link" to="/propertyType">Add Property Type</Link></li>
                <li className="nav-item"> <Link className="nav-link" to="/propertyStatus">Add Property Status</Link></li>
                <li className="nav-item"> <Link className="nav-link" to="/amenities">Add Amenities</Link></li>
              </ul>
            </div>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/seller">
            <i className="mdi mdi-account menu-icon"></i>
              <span className="menu-title">Seller</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/builder">
              <i className="mdi mdi-account menu-icon"></i>
              <span className="menu-title">Builder</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/blog">
              <i className="mdi mdi-blogger menu-icon"></i>
              <span className="menu-title">Blogs</span>
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="collapse" href="#customer" aria-expanded="false" aria-controls="ui-basic">
              <i className="mdi mdi-account-star menu-icon"></i>
              <span className="menu-title">Customer Queries</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="customer">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className="nav-link" to="/LoanRequestData">Loan Queries</Link></li>
                <li className="nav-item"> <Link className="nav-link" to="/contactBuilderData">Contact Builder Queries</Link></li>
              </ul>
            </div>
          </li>

        </ul>
      </nav>
        </>
    );
};

export default Sidebar;