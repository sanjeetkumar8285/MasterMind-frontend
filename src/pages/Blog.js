import React,{
    useEffect, 
    useState,
    useImperativeHandle,
    useRef, 
   forwardRef} from 'react';
import {ApiBaseUrl, ImageBaseUrl} from '../config/ApiBaseUrl';
import { ToastContainer, toast } from 'react-toastify';
import {Button,Modal} from 'react-bootstrap'
const Blog = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const formUpdateRef=useRef();

    const [search,setSearch]=useState("")

    const [blog,setBlog]=useState({})
    const [blogData,setBlogData]=useState({}) //this state is used for store state data

    const token=localStorage.getItem("token")

    useEffect(()=>{
showData();
    },[])

const handleInput=(e)=>{
let name=e.target.name
let value=e.target.value
if(name==="image"){
    setBlog((prev)=>{
    return {...prev,[name]:e.target.files[0]}
    })
}
else{
    setBlog((prev)=>{
        return {...prev,[name]:value}
        })
}

}

const saveData=async(e)=>{
e.preventDefault();
const fd=new FormData();

for(let prop in blog){
    fd.append(prop,blog[prop])
}

try{
const res=await fetch(`${ApiBaseUrl}/blog`,{
method:"POST",
headers:{
    "authorization":token
},
body:fd
})
const data=await res.json();
if(res.status===400 || !data){
    toast.error(data.message)
}
else{
    toast.success(data.message);
    handleClose();
    showData();
}
}catch(err){
    console.log(err)
    toast.error(err)
}
}


    const showData=async()=>{
        try{
            const res=await fetch(`${ApiBaseUrl}/blog?keyword=${search}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":token
                }
            })
            const data=await res.json();
            if(res.status===400 ||!data){
                console.log(data.message)
            }
            else{
                setBlogData(data)
            }
        }catch(err){
            console.log(err)
        }

    }

    const deleteBlog=async(id)=>{
        try{
const res=await fetch(`${ApiBaseUrl}/blog/${id}`,{
    method:"DELETE",
    headers:{
        "Content-Type":"application/json",
        "authorization":token
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
                  <div className="col-xl-4">
                    <div className="form-group" style={{display:"flex"}}>
                    <input type="search" className="form-control" placeholder="Search" 
                    onChange={(e)=>{setSearch(e.target.value)}}
                    onKeyPress={(e)=>{e.key==="Enter" && showData()}}/>
                    <button onClick={showData} className="btn btn-success">Search</button>
                    </div>
                    </div>
                    <div className="col-12 col-xl-4 " style={{position: "relative",left: "50%"}} >
                    <Button variant="primary" style={{color:"white"}} onClick={handleShow}>
                    <i className="fas fa-plus"/> Add New
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">

                        <div className="row">
                          <div className="col-md-12">
                          <div className="form-group">
                         <label htmlFor="Blogs Name">Blog Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={blog.blogName}
                                name="blogName"
                                onChange={handleInput}
                                placeholder="Blog Name"
                            />
                            </div>
                          </div>
                          </div>

                          <div className="row">
            <div className="col-md-12">
            <div className="form-group">
            <label htmlFor="about">About</label>
            <textarea className="form-control" style={{resize:"vertical"}} name="blogDescription" placeholder="Blog Description "
                               rows="6" value={blog.blogDescription} onChange={handleInput} ></textarea>
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
                                name="image"
                                accept="image/*"
                                onChange={handleInput}
                              />
                            </div>
                          </div>
            </div>
            <div className="col-md-6">
            <div className="form-group ">
              <label htmlFor="blogStatus">Status</label>
              <select
                className="form-control" 
                name="status"
                value={blog.status}
                onChange={handleInput}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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
                  <h4 className="card-title">Blog</h4>
                  <p className="card-description">
                  Blog List
                  </p>
                  <div className="table-responsive pt-3">
                  <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Blog Image</th>
                          <th>Blog Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          blogData.data?.map((data,index)=>{
                            return (
                              <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <td>
                                  <a href={`${ImageBaseUrl}/${data.image}`} target="_blank">
                                  <img src={`${ImageBaseUrl}/${data.image}`}/>
                                  </a>
                                  </td>
                              <td>{data.blogName}</td>
                              <td>{data.status ? "Active" :"Inactive"}</td>
    
                <td><div className='content'>
          <button className='btn btn-sm' style={{backgroundColor:"white"}}  onClick={() => {
                          formUpdateRef.current.openForm(data);
                        }}><i className="fas fa-edit"></i></button>
          <button className='btn btn-sm' style={{backgroundColor:"white"}}  onClick={() => {
                    if(window.confirm("Are you sure want to delete ?")){ deleteBlog(data._id)} }}><i className="fas fa-trash" style={{color:"red"}}></i>
              </button>  </div></td>
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
  
    const [blog,setBlog]=useState({});
    const { showData } = props;
    const token=localStorage.getItem("token")
  
  
    const handleInput=(e)=>{
      let name=e.target.name
      let value=e.target.value
      if(name==="image"){
        setBlog((prev)=>{
            return {...prev,[name]:e.target.files[0]}
            })
      }else{
        setBlog((prev)=>{
            return {...prev,[name]:value}
            })
      }
 
  }
  
    useImperativeHandle(ref, () => ({
      openForm(dt) {
        if (dt?._id) {
          setBlog(dt)
        } else {
          setBlog({})
        }
      handleShow();
      },
    }));
  
    const updateData=async(e)=>{
        const {_id}=blog
        const fd=new FormData()
        for(let prop in blog){
            fd.append(prop, blog[prop])
        }
        e.preventDefault();
        try{
          const res=await fetch(`${ApiBaseUrl}/blog/${_id}`,{
            method:"PUT",
            headers:{
              "authorization":token
            },
            body:fd
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
        keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="forms-sample">

                        <div className="row">
                          <div className="col-md-12">
                          <div className="form-group">
                         <label htmlFor="Blogs Name">Blog Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={blog.blogName}
                                name="blogName"
                                onChange={handleInput}
                                placeholder="Blog Name"
                            />
                            </div>
                          </div>
                          </div>

                          <div className="row">
            <div className="col-md-12">
            <div className="form-group">
            <label htmlFor="about">About</label>
            <textarea className="form-control" style={{resize:"vertical"}} name="blogDescription" placeholder="Blog Description "
                               rows="6" value={blog.blogDescription} onChange={handleInput} ></textarea>
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
                                name="image"
                                accept="image/*"
                                onChange={handleInput}
                              />
                            </div>
                          </div>
                          {blog.image && <img style={{width:"100px", height:"100px"}} src={`${ImageBaseUrl}/${blog.image}`}/>}
               
            </div>
            <div className="col-md-6">
            <div className="form-group ">
              <label htmlFor="blogStatus">Status</label>
              <select
                className="form-control" 
                name="status"
                value={blog.status}
                onChange={handleInput}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateData}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
  });
export default Blog;