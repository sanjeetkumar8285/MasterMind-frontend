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

const Seller = () => {

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

const [sellerData,setSellerData]=useState({}) // used for storeing seller Api data
const [seller,setSeller]=useState({}) // this state is used for storing seller formData
const [search,setSearch]=useState("");

useEffect(()=>{
showData();
},[])

    const showData=async()=>{
        try{
const res=await fetch(`${ApiBaseUrl}/seller?page=1`,{
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
setSellerData(data)
}
        }catch(err){
            console.log(err)
            toast.error(err)
        }
    }

    const handleInput=(e)=>{
        let name=e.target.name
        let value=e.target.value
        setSeller((prev)=>{
    return {...prev,[name]:value}
    })
    }

    const deleteSeller=async()=>{
        try{
          
          const res=await fetch(`${ApiBaseUrl}/seller/${open.id}`,{
            method:"DELETE",
            headers:{
              "Content-Type":"application/json",
              "authorization":token
            }
          })
          const data=  await res.json();
          if(res.status===400 || !data){
            alert(data.message)
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
const {sellerName,contactNo,dealsIn,areaOfOperation,about,status}=seller
try{
  const res=await fetch(`${ApiBaseUrl}/seller`,{
    method:"POST",
    Accept:"application/json",
    headers:{
      "Content-Type":"application/json",
      "authorization":token
    },
    body:JSON.stringify({
    sellerName,contactNo,dealsIn,areaOfOperation,about,status
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
      setSeller({}) //set state to null
    handleClose();
    showData();
  }
}catch(err){
  console.log(err)
  toast.error(err)
}
    }
    const fetchSeller = async (currentPage) => {
      try{
        const res=await fetch(`${ApiBaseUrl}/seller?page=${currentPage}`,{
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
      const dataFromServer = await fetchSeller(currentPage);

      setSellerData(dataFromServer);
    }

    const searchData=async()=>{
      try{
        const res=await fetch(`${ApiBaseUrl}/getSeller?keyword=${search}`,{
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
          setSellerData(data)
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
 <Button onClick={deleteSeller} autoFocus>
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
        keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Seller</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
        <div className="row">
        <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="seller Name">Seller Name</label>
              <input
                type="text"
                className="form-control"
                value={seller.sellerName}
                name="sellerName"
                onChange={handleInput}
                placeholder="Seller Name"
              />
            </div>
            </div>
            <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="seller Name">Seller Contact No.</label>
              <input
                type="number"
                className="form-control"
                value={seller.contactNo}
                name="contactNo"
                onChange={handleInput}
              />
            </div>
            </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                <div className="form-group ">
              <label htmlFor="Deals In">Deals In</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="dealsIn"
                    rows="4" value={seller.dealsIn} onChange={handleInput} ></textarea>
            </div>
            </div>
            <div className='col-md-6'>
                <div className="form-group ">
              <label htmlFor="Deals In">Area Of Operation</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="areaOfOperation"
                    rows="4" value={seller.areaOfOperation} onChange={handleInput} ></textarea>
            </div>
            </div>
            </div>

            <div className='row'>
            <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="Deals In">About Seller Details</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="about"
                    rows="5" value={seller.about} onChange={handleInput} placeholder="About Seller Details" ></textarea>
            </div>
            </div>
            </div>
                    <div className='row'>
                <div className='col-md-6'>
                <div className="form-group ">
              <label htmlFor="seller Status">Status</label>
              <select
                className="form-control" 
                value={seller.status || ""}
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
                  <h4 className="card-title">Seller</h4>
                  <p className="card-description">
                  Seller List
                  </p>
                  <div className="table-responsive pt-3">
                  <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>seller Name</th>
                          <th>Contact No</th>
                          <th> Deals In</th>
                          <th> Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          sellerData.data?.map((data,index)=>{
                            return (
                              <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <td>{data.sellerName}</td>
                              <td>{data.contactNo}</td>
                              <td>{data.dealsIn}</td>
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
        pageCount={Math.ceil(sellerData.numberofPage)}
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
  
    const [seller,setSeller]=useState({});
    const { showData } = props;
    const token=localStorage.getItem("token")
  
  
    const handleInput=(e)=>{
      let name=e.target.name
      let value=e.target.value
  setSeller((prev)=>{
  return {...prev,[name]:value}
  })
  }
  
    useImperativeHandle(ref, () => ({
      openForm(dt) {
        if (dt?._id) {
          setSeller(dt)
        } else {
          setSeller({})
        }
      handleShow();
      },
    }));
  
    const updateData=async(e)=>{
        e.preventDefault();
        const {_id,sellerName,contactNo,dealsIn,areaOfOperation,about,status}=seller
        try{
          const res=await fetch(`${ApiBaseUrl}/seller/${_id}`,{
            method:"PUT",
            Accept:"application/json",
            headers:{
                "Content-Type":"application/json",
              "authorization":token
            },
            body:JSON.stringify({
                sellerName,contactNo,dealsIn,areaOfOperation,about,status
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
        keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Seller Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
        <div className="row">
        <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="seller Name">Seller Name</label>
              <input
                type="text"
                className="form-control"
                value={seller.sellerName}
                name="sellerName"
                onChange={handleInput}
                placeholder="Seller Name"
              />
            </div>
            </div>
            <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="seller Name">Seller Contact No.</label>
              <input
                type="number"
                className="form-control"
                value={seller.contactNo}
                name="contactNo"
                onChange={handleInput}
              />
            </div>
            </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                <div className="form-group ">
              <label htmlFor="Deals In">Deals In</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="dealsIn"
                    rows="4" value={seller.dealsIn} onChange={handleInput} ></textarea>
            </div>
            </div>
            <div className='col-md-6'>
                <div className="form-group ">
              <label htmlFor="Deals In">Area Of Operation</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="areaOfOperation"
                    rows="4" value={seller.areaOfOperation} onChange={handleInput} ></textarea>
            </div>
            </div>
            </div>

            <div className='row'>
            <div className='col-md-12'>
                <div className="form-group ">
              <label htmlFor="Deals In">About Seller Details</label>
              <textarea className="form-control" style={{resize:"vertical"}} name="about"
                    rows="5" value={seller.about} onChange={handleInput} placeholder="About Seller Details" ></textarea>
            </div>
            </div>
            </div>
                    <div className='row'>
                <div className='col-md-6'>
                <div className="form-group ">
              <label htmlFor="seller Status">Status</label>
              <select
                className="form-control" 
                value={seller.status || ""}
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
  
export default Seller;