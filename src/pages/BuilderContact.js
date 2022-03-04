import React,{useEffect,useState } from 'react';
import ReactPaginate from "react-paginate";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {Button,Modal} from 'react-bootstrap'
import { BaseUrl } from '../config/ApiBaseUrl';
import { ToastContainer, toast } from 'react-toastify';
const BuilderContact = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [mailData,setMailData]=useState({})

    const [open, setOpen] = useState({show:false,id:null});
    const [contactBuilder,setContactBuilder]=useState({});
    const [search,setSearch]=useState("")
    const handleClickOpen = (id) => {
      setOpen({show:true,id});
    };
    const handleClickClose = () => {
      setOpen({show:false,id:null});
    };
   

    const showData=async()=>{
        try{
    const res=await fetch(`${BaseUrl}/contactBuilder?page=1`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data=await res.json();
    if(res.status===400 || !data){
    
    }
    else{
        setContactBuilder(data)
    }
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        showData()
    },[])
    
   
  const deleteContactBuilder=async()=>{
    try{
        const res=await fetch(`${BaseUrl}/contactBuilder/${open.id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
            }
        })
        const data=await res.json();
        if(res.status===400 || !data){
            toast.error(data.message)
        }else{
        toast.success(data.message,{
            position: "top-center",
            autoClose: 4000,
        })
        setOpen({show:false,id:null})
        showData();
        }
                }catch(err){
        console.log(err)
        toast.error(err)
                }
  }
  const fetchLoanData = async (currentPage) => {
    try{
      const res=await fetch(`${BaseUrl}/contactBuilder?page=${currentPage}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        },
      })
    const data = await res.json();
    return data;
  }catch(err){
    console.log(err)
  }
}
  const handlePageClick=async(data)=>{
    let currentPage = data.selected + 1;
    const dataFromServer = await fetchLoanData(currentPage);
    setContactBuilder(dataFromServer);
  }

  const searchData=async()=>{
    try{
      const res=await fetch(`${BaseUrl}/getLoan?keyword=${search}`,{
        method:"GET",
     
        headers:{
            "Content-Type":"application/json",
        }
      })
      const data=await res.json();
      if(res.status===400 || !data){
        console.log(data.message)
      }else{
        setContactBuilder(data)
      }
    }catch(err){
      console.log(err)
    }
  }

  const SendMail=async()=>{
    console.log("clcike")
    try{
const res=await fetch(`${BaseUrl}/sendMail`,{
  method:"POST",
  headers:{
      "Content-Type":"application/json"
  },
  body:JSON.stringify({
      name:mailData.name,
      email:mailData.email,
      subject:mailData.subject,
      message:mailData.messages,
  })
})
const data=await res.json();
console.log(data)
if(res.status===400 || !data){
  toast.error(data.message)
}
else{
  toast.success(data.message, {
      position: "top-center",
      autoClose: 4000,
      });
      handleClose();
}
    }catch(err){
        toast.error(err)
    }
}

const handleInput=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setMailData((prev)=>{
        return {...prev,[name]:value}
    })
}

    return (
        <>
         <Dialog
    open={open.show}
    onClose={handleClickClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"Are you Sure want to Delete ?"}
    </DialogTitle>
   
    <DialogActions>
      <Button onClick={handleClickClose}>Cancel</Button>
      <Button onClick={deleteContactBuilder} autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog> 

        <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">

          <div className="col-md-12 grid-margin">
                  <div className="row">
                  <div className="col-xl-4">
                    <div className="form-group" style={{display:"flex"}}>
                    <input type="search" className="form-control" placeholder="Search" 
                    onChange={(e)=>{setSearch(e.target.value)}}
                    onKeyPress={(e)=>{e.key==="Enter" && searchData()}}/>
                    <button onClick={searchData} className="btn btn-success">Search</button>
                    </div>
                    </div>
                    </div>
                    </div>
          <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Contact Builder Queries</h4>
                  <p className="card-description">
                  Queries List
                  </p>
                  <div className="table-responsive pt-3">
                  <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile No.</th>
                          <th>Message</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          contactBuilder.data?.map((data,index)=>{
                            return (
                              <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <td>{data.name}</td>
                              <td>{data.email}</td>
                              <td>{data.phone}</td>
                              <td>{data.message}</td>
                <td><div className='content'>
                <button className='btn btn-sm' title='Send Mail' style={{backgroundColor:"white"}}  onClick={() => {
                   handleShow();
                   setMailData(data) }}><i className="fas fa-solid fa-envelope" style={{color:"red"}}></i>
              </button>
          <button className='btn btn-sm' title='Send Mail' style={{backgroundColor:"white"}}  onClick={() => {
                   handleClickOpen(data._id) }}><i className="fas fa-trash" style={{color:"red"}}></i>
              </button>  </div></td>
                            </tr>
                            )
                          })
                        }
                         <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>Send Mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
        <div className="row">
        <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                className="form-control"
                value={mailData.name || ""}
                name="name"
                disabled
              />
            </div>
            </div>
            </div>
            <div className='row'>
            <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="contact">Email Id</label>
              <input
                type="email"
                className="form-control"
                value={mailData.email || ""}
                name="phone"
                disabled
              />
            </div>
            </div>
            </div>
            <div className='row'>
            <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="contact">Subject</label>
              <input
                type="email"
                className="form-control"
                value={mailData.subject || ""}
                name="subject"
                onChange={handleInput}
              />
            </div>
            </div>
            </div>

            <div className='row'>
                <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="about">Message</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="messages"
                    rows="4" value={mailData.messages || ""} onChange={handleInput} ></textarea>
            </div>
            </div>
            </div>

                  
     
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={SendMail}>
            Send Mail
          </Button> 
        </Modal.Footer>
      </Modal>

                      </tbody>
                    </table>
                  </div>
                </div>
                <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={contactBuilder.numberofPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
              </div>
            </div>
       </div>
       </div>
       </div> 
       <ToastContainer/>
       </>
    );
};

export default BuilderContact;