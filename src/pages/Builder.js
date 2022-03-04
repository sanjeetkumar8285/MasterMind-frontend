import React,{
    useEffect, 
    useState,
    useImperativeHandle,
    useRef, 
   forwardRef} from 'react';
   import ReactPaginate from "react-paginate";
  import {ApiBaseUrl} from '../config/ApiBaseUrl';
  import {Button,Modal} from 'react-bootstrap'
  import { ToastContainer, toast } from 'react-toastify';
  import Dialog from '@mui/material/Dialog';
  import DialogActions from '@mui/material/DialogActions';
  import DialogTitle from '@mui/material/DialogTitle';


const Builder = () => {

     //this state is used to hide and show modal
     const [show, setShow] = useState(false);
     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);
   
     const formUpdateRef=useRef();
   
     const [open, setOpen] = useState({show:false,id:null}); // this state is used for open dialog box for delete
   
     const handleClickOpen = (id) => {
       setOpen({show:true,id});
     };
   
     const handleClickClose = () => {
       setOpen({show:false,id:null});
     };
   
   const token=localStorage.getItem("token")
   
   const [builderData,setBuilderData]=useState({}) // used for storeing seller Api data
   const [builder,setBuilder]=useState({}) // this state is used for storing seller formData
   const [search,setSearch]=useState("");
   
   useEffect(()=>{
   showData();
   },[])
   
       const showData=async()=>{
           try{
   const res=await fetch(`${ApiBaseUrl}/builder?page=1`,{
       method:"GET",
       headers:{
           "Content-Type":"application/json",
           "authorization":token
       }
   })
   const data=await res.json();
   if(res.status===400 || !data){
       console.log(data.message)
       alert(data.message)
   }else{
   setBuilderData(data)
   }
           }catch(err){
               console.log(err)
               toast.error(err)
   
           }
       }

       const handleInput=(e)=>{
        let name=e.target.name
        let value=e.target.value
        setBuilder((prev)=>{
    return {...prev,[name]:value}
    })
    }

    const deleteBuilder=async()=>{
        try{
          
          const res=await fetch(`${ApiBaseUrl}/builder/${open.id}`,{
            method:"DELETE",
            headers:{
              "Content-Type":"application/json",
              "authorization":token
            }
          })
          const data=  await res.json();
          if(res.status===400 || !data){
            toast.error(data.message)
          }
          else{
            toast.success(data.message, {
              position: "top-center",
              autoClose: 4000,
              });
             setOpen({show:false,id:null})
            showData();
          }
        }catch(err){
          console.log(err)
            toast.error(err)
        }
      }

       const saveData=async(e)=>{
        e.preventDefault();
        const {builderName,contactNo,about,status}=builder
        try{
          const res=await fetch(`${ApiBaseUrl}/builder`,{
            method:"POST",
            Accept:"application/json",
            headers:{
              "Content-Type":"application/json",
              "authorization":token
            },
            body:JSON.stringify({
                builderName,contactNo,about,status
            })
          })
          const data=  await res.json();
         
          if(res.status===400 || !data){
            toast.error(data.message)
          }
          else{
            toast.success(data.message, {
              position: "top-center",
              autoClose: 4000,
              });
              setBuilder({}) //set state to null
            handleClose();
            showData();
          }
        }catch(err){
          console.log(err)
          toast.error(err)
        }
            }
            const fetchBuilder = async (currentPage) => {
              try{
                const res=await fetch(`${ApiBaseUrl}/builder?page=${currentPage}`,{
                  method:"GET",
                  headers:{
                      "Content-Type":"application/json",
                      "authorization":token
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
              const dataFromServer = await fetchBuilder(currentPage);
        
              setBuilderData(dataFromServer);
            }
        
            const searchData=async()=>{
              try{
                const res=await fetch(`${ApiBaseUrl}/getBuilder?keyword=${search}`,{
                  method:"GET",
                  headers:{
                      Accept:"application/json",
                      "Content-Type":"application/json",
                      "authorization":token
                  },
                })
                const data=await res.json();
                if(res.status===400 || !data){
                  console.log(data.message)
                  alert(data.message)
                }else{
                  setBuilderData(data)
                }
              }catch(err){
                console.log(err)
              }
            }
        
    return (
        <>
             <UpdateForm ref={formUpdateRef} showData={showData}/>

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
 <Button onClick={deleteBuilder} autoFocus>
   Yes
 </Button>
</DialogActions>
</Dialog>

             <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">
    
          <div className="col-md-12 grid-margin d-flex">
        
                    <div className="col-xl-4">

                    <div className="form-group" style={{display:"flex"}}>
                    <input type="search" className="form-control" placeholder="Search" 
                    onChange={(e)=>{setSearch(e.target.value)}}
                    onKeyPress={(e)=>{e.key==="Enter" && searchData()}}/>
                    <button onClick={searchData} className="btn btn-success">Search</button>
                    </div>
                 
                    </div>
                    <div className="col-12 col-xl-4 " style={{position: "relative",left: "50%"}} >
                    <Button variant="primary" style={{color:"white"}} onClick={handleShow}>
                    <i className="fas fa-plus"/> Add New
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>Add Builder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
        <div className="row">
        <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="Builder Name">Builder Name</label>
              <input
                type="text"
                className="form-control"
                value={builder.builderName}
                name="builderName"
                onChange={handleInput}
                placeholder="Builder Name"
              />
            </div>
            </div>
            </div>
            <div className='row'>
            <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="contact">Builder Contact No.</label>
              <input
                type="number"
                className="form-control"
                value={builder.contactNo}
                name="contactNo"
                onChange={handleInput}
              />
            </div>
            </div>
            </div>

            <div className='row'>
                <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="about">About Builder</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="about"
                    rows="4" value={builder.about || ""} onChange={handleInput} ></textarea>
            </div>
            </div>
            </div>

                    <div className='row'>
                <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="Builder Status">Status</label>
              <select
                className="form-control" 
                value={builder.status || ""}
                name="status"
                onChange={handleInput}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            </div>
            </div>
     
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveData}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
                    </div>
                
     
                  </div>
                </div>


            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Builder</h4>
                  <p className="card-description">
                  Builder List
                  </p>
                  <div className="table-responsive pt-3">
                  <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Builder Name</th>
                          <th>Contact No</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          builderData.data?.map((data,index)=>{
                            return (
                              <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <td>{data.builderName}</td>
                              <td>{data.contactNo}</td>
                              <td>{data.status ? "Active" :"Inactive"}</td>
    
                <td><div className='content'>
          <Button className='btn btn-sm' style={{backgroundColor:"white"}}  onClick={() => {
                          formUpdateRef.current.openForm(data);
                        }}><i className="fas fa-edit"></i></Button>
          <Button className='btn btn-sm' variant="outlined" style={{backgroundColor:"white"}} onClick={()=>{handleClickOpen(data._id)}} >
          <i className="fas fa-trash" style={{color:"red"}}></i>
              </Button>
             
                </div></td>
                            </tr>
                            )
                          })
                        }
                      
                      </tbody>
                    </table>
                  </div>
                </div>
                <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(builderData.numberofPage)}
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
    
     <ToastContainer/>
        </>
    );
};

const UpdateForm = forwardRef((props, ref) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const [builder,setBuilder]=useState({});
    const { showData } = props;
    const token=localStorage.getItem("token")
  
  
    const handleInput=(e)=>{
      let name=e.target.name
      let value=e.target.value
  setBuilder((prev)=>{
  return {...prev,[name]:value}
  })
  }
  
    useImperativeHandle(ref, () => ({
      openForm(dt) {
        if (dt?._id) {
          setBuilder(dt)
        } else {
          setBuilder({})
        }
      handleShow();
      },
    }));
  
    const updateData=async(e)=>{
        e.preventDefault();
        const {_id,builderName,contactNo,about,status}=builder
        try{
          const res=await fetch(`${ApiBaseUrl}/builder/${_id}`,{
            method:"PUT",
            Accept:"application/json",
            headers:{
                "Content-Type":"application/json",
              "authorization":token
            },
            body:JSON.stringify({
                builderName,contactNo,about,status
            })
          })
          const data= await res.json();
         
          if(res.status===400 || !data){
            toast.error(data.message)
          }
          else{
            toast.success(data.message, {
              position: "top-center",
              autoClose: 4000,
              });
            handleClose();
            showData();
          }
        }catch(err){
          console.log(err)
          toast.error(err)
        }
            }
  
  
  
    return (
      <>
   <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>Update Builder Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
        <div className="row">
        <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="Builder Name">Builder Name</label>
              <input
                type="text"
                className="form-control"
                value={builder.builderName}
                name="builderName"
                onChange={handleInput}
                placeholder="Builder Name"
              />
            </div>
            </div>
            </div>
            <div className='row'>
            <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="contact">Builder Contact No.</label>
              <input
                type="number"
                className="form-control"
                value={builder.contactNo}
                name="contactNo"
                onChange={handleInput}
              />
            </div>
            </div>
            </div>

            <div className='row'>
                <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="about">About Builder</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="about"
                    rows="4" value={builder.about} onChange={handleInput} ></textarea>
            </div>
            </div>
            </div>

                    <div className='row'>
                <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="Builder Status">Status</label>
              <select
                className="form-control" 
                value={builder.status}
                name="status"
                onChange={handleInput}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            </div>
            </div>
     
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateData}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
  });
export default Builder;