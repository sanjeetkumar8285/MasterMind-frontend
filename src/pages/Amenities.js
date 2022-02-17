import React,{
  useEffect, 
  useState,
  useImperativeHandle,
  useRef, 
 forwardRef} from 'react';
import {ApiBaseUrl} from '../config/ApiBaseUrl';
import { Button, Modal } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';


const Amenities = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  const formUpdateRef=useRef();
const [amenities,setAmenities]=useState({});

const handleInput=(e)=>{
  let name=e.target.name
  let value=e.target.value
  setAmenities((prev)=>{
return {...prev,[name]:value}
})
}

const token = localStorage.getItem("token")
//this state is used to store the data coming from amenities api
    const [amenitiesData,setAmenitiesData]=useState({});

    const showData=async()=>{
        try{
        const res=await fetch(`${ApiBaseUrl}/amenities`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":token
            }
        })
       const data=await res.json();
       if(res.status===400 || !data) {
        console.log("Something went wrong while fetching amentities record")
       }else{
        setAmenitiesData(data)
       }
    }catch(err){
        console.log(err)
    }
    }
    useEffect(()=>{
        showData();
    },[])


    const saveData=async(e)=>{
        e.preventDefault();
        const {name,status}=amenities
try{
  const res=await fetch(`${ApiBaseUrl}/amenities`,{
    method:"POST",
    Accept:"application/json",
    headers:{
      "Content-Type":"application/json",
      "authorization":token
    },
    body:JSON.stringify({
      name,
      status
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
   setAmenities({})
    handleClose();
    showData();
  }
}catch(err){
  console.log(err)
  toast.error(err)
}
    }
    
    const deleteAmenities=async(id)=>{
        try{
            const res=await fetch(`${ApiBaseUrl}/amenities/${id}`,{
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
              showData();
            }
          }catch(err){
            console.log(err)
            toast.error(err)
          }
    }

    return (
        <>
                <UpdateForm ref={formUpdateRef} showData={showData}/>
                <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">

          <div className="col-md-12 grid-margin">
                  <div className="row">
                    <div className="col-12 col-xl-4 offset-10">
                    <Button variant="primary" style={{color:"white"}} onClick={handleShow}>
                    <i className="fas fa-plus"/> Add New
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Amenities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
            <div className="form-group">
              <label htmlFor="amenities">Name</label>
              <input
                type="text"
                className="form-control"
                value={amenities.name}
                name="name"
                onChange={handleInput}
                placeholder="Amenities Name"
              />
            </div>
            <div className="form-group ">
              <label htmlFor="propertyStatus">Amenities Status</label>
              <select
                className="form-control" 
                value={amenities.status}
                name="status"
                onChange={handleInput}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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
                  <h4 className="card-title">Amenities</h4>
                  <p className="card-description">
                 Amenities List
                  </p>
                  <div className="table-responsive pt-3">
                  <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          amenitiesData.data?.map((data,index)=>{
                            return (
                              <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <td>{data.name}</td>
                              <td>{data.status ? "Active" :"Inactive"}</td>
    
                <td><div className='content'>
          <Button className='btn btn-sm' style={{backgroundColor:"white"}} onClick={() => {
                          formUpdateRef.current.openForm(data);
                        }}><i className="fas fa-edit"></i></Button>
          <Button className='btn btn-sm' style={{backgroundColor:"white"}}  onClick={() => {
                    if(window.confirm("Are you sure want to delete ?")){ deleteAmenities(data._id)} }}><i className="fas fa-trash" style={{color:"red"}}></i>
              </Button>  </div></td>
                            </tr>
                            )
                          })
                        }
                       
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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

  const [amenities,setAmenities]=useState({});
  const { showData } = props;
  const token=localStorage.getItem("token")


  const handleInput=(e)=>{
    let name=e.target.name
    let value=e.target.value
    setAmenities((prev)=>{
return {...prev,[name]:value}
})
}

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      if (dt?._id) {
        setAmenities(dt)
      } else {
        setAmenities({})
      }
    handleShow();
    },
  }));

  const updateData=async(e)=>{
      const {_id,name,status}=amenities
      e.preventDefault();
      try{
        const res=await fetch(`${ApiBaseUrl}/amenities/${_id}`,{
          method:"PUT",
          Accept:"application/json",
          headers:{
              "Content-Type":"application/json",
            "authorization":token
          },
          body:JSON.stringify({
              name,status
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
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Amenities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">
            <div className="form-group">
              <label htmlFor="amenities">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={amenities.name}
                onChange={handleInput}
                placeholder="Amenities Name"
              />
            </div>
            <div className="form-group ">
              <label htmlFor="propertyStatus">Amenities Status</label>
              <select
                className="form-control" 
                name='status'
                value={amenities.status}
                onChange={handleInput}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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


export default Amenities;