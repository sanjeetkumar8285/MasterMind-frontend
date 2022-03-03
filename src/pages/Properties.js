import React,{
  useEffect, 
  useState,
  useImperativeHandle,
  useRef, 
 forwardRef} from 'react';
 import ReactPaginate from "react-paginate";
import { Button, Modal } from 'react-bootstrap'
import {ApiBaseUrl} from '../config/ApiBaseUrl';
import { ToastContainer, toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const Properties = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formUpdateRef=useRef();
  const [open, setOpen] = useState({show:false,id:null});

  const handleClickOpen = (id) => {
    setOpen({show:true,id});
  };
  const handleClickClose = () => {
    setOpen({show:false,id:null});
  };

  const [search,setSearch]=useState("")
  const [propertyStatusData,setPropertyStatusData]=useState({}); //this state is used for storing data of propertyStatus
  const [propertyTypeData,setPropertyTypeData]=useState({});    //this state is used for storing data of propertyType
  const [amenitiesData,setAmenitiesData]=useState({});      ////this state is used for storing data of amenities
  const [sellerData,setSellerData]=useState({});
  const [builderData,setBuilderData]=useState({});

  const [formData, setFormData] = useState({
    name: "",
    propertyNo:"",
    price: "",
    propertyStatus: "",
    propertyType: "",
    about: "",
    sportsAndOutdoor: "",
    clubHouse: "",
    specifications: "",
    greenArea: "",
    fittingAndFurshing: "",
    amenities: [],
    areaSize: "",
    areaSizePrefix: "",
    landArea: "",
    landAreaPrefix: "",
    bedroom: "",
    state:"",
    addressDetails: "",
    latitude: "",
    longitude: "",
    brochureImage: "",
    mapImage: "",
    images: [],
    status: ""
  })


  const token = localStorage.getItem("token")
  //this state is used to store the data coming from property api
  const [propertyData, setPropertyData] = useState({});


  useEffect(() => {
    showData();
    getPropertyType();
    getPropertyStatus();
    getAmenities();
    getSeller();
    getBuilder();
  }, [])

  const showData = async () => {
    console.log(token)
    try {
      const res = await fetch(`${ApiBaseUrl}/property?page=1`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "authorization": token
        },
      })
      const data = await res.json();
      if (res.status === 400 || !data) {
        console.log(data.message)
        alert(data.message)
      } else {
        setPropertyData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteProperty = async () => {
    try {
      const res = await fetch(`${ApiBaseUrl}/property/${open.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": token
        }
      })
      const data = await res.json();
      if (res.status === 400 || !data) {
        toast.error(data.message)
      }
      else {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 4000,
          });
          setOpen({show:false,id:null})
        showData();
      }
    } catch (err) {
      console.log(err)
      toast.error(err)
    }

  }



  const handleInput = (e) => {
    console.log(e.target.value)
    let name = e.target.name
    let value = e.target.value
    if (name === "brochureImage" || name === "mapImage") {
      setFormData((prev) => {
        return { ...prev, [name]: e.target.files[0] }
      })
    }
    else if(name==="amenities"){
      const {amenities}=formData
      if(e.target.checked){
        setFormData((prev) => {
          return {...prev,[name]:[...amenities,value]}
          })
}
else{
  setFormData((prev) => {
    return {...prev,[name]:amenities.filter((ek)=>ek!==value)}
    })
}

    }
    else if (name === "images") {
      setFormData((prev) => {
        return { ...prev, [name]: [...e.target.files] }
      })
    }
    else {
      setFormData((prev) => {
        return { ...prev, [name]: value }
      })
    }
  }

//save data function
  const saveData = async (e) => {
    e.preventDefault();

    let myForm = new FormData();

    for (let prop in formData) {
      if(prop!=="amenities"){
      myForm.append(prop, formData[prop]);
      }
    }

    formData.images.map((data) => {
      return myForm.append("images", data)
    })

    formData.amenities.map((data)=>{
      return myForm.append("amenities",data)
    })

    try {
      const res = await fetch(`${ApiBaseUrl}/property`, {
        method: "POST",
        headers: {
          "authorization": token
        },
        body: myForm
      })
      const data = await res.json();
      console.log(data.err)
      if (res.status === 400 || !data) {
        console.log("something went wrong")
        toast.error(data.message)
      }
      else {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 4000,
          });
        setFormData({amenities:[]}) // set state null
      handleClose();
      showData();
      }

    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }


const getPropertyType=async()=>{
  try{
const res=await fetch(`${ApiBaseUrl}/getPropertyType`,{
  method:"GET", 
  headers:{
    "Content-Type":"application/json",
    "authorization":token
  },
})
const data=await res.json();
if(res.status===400 || !data){
  console.log("some error occur while fetching propertyType")
}
else{
setPropertyTypeData(data)
}
  }catch(err){
    console.log(err)
  }
}


const getPropertyStatus=async()=>{
  try{
const res=await fetch(`${ApiBaseUrl}/getPropertyStatus`,{
  method:"GET", 
  headers:{
    "Content-Type":"application/json",
    "authorization":token
  },
})
const data=await res.json();
if(res.status===400 || !data){
  console.log("some error occur while fetching propertyStatus")
}
else{
  setPropertyStatusData(data)
}
  }catch(err){
    console.log(err)
  }
}

const getAmenities=async()=>{
  try{
    const res=await fetch(`${ApiBaseUrl}/getAmenities`,{
      method:"GET", 
      headers:{
        "Content-Type":"application/json",
        "authorization":token
      },
    })
    const data=await res.json();
    if(res.status===400 || !data){
      console.log("some error occur while fetching amenities")
    }
    else{
      setAmenitiesData(data)
    }
      }catch(err){
        console.log(err)
      }
}

const getSeller=async()=>{
  try{
    const res=await fetch(`${ApiBaseUrl}/getSeller`,{
      method:"GET", 
      headers:{
        "Content-Type":"application/json",
        "authorization":token
      },
    })
    const data=await res.json();
    if(res.status===400 || !data){
      console.log("some error occur while fetching seller")
    }
    else{
      setSellerData(data)
    }
      }catch(err){
        console.log(err)
      }
}
const getBuilder=async()=>{
  try{
    const res=await fetch(`${ApiBaseUrl}/getBuilder`,{
      method:"GET", 
      headers:{
        "Content-Type":"application/json",
        "authorization":token
      },
    })
    const data=await res.json();
    if(res.status===400 || !data){
      console.log("some error occur while fetching builder data")
    }
    else{
      setBuilderData(data)
    }
      }catch(err){
        console.log(err)
      }
}

const fetchProperty = async (currentPage) => {
  try{
    const res=await fetch(`${ApiBaseUrl}/property?page=${currentPage}`,{
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
  const dataFromServer = await fetchProperty(currentPage);

  setPropertyData(dataFromServer);
}

const searchData=async()=>{
  try{
    const res=await fetch(`${ApiBaseUrl}/getProperty?keyword=${search}`,{
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
    }else{
      setPropertyData(data)
    }
  }catch(err){
    console.log(err)
  }
}
  return (
    <>
    <UpdateForm ref={formUpdateRef} showData={showData} />
    <Dialog
        open={open.show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you Sure want to Delete ?"}
        </DialogTitle>
       
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={deleteProperty} autoFocus>
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
                    <div className="col-12 col-xl-4 " style={{position: "relative",left: "50%"}} >
                    <Button variant="primary" style={{color:"white"}} onClick={handleShow}>
                    <i className="fas fa-plus"/> Add New
                  </Button>
                  <Modal show={show} onHide={handleClose} backdrop="static"
                    keyboard={false} size="xl">
                    <Modal.Header closeButton>
                      <Modal.Title>Add Property</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <form className="forms-sample">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Property Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="name">Porperty No.</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Property No"
                                name="propertyNo"
                                value={formData.propertyNo}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="price">Price</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Property Price"
                                name="price"
                                value={formData.price}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="amt">Booking Amount</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Booking Amount"
                                name="bookingAmount"
                                value={formData.bookingAmount}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="ownerShip"> OwnerShip</label>
                             <select className='form-control' name='ownership' defaultValue={formData.ownership || ""} onChange={handleInput}>
                             <option value="" disabled  >Select OwnerShip</option>
                               <option value="Builder">Builder</option>
                               <option value="Seller">Seller</option>
                             </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="saleType">Sale Type</label>
                              <select className='form-control' name='saleType' defaultValue={formData.saleType || ""} onChange={handleInput}>
                              <option value="" disabled  >Select SaleType</option>
                               <option value="Old">Old</option>
                               <option value="New">New</option>
                             </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">

                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="PropertyType">Property Type</label>
                              <select
                                className="form-control"
                                name="propertyType" defaultValue={formData.propertyType || ""} onChange={handleInput}>
                                   <option value="" disabled  >
                                  Select Type
                                </option>
                                  {propertyTypeData.data?.map((ele,index)=>{
                                    return <option key={index} value={ele.name}>{ele.name}</option>
                                  })}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="propertyStatus">Property Status</label>
                              <select
                                className="form-control"
                                name="propertyStatus"
                                defaultValue={formData.propertyStatus || ""} onChange={handleInput}>
                                <option value="" disabled >
                                  Select Status
                                </option>
                                  {propertyStatusData.data?.map((ele,index)=>{
                                    return <option key={index} value={ele.name}>{ele.name}</option>
                                  })}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">

                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="seller">Select Seller</label>
                            <select
                              className="form-control"
                              name="sellerName" defaultValue={formData.propertyType || ""} onChange={handleInput}>
                                <option value="" disabled  >
                                Select Seller
                              </option>
                                {sellerData.data?.map((ele,index)=>{
                                  return <option key={index} value={ele.sellerName}>{ele.sellerName}</option>
                                })}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="builder">Select Builder</label>
                            <select
                              className="form-control"
                              name="builderName"
                              defaultValue={formData.builderName || ""} onChange={handleInput}>
                              <option value="" disabled >
                                Select Builder
                              </option>
                                {builderData.data?.map((ele,index)=>{
                                  return <option key={index} value={ele.builderName}>{ele.builderName}</option>
                                })}
                            </select>
                          </div>
                        </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="about">About</label>
                              <textarea className="form-control" style={{resize:"vertical"}} name="about" placeholder="About Property Details "
                               rows="6" value={formData.about} onChange={handleInput} ></textarea>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <h4 className="text-divider"><span>Amenities</span></h4>
                         {amenitiesData.data?.map((ele,index)=>{
                           return (
                            <div className='col-md-3' key={index} >
                            <div className="form-group" style={{border:"2px dashed black",borderRadius:"5px"}}>
                              <input type="checkbox" className="form-check-input" name="amenities" value={ele.name} onChange={handleInput} />
                              <label className="form-check-label">{ele.name}</label>
                            </div>
                          </div>
                           )
                         })}
                          
                  
                        </div> 


                        <div className="row">
                          <h4 className="text-divider"><span>Rating</span></h4>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="sportsAndOutDoor">Sports & OutDoor</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sports & OutDoor Rating"
                                name="sportsAndOutdoor"
                                value={formData.sportsAndOutdoor}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="clubHouse">Club House</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Club House Rating"
                                name="clubHouse"
                                value={formData.clubHouse}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="Specification">Specifications</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Specification Rating"
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">

                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="greenArea">Green Area</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Green Area Rating"
                                name="greenArea"
                                value={formData.greenArea}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="Fitting">Fitting & Furhsing</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Fitting & Furhsing Rating"
                                name="fittingAndFurshing"
                                value={formData.fittingAndFurshing}
                                onChange={handleInput}
                              />
                            </div>
                          </div>

                        </div>

                        <div className="row">
                          <h4 className="text-divider"><span>Description</span></h4>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="areaSize">Area Size</label>
                              <input
                                type="text"
                                className="form-control"
                                name="areaSize"
                                value={formData.areaSize}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="AreaPrefix">Area Size Prefix</label>
                              <select className='form-control' name="areaSizePrefix" value={formData.areaSizePrefix || ""} onChange={handleInput}>
                                <option value="" disabled >Select</option>
                                <option value="BHK">BHK</option>
                                <option value="Square Foot">Square Foot</option>
                                <option value="Foot">Foot</option>
                                <option value="Square Meter">Square Meter</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">

                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="landAra">Land Area</label>
                              <input
                                type="text"
                                className="form-control"
                                name="landArea"
                                value={formData.landArea}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="AreaPrefix">Land Area Prefix</label>
                              <select className='form-control' name="landAreaPrefix" value={formData.landAreaPrefix || ""} onChange={handleInput}>
                                <option value="" disabled >Select</option>
                                <option value="Square Foot">Square Foot</option>
                                <option value="Foot">Foot</option>
                                <option value="Square Meter">Square Meter</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="areaSize">BedRoom</label>
                              <input
                                type="number"
                                className="form-control"
                                name="bedroom"
                                value={formData.bedroom}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="areaSize">Total Floor</label>
                              <input
                                type="number"
                                className="form-control"
                                name="totalFloor"
                                value={formData.totalFloor}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <h4 className="text-divider"><span>Address Details</span></h4>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="State">State</label>
                        <select  className="form-control" name='state' value={formData.state || ""} onChange={handleInput}>
                          <option value="" disabled>Select State</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Gurgaon">Gurgaon</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Mumbai">Mumbai</option>
                        </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="address">Address</label>
                              <textarea className="form-control" rows="4" name="addressDetails" value={formData.addressDetails} onChange={handleInput}></textarea>
                            </div>
                          </div>
                         
                        </div>
                        <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="longitude">Longitude</label>
                              <input
                                type="text"
                                className="form-control"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="Latitude">Latitude</label>
                              <input
                                type="text"
                                className="form-control"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <h4 className="text-divider"><span>Images</span></h4>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="brochureImage">Brochure Image</label>
                              <input
                                type="file"
                                className="form-control"
                                name="brochureImage"
                                accept="image/*"
                                onChange={handleInput}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="mapImage">Map Image</label>
                              <input
                                type="file"
                                className="form-control"
                                name="mapImage"
                                accept="image/*"
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="images">Images</label>
                              <input
                                type="file"
                                className="form-control"
                                name="images"
                                accept="image/*"
                                onChange={handleInput}
                                multiple
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="status">Status</label>
                              <select name='status' className='form-control' value={formData.status || ""} onChange={handleInput}>
                                <option value="" disabled >Select</option>
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
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Property Details</h4>
                  <p className="card-description">
                    Properties List
                  </p>
                  <div className="table-responsive pt-3">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th> Property Type</th>
                          <th>Property Status</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          propertyData.data?.map((data, index) => {
                            return (
                              <tr key={index}>
                                <th scope='row'>{index + 1}</th>
                                <td>{data.name}</td>
                                <td>{data.price}</td>
                                <td>{data.propertyType}</td>
                                <td>{data.propertyStatus}</td>
                                <td>{data.status ? "Active" : "Inactive"}</td>
                                <td><div className='content'>
                                  <Button className='btn btn-sm' style={{ backgroundColor: "white" }} onClick={() => {
                          formUpdateRef.current.openForm(data);
                        }}><i className="fas fa-edit"></i></Button>
                                  <Button className='btn btn-sm' style={{ backgroundColor: "white" }} onClick={() => {
                                   handleClickOpen(data._id)
                                  }}><i className="fas fa-trash" style={{ color: "red" }}></i>
                                  </Button>  </div></td>
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
        pageCount={Math.ceil(propertyData.numberofPage)}
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
        <ToastContainer />
    </>
  );
};



const UpdateForm = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [propertyStatusData,setPropertyStatusData]=useState({}); //this state is used for storing data of propertyStatus
  const [propertyTypeData,setPropertyTypeData]=useState({});    //this state is used for storing data of propertyType
  const [amenitiesData,setAmenitiesData]=useState({}); 
  const [sellerData,setSellerData]=useState({});
  const [builderData,setBuilderData]=useState({});

  const [id,setId]=useState("")
  const [formData,setFormData]=useState({
  name: "",
  propertyNo:"",
  price: "",
  bookingAmount:"",
  ownership:"",
  saleType:"",
  propertyStatus: "",
  propertyType: "",
  sellerName:"",
  builderName:"",
  about: "",
  sportsAndOutdoor: "",
  clubHouse: "",
  specifications: "",
  greenArea: "",
  fittingAndFurshing: "",
  amenities: [],
  areaSize: "",
  areaSizePrefix: "",
  landArea: "",
  landAreaPrefix: "",
  bedroom: "",
  state:"",
  addressDetails: "",
  latitude: "",
  longitude: "",
  brochureImage: "",
  mapImage: "",
  images: [],
  status: ""})
  
  const { showData } = props;
  const token=localStorage.getItem("token")



  useEffect(()=>{
    getAmenities();
    getPropertyStatus();
    getPropertyType();
    getSeller();
    getBuilder();
  },[])   


  const handleInput = (e) => {
    console.log(e.target.value)
    let name = e.target.name
    let value = e.target.value
    if (name === "brochureImage" || name === "mapImage") {
      setFormData((prev) => {
        return { ...prev, [name]: e.target.files[0] }
      })
    }
    else if(name==="amenities"){
      const {amenities}=formData
      if(e.target.checked){
        setFormData((prev) => {
          return {...prev,[name]:[...amenities,value]}
          })
}
else{
  setFormData((prev) => {
    return {...prev,[name]:amenities.filter((ek)=>ek!==value)}
    })
}

    }
    else if (name === "images") {
      setFormData((prev) => {
        return { ...prev, [name]: [...e.target.files] }
      })
    }
    else {
      setFormData((prev) => {
        return { ...prev, [name]: value }
      })
    }
  }

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      if (dt?._id) {
        setId(dt._id)
        setFormData({
    name: dt.name,
    propertyNo:dt.propertyNo,
    price: dt.price,
    bookingAmount:dt.bookingAmount,
    ownership:dt.ownership,
    saleType:dt.saleType,
    propertyStatus: dt.propertyStatus,
    propertyType: dt.propertyType,
    sellerName:dt.seller.sellerName,
    builderName:dt.builder.builderName,
    about: dt.about,
    sportsAndOutdoor: dt.rating.sportsAndOutdoor,
    clubHouse: dt.rating.clubHouse,
    specifications: dt.rating.specifications,
    greenArea: dt.rating.greenArea,
    fittingAndFurshing: dt.rating.fittingAndFurshing,
    amenities: dt.amenities.map((data)=>{return data.name}),
    areaSize: dt.description.areaSize,
    areaSizePrefix: dt.description.areaSizePrefix,
    landArea: dt.description.landArea,
    landAreaPrefix: dt.description.landAreaPrefix,
    bedroom: dt.description.bedroom,
    totalFloor:dt.description.totalFloor,
    state:dt.address.state,
    addressDetails: dt.address.addressDetails,
    latitude: dt.address.latitude,
    longitude: dt.address.longitude,
    brochureImage: dt.brochureImage,
    mapImage: dt.mapImage,
    images: dt.images,
    status: dt.status
        })
      } else {
        setFormData({})
      }
    handleShow();
    },
  }));

  const updateData=async(e)=>{
     
      e.preventDefault();
      let myForm = new FormData();

    for (let prop in formData) {
      if(prop!=="amenities"){
      myForm.append(prop, formData[prop]);
      }
    }

    formData.images.map((data) => {
      return myForm.append("images", data)
    })

    formData.amenities.map((data)=>{
      return myForm.append("amenities",data)
    })

    try {
      const res = await fetch(`${ApiBaseUrl}/property/${id}`, {
        method: "PUT",
        headers: {
          "authorization": token
        },
        body: myForm
      })
      const data = await res.json();
      console.log("dataaaa " + data.err)
      if (res.status === 400 || !data) {
        console.log(data.err)
        toast.error(data.message)
      }
      else {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 4000,
          });
        setFormData({}) // set state null
      handleClose();
      showData();
      }

    } catch (err) {
      console.log(err)
      toast.error(err)
    }
          }

          const getPropertyType=async()=>{
            try{
          const res=await fetch(`${ApiBaseUrl}/propertyType`,{
            method:"GET", 
            headers:{
              "Content-Type":"application/json",
              "authorization":token
            },
          })
          const data=await res.json();
          if(res.status===400 || !data){
            console.log("some error occur while fetching propertyType")
          }
          else{
          setPropertyTypeData(data)
          }
            }catch(err){
              console.log(err)
            }
          }
          
          
          const getPropertyStatus=async()=>{
            try{
          const res=await fetch(`${ApiBaseUrl}/propertyStatus`,{
            method:"GET", 
            headers:{
              "Content-Type":"application/json",
              "authorization":token
            },
          })
          const data=await res.json();
          if(res.status===400 || !data){
            console.log("some error occur while fetching propertyStatus")
          }
          else{
            setPropertyStatusData(data)
          }
            }catch(err){
              console.log(err)
            }
          }
          
          const getAmenities=async()=>{
            try{
              const res=await fetch(`${ApiBaseUrl}/amenities`,{
                method:"GET", 
                headers:{
                  "Content-Type":"application/json",
                  "authorization":token
                },
              })
              const data=await res.json();
              if(res.status===400 || !data){
                console.log("some error occur while fetching amenities")
              }
              else{
                setAmenitiesData(data)
              }
                }catch(err){
                  console.log(err)
                }
          }

          const getSeller=async()=>{
            try{
              const res=await fetch(`${ApiBaseUrl}/getSeller`,{
                method:"GET", 
                headers:{
                  "Content-Type":"application/json",
                  "authorization":token
                },
              })
              const data=await res.json();
              if(res.status===400 || !data){
                console.log("some error occur while fetching seller")
              }
              else{
                setSellerData(data)
              }
                }catch(err){
                  console.log(err)
                }
          }
          const getBuilder=async()=>{
            try{
              const res=await fetch(`${ApiBaseUrl}/getBuilder`,{
                method:"GET", 
                headers:{
                  "Content-Type":"application/json",
                  "authorization":token
                },
              })
              const data=await res.json();
              if(res.status===400 || !data){
                console.log("some error occur while fetching builder data")
              }
              else{
                setBuilderData(data)
              }
                }catch(err){
                  console.log(err)
                }
          }
          
         
  return (
    <>
    <Modal show={show} onHide={handleClose} backdrop="static"
                    keyboard={false} size="xl">
                    <Modal.Header closeButton>
                      <Modal.Title>Update Property</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form className="forms-sample">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Property Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="name">Porperty No.</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Property No"
                                name="propertyNo"
                                value={formData.propertyNo}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="price">Price</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Property Price"
                                name="price"
                                value={formData.price}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="amt">Booking Amount</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Booking Amount"
                                name="bookingAmount"
                                value={formData.bookingAmount}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="ownerShip"> OwnerShip</label>
                             <select className='form-control' name='ownership' defaultValue={formData.ownership} onChange={handleInput}>
                             <option value="" disabled  >Select OwnerShip</option>
                               <option value="Builder">Builder</option>
                               <option value="Seller">Seller</option>
                             </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="saleType">Sale Type</label>
                              <select className='form-control' name='saleType' defaultValue={formData.saleType} onChange={handleInput}>
                              <option value="" disabled  >Select SaleType</option>
                               <option value="Old">Old</option>
                               <option value="New">New</option>
                             </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">

                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="PropertyType">Property Type</label>
                              <select
                                className="form-control"
                                name="propertyType" defaultValue={formData.propertyType} onChange={handleInput}>
                                   <option value="" disabled  >
                                  Select Type
                                </option>
                                  {propertyTypeData.data?.map((ele,index)=>{
                                    return <option key={index} value={ele.name}>{ele.name}</option>
                                  })}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="propertyStatus">Property Status</label>
                              <select
                                className="form-control"
                                name="propertyStatus"
                                defaultValue={formData.propertyStatus} onChange={handleInput}>
                                <option value="" disabled >
                                  Select Status
                                </option>
                                  {propertyStatusData.data?.map((ele,index)=>{
                                    return <option key={index} value={ele.name}>{ele.name}</option>
                                  })}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">

                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="seller">Select Seller</label>
                            <select
                              className="form-control"
                              name="sellerName" defaultValue={formData.propertyType} onChange={handleInput}>
                                <option value="" disabled  >
                                Select Seller
                              </option>
                                {sellerData.data?.map((ele,index)=>{
                                  return <option key={index} value={ele.sellerName}>{ele.sellerName}</option>
                                })}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="builder">Select Builder</label>
                            <select
                              className="form-control"
                              name="builderName"
                              defaultValue={formData.builderName} onChange={handleInput}>
                              <option value="" disabled >
                                Select Builder
                              </option>
                                {builderData.data?.map((ele,index)=>{
                                  return <option key={index} value={ele.builderName}>{ele.builderName}</option>
                                })}
                            </select>
                          </div>
                        </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="about">About</label>
                              <textarea className="form-control" style={{resize:"vertical"}} name="about" placeholder="About Property Details "
                               rows="6" value={formData.about} onChange={handleInput} ></textarea>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <h4 className="text-divider"><span>Amenities</span></h4>
                         {amenitiesData.data?.map((ele,index)=>{
                           return (
                                  <div className='col-md-3' key={index} >
                                  <div className="form-group"  style={{border:"2px dashed black",borderRadius:"5px"}}>
                                    <input type="checkbox" className="form-check-input" name="amenities" value={ele.name} onChange={handleInput} checked={
                                     formData.amenities?.includes(ele.name)
                                    } />
                                    <label className="form-check-label">{ele.name}</label>
                                  </div>
                                </div>
                           )
                         })}
                        
                        </div> 



                        <div className="row">
                          <h4 className="text-divider"><span>Rating</span></h4>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="sportsAndOutDoor">Sports & OutDoor</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sports & OutDoor Rating"
                                name="sportsAndOutdoor"
                                value={formData.sportsAndOutdoor}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="clubHouse">Club House</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Club House Rating"
                                name="clubHouse"
                                value={formData.clubHouse}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="Specification">Specifications</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Specification Rating"
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">

                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="greenArea">Green Area</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Green Area Rating"
                                name="greenArea"
                                value={formData.greenArea}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="Fitting">Fitting & Furhsing</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Fitting & Furhsing Rating"
                                name="fittingAndFurshing"
                                value={formData.fittingAndFurshing}
                                onChange={handleInput}
                              />
                            </div>
                          </div>

                        </div>

                        <div className="row">
                          <h4 className="text-divider"><span>Description</span></h4>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="areaSize">Area Size</label>
                              <input
                                type="text"
                                className="form-control"
                                name="areaSize"
                                value={formData.areaSize}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="AreaPrefix">Area Size Prefix</label>
                              <select className='form-control' name="areaSizePrefix" value={formData.areaSizePrefix} onChange={handleInput}>
                                <option value="" disabled >Select</option>
                                <option value="BHK">BHK</option>
                                <option value="Square Foot">Square Foot</option>
                                <option value="Foot">Foot</option>
                                <option value="Square Meter">Square Meter</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">

                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="landAra">Land Area</label>
                              <input
                                type="text"
                                className="form-control"
                                name="landArea"
                                value={formData.landArea}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="AreaPrefix">Land Area Prefix</label>
                              <select className='form-control' name="landAreaPrefix" value={formData.landAreaPrefix} onChange={handleInput}>
                                <option value="" disabled >Select</option>
                                <option value="Square Foot">Square Foot</option>
                                <option value="Foot">Foot</option>
                                <option value="Square Meter">Square Meter</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="areaSize">BedRoom</label>
                              <input
                                type="number"
                                className="form-control"
                                name="bedroom"
                                value={formData.bedroom}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="areaSize">Total Floor</label>
                              <input
                                type="number"
                                className="form-control"
                                name="totalFloor"
                                value={formData.totalFloor}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <h4 className="text-divider"><span>Address Details</span></h4>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="State">State</label>
                        <select  className="form-control" name='state' value={formData.state} onChange={handleInput}>
                          <option value="" disabled>Select State</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Noida">Noida</option>
                          <option value="Gurgaon">Gurgaon</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Mumbai">Mumbai</option>
                        </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="address">Address</label>
                              <textarea className="form-control" rows="4" name="addressDetails" value={formData.addressDetails} onChange={handleInput}></textarea>
                            </div>
                          </div>
                         
                        </div>
                        <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="longitude">Longitude</label>
                              <input
                                type="text"
                                className="form-control"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="Latitude">Latitude</label>
                              <input
                                type="text"
                                className="form-control"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <h4 className="text-divider"><span>Images</span></h4>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="brochureImage">Brochure Image</label>
                              <input
                                type="file"
                                className="form-control"
                                name="brochureImage"
                                accept="image/*"
                                onChange={handleInput}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="mapImage">Map Image</label>
                              <input
                                type="file"
                                className="form-control"
                                name="mapImage"
                                accept="image/*"
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="images">Images</label>
                              <input
                                type="file"
                                className="form-control"
                                name="images"
                                accept="image/*"
                                onChange={handleInput}
                                multiple
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="status">Status</label>
                              <select name='status' className='form-control' value={formData.status} onChange={handleInput}>
                                <option value="" disabled >Select</option>
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


export default Properties;