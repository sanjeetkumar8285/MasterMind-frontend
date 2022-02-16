import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ApiBaseUrl from '../config/ApiBaseUrl';
import { useNavigate } from 'react-router-dom';
const Login = () => {
const navigate=useNavigate();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const [errInput,setErrInput]=useState({
      emailErr:"",
      passwordErr:""
      })

    const submitFormData=async(e)=>{
            e.preventDefault();
            if(validForm()){
              try{
                const res=await fetch(`${ApiBaseUrl}/adminLogin`,{
                    method:"POST",
                    Accept:"application/json",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                })
                const data=await res.json();
                console.log(data)
                if(res.status===400){
                    alert(data.message)
                }else{
                  localStorage.setItem("token",data.token)
                    alert(data.message)
                     navigate("/dashboard")
                }
              }catch(err){
                console.log(err)
                navigate("/")
              }
          }
    }

    const validForm=()=>{
      let formIsValid=true
      setErrInput({
          emailErr: "",
          passwordErr: ""
      })
      if(email===""){
          formIsValid=false
          setErrInput((prev)=>{
              return {...prev,emailErr:"Please Enter Email"}
          })
      }
      if(password===""){
          formIsValid=false
          setErrInput((prev)=>{
              return {...prev,passwordErr:"Please Enter password"}
          })
      }
      return formIsValid;
    
  }

    return (
        <>
             <div className="container-scroller">
    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="content-wrapper d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src="/assests/images/c-logo.png" alt="logo" />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <form className="pt-3">
                <div className="form-group">
                  <input type="email" className="form-control form-control-lg" 
                  name="email"
                  value={email}
                placeholder="Email"
                onChange={(e)=>{setEmail(e.target.value)}} />
                {errInput.emailErr?.length > 0 && <span style={{color:"red"}}>{errInput.emailErr}</span>} 
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg"
                   name="password"
                   value={password}
                   placeholder="Password"
                   onChange={(e)=>{setPassword(e.target.value)}} />
                   {errInput.passwordErr?.length > 0 && <span style={{color:"red"}}>{errInput.passwordErr}</span>} 
                </div>
                <div className="mt-3">
                  <button type='submit' className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" 
                  onClick={submitFormData}
                  >SIGN IN</button>
                </div>
     
           
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account? <Link to="/register" className="text-primary">Create</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- content-wrapper ends --> */}
    </div>
    {/* <!-- page-body-wrapper ends --> */}
  </div>
        </>
    );
};

export default Login;