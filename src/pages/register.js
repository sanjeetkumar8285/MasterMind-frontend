import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {ApiBaseUrl} from '../config/ApiBaseUrl';

const Register = () => {
 const navigate=useNavigate();

    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [errInput,setErrInput]=useState({
    errName:"",
    errEmail:"",
    errPassword:""
    })

const handleInput=(e)=>{
let name=e.target.name;
let value=e.target.value
setInput((prev)=>{
    return {...prev,[name]:value}
})
}


const submitFormData=async(e)=>{
e.preventDefault();
if(validForm()){
    const res=await fetch(`${ApiBaseUrl}/adminRegister`,{
        method:"POST",
        Accept:"application/json",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(input)
    })
    const data=await res.json();
    console.log(data)
    if(res.status===400 || !data){
        alert(data.message)
    }else{
        alert(data.message)
         navigate("/")
    }
    }
}



const validForm=()=>{
    let formIsValid=true
    setErrInput({
        nameErr: "",
        emailErr: "",
        passwordErr: ""
    })
    if(input.name===""){
        formIsValid=false
        setErrInput((prev)=>{
            return {...prev,nameErr:"Please Enter Name"}
        })
    }
    if(input.email===""){
        formIsValid=false
        setErrInput((prev)=>{
            return {...prev,emailErr:"Please Enter Email"}
        })
    }
    if(input.password===""){
        formIsValid=false
        setErrInput((prev)=>{
            return {...prev,passwordErr:"Please Enter password"}
        })
    }
    return formIsValid;
  
}

    return (
        <div>
            <div className="container-scroller">
                <div className="container-fluid page-body-wrapper full-page-wrapper">
                    <div className="content-wrapper d-flex align-items-center auth px-0">
                        <div className="row w-100 mx-0">
                            <div className="col-lg-4 mx-auto">
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <div className="brand-logo">
                                        <img src="/assests/images/c-logo.png" alt="logo" />
                                    </div>
                                    <h4>New here?</h4>
                                    <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                                    <form className="pt-3">
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-lg"
                                                name="name"
                                                value={input.name}
                                                placeholder="Name" 
                                                autoComplete='false'
                                                onChange={handleInput}/>
                              {errInput.nameErr?.length > 0 && <span style={{color:"red"}}>{errInput.nameErr}</span>} 
                                        </div>
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-lg"
                                                name="email"
                                                value={input.email}
                                                placeholder="Email"
                                                autoComplete='false'
                                                onChange={handleInput} />
                                 {errInput.emailErr?.length > 0 && <span style={{color:"red"}}>{errInput.emailErr}</span>}      
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-lg"
                                                name="password"
                                                value={input.password}
                                                placeholder="Password"
                                                autoComplete='false'
                                                onChange={handleInput} />
     {errInput.passwordErr?.length > 0 && <span style={{color:"red"}}>{errInput.passwordErr}</span>}  
                                        </div>
                                        <div className="mt-3">
                                            <button type='submit' className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={submitFormData}>SIGN UP</button>
                                        </div>
                                        <div className="text-center mt-4 font-weight-light">
                                            Already have an account? <Link to="/" className="text-primary">Login</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;