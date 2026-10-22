import React, { act, useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

const AddressListData = () => {
    const userid = localStorage.getItem('userid');
    const [addresses, setAddresses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [id, setId] = useState(0);
    const[error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        line1: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        contact: "",
        alternatecontact: "",
    })
    const [originalFormData, setOriginalFormData] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [isNotFoundModalOpen, setIsNotFoundModalOpen] = useState(false);
    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}address/getByuserId/${userid}`);
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching cart items", error);
        }
    }


    useEffect(() => {
        fetchAddresses()
    }, [])

    const modalAction = () => {
        setIsModalOpen(!isModalOpen);
        // if(document.body.style.overflow === ''){
        //   document.body.style.overflow = 'hidden';
        //   document.body.style.height = '100vh';
        // }
        // else
        //     document.body.style.overflow = '';
        //     document.body.style.height = '';
        if(!isModalOpen){
            setId(0);
            setFormData({
                name: "",
                line1: "",
                landmark: "",
                city: "",
                state: "",
                country: "",
                pin: "",
                contact: "",
                alternatecontact: "",
            })
            setOriginalFormData(null);
        }
        // console.log(document.body.style.overflow)
    };
    // const handleDelete = async () => {
    //     try {
    //         const confirmed = window.confirm("Are you sure you want to delete this address?");
    //         if (confirmed) {
    //             await axios.put(`${process.env.REACT_APP_API_URL}address/deleteAddress/${id}`);
    //             modalAction();
    //             fetchAddresses();
    //             setId(0);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }   
    // };

    const handleDelete = async () => {
        try{
            await axios.put(`${process.env.REACT_APP_API_URL}address/deleteAddress/${id}`);
            modalAction();
            fetchAddresses();
            setId(0);
        }
        catch(err){
            console.log(err);
        }
    }

   const handleDirectDelete = async (addressId) => {
    try{
        await axios.put(`${process.env.REACT_APP_API_URL}address/deleteAddress/${addressId}`);
        fetchAddresses();
    }
    catch(err){
        console.log(err);
    }
}


    const handleSetDefault = async (selectedAddressId) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}address/setDefault/${selectedAddressId}`, {
            userid: userid,
            //   addressid: selectedId,
            });

            setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                is_default: addr.addressid === selectedAddressId ? 1 : 0
            }))
            );
        } catch (err) {
            console.error(err);
            alert('Failed to set default address.');
        }
    };


    const handleUpdate = async () => {
        if(
            formData.name.trim() === "" ||
            formData.line1.trim() === "" ||
            formData.city.trim() === "" ||
            formData.state.trim() === "" ||
            formData.country.trim() === "" ||
            formData.pin.trim() === "" ||
            formData.contact.trim() === ""
        ){
            setAlertMessage("Please fill in all mandatory fields.");
            setIsAlertModalOpen(true);
            return;
        }
        if(JSON.stringify(formData) === JSON.stringify(originalFormData)){
            setIsNotFoundModalOpen(true);
            return;
        }

        // Check if pin code is a number
        if (isNaN(formData.pin.trim())) {
            setAlertMessage("Pin code must be a number.");
            setIsAlertModalOpen(true);
            return;
        }
        

        // Check if contact numbers are 10 digits
        if (
            !/^\d{10}$/.test(formData.contact.trim()) ||
            (formData.alternatecontact.trim() !== '' && !/^\d{10}$/.test(formData.alternatecontact.trim()))
        ) {
            setAlertMessage("Contact numbers must be 10 digits.");
            setIsAlertModalOpen(true);
            return;
        }
       
        openConfirmationModal("update")
    };
    const handleUpdateRequest = async ()=>{
        try {
            const response= await axios.put(`${process.env.REACT_APP_API_URL}address/updateAddress/${id}`, formData);
            modalAction();
            fetchAddresses();
            setId(0);
        } catch (err) {
            console.log(err);
        }
    }
            
        
        

    const getDetails = async (addressid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}address/addressById/${addressid}`);
            const data = response.data[0];
            setFormData({
                name: data.name,
                line1: data.line1,
                landmark: data.landmark,
                city: data.city,
                state: data.state,
                country: data.country,
                pin: data.pin,
                contact: data.contact,
                alternatecontact: data.alternatecontact
            });
            setOriginalFormData({
                name: data.name,
                line1: data.line1,
                landmark: data.landmark,
                city: data.city,
                state: data.state,
                country: data.country,
                pin: data.pin,
                contact: data.contact,
                alternatecontact: data.alternatecontact
            })
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if((name === "contact" || name === "alternatecontact") && !/^\d*$/.test(value) ){
            setAlertMessage("Please enter a valid contact number.");
            setIsAlertModalOpen(true);
            return;
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const closeAlertModal = () => {
        setIsAlertModalOpen(false);
        setAlertMessage('');
    };

    const fillpindetails = () => {
        if(formData.pin === '848210'){
            setError('');
            setFormData(prevState => ({
                ...prevState,
                city: 'Rosera',
                state: 'Bihar',
                country: 'India',
            }))
        }else{
           setAlertMessage("Sorry! We do not serve in this area.");
           setIsAlertModalOpen(true);
        }

        // if(pin === "0000")
        //      {
        //     setFormData((prevState) => ({
        //         ...prevState,
        //         city: "test", 
        //         state: "test",
        //         country: "test",   
        //     }))
        // }
    }

    // const handleUpdate = async () => {
    //     if (
    //         formData.name.trim() === "" ||
    //         formData.line1.trim() === "" ||
    //         formData.city.trim() === "" ||
    //         formData.state.trim() === "" ||
    //         formData.country.trim() === "" ||
    //         formData.pin.trim() === "" ||
    //         formData.contact.trim() === ""
      
    //       ) {
    //         alert("Please fill in all mandatory fields.");
    //         return;
    //       }
      
    //       // Check if pin code is a number
    //       if (isNaN(formData.pin.trim())) {
    //         alert("Pin code must be a number.");
    //         return;
    //       }
      
    //       // Check if contact numbers are 10 digits
    //       if (
    //         !/^\d{10}$/.test(formData.contact.trim())
    //         //!/^\d{10}$/.test(formData.alternatecontact.trim())
    //       ) {
    //         alert("Contact numbers must be 10-digit numbers.");
    //         return;
    //       }
    //       if(formData.alternatecontact.trim() !== '' && !/^\d{10}$/.test(formData.alternatecontact.trim())){
    //         alert("Alternate contact numbers must be 10-digit numbers.");
    //         return;
    //       }
    //     try {
    //         const confirm = window.confirm("Are you sure you want to update this address?");
    //         if (confirm) {
    //         const response = await axios.put(`${process.env.REACT_APP_API_URL}address/updateAddress/${id}`, formData);
    //         modalAction();
    //         fetchAddresses();
    //         setId(0);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    useEffect(() => {
        fetchAddresses()
    }, [])

    const openConfirmationModal = (actionType) => {
        setActionType(actionType);
        setIsConfirmModalOpen(true);
    }

    const closeConfirmationModal = () => {
        setIsConfirmModalOpen(false);
        setActionType('');
    }

    const closeNotFoundModal = () => {
        setIsNotFoundModalOpen(false);
    }

    const confirmAction = () => {
        if (actionType === 'delete') {
            handleDelete();
        }else if (actionType === 'update') {
            handleUpdateRequest();
        } else if (actionType === 'directDelete') {  
           handleDirectDelete(id);
    }
           closeConfirmationModal();
        
    }

    return (
        <>

        <div className="container">
            <h5>Saved Addresses</h5>
            <div className="row address-section">

                {/* <div className="col-lg-12">


                    <Link to="/address" class="site-btn" >Add a new address</Link>

                </div> */}


               <div className="col-lg-12 container">               
                <div className='row card-deck '>
                {
                    addresses.map((address, index) => (
                        <>
                            <div key={address.addressid} className="col-lg-6">
                                <div class="services__item bg-secondary bg-opacity-10 mb-3 seller-info">
                                    {/* <i class="fa fa-car"></i> */}
                                    <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className="heading-custom-font-1">Address - {index + 1}</h4>

                                    <div className="d-flex align-items-center gap-4">

                                        {/* Circle Selector */}
                                        <span
                                        onClick={() => handleSetDefault(address.addressid)}
                                        className="d-inline-block rounded-circle border border-2 border-success" style={{width: 20, height: 20, backgroundColor: address.is_default ? 'green' : 'white', cursor: 'pointer'}}
                                        title={address.is_default ? 'Default address' : 'Set as default'}
                                        ></span>

                                    <button className='fs-4 btn btn-warning' onClick={()=>{
                                        modalAction()
                                        setId(address.addressid)
                                        getDetails(address.addressid)
                                    }}>
                                        Edit
                                    </button>
                                    <button className='fs-4 btn btn-danger' onClick={()=>{
                                       setId(address.addressid)
                                       openConfirmationModal("directDelete")
                                     }}>
                                        Delete
                                    </button>
                                    </div>
                                    </div>
                                    <p>Name - {address.name}</p>
                                    <p>Address - {address.line1}</p>
                                    <p>City - {address.city}, {address.state}, {address.country}, {address.pin},</p>
                                    <p>Landmark - {address.landmark}</p>
                                    <p>Contact - {address.contact}&nbsp;&nbsp; {address.alternatecontact}</p>
                                </div>
                            </div>
                        </>
                    ))
                }
                {/* Edit address-modal */}
                <div className={`modal fade  ${isModalOpen ? 'show d-block' : ''}`} id='addressModal' tabindex="-1" aria-hidden={!isModalOpen}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body"> 
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="m-0">Edit Address</h5>
                              <span 
                            className='cursor-pointer fs-1' 
                                onClick={modalAction} 
                                style={{
                                   fontWeight: 'bold',
                                   cursor: 'pointer',
                                   userSelect: 'none'
                                }}
                              >&times;</span>
                           </div>  
                                <div className="form-group">  
                                    <label htmlFor="name" className="form-label fs-4">
                                        Name*</label>
                                    <input type="text" id="name" name="name" className="form-control fs-5" placeholder="Name" value={formData.name} onChange={handleChange}/>
                                </div>
                                 <div className="row">
                                <div className="form-group col-md-6 "> 
                                    <label htmlFor="userphone" className="form-label fs-4">Contact*</label>
                                    <input type="tel" id="userphone" name="contact" className="form-control fs-5" placeholder="Contact" value={formData.contact} onChange={handleChange}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="alternatephone" className="form-label fs-4">Alternate Contact</label>
                                    <input type="tel" id="alternatephone" name='alternatecontact' className="form-control fs-5" placeholder="Alternate Contact" value={formData.alternatecontact} onChange={handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="useraddress" className="form-label fs-4">Address*</label>
                                <input type="text" id="useraddress" name="line1" className="form-control fs-5" placeholder="Enter your Address" value={formData.line1} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                    <label htmlFor="landmark" className="form-label fs-4">Landmark</label>
                                    <input type="text" id="landmark" name="landmark" className="form-control fs-5" placeholder="Landmark" value={formData.landmark} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pin" className="form-label fs-4">
                                        Pin*</label>
                                    <input type="number" id="pin" name="pin" className="form-control fs-5" placeholder="Pin" value={formData.pin} onChange={handleChange} onBlur={fillpindetails}/>
                                </div>
                            <div className='row'>
                                <div className="form-group col-md-4">
                                    <label htmlFor="city" className="form-label fs-4">City*</label>
                                    <input type="text" id="city" className="form-control fs-5" placeholder="City" value={formData.city} disabled/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="state" className="form-label fs-4">
                                        State*</label>
                                    <input type="text" id="state" className="form-control fs-5" placeholder="State" value={formData.state} disabled/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="country" className="form-label fs-4">
                                        Country*</label>
                                    <input type="text" id="country" className="form-control fs-5" placeholder="Country" value={formData.country} disabled/>
                                </div>
                            </div>
                        </div>
                            <div className='modal-footer'>
                                <button type="button" class="btn btn-danger btn-lg  fs-3 px-4"  onClick={()=>openConfirmationModal("delete")}>Delete</button>
                                <button type="button" class="btn btn-success btn-lg  fs-3 px-4"  onClick={handleUpdate}>Update</button>
                            </div>
                        </div>
                   </div>
                </div>
                
                <div className={`modal fade show ${isConfirmModalOpen ? 'show d-block' : ''}`} id="confirmationModal"  aria-hidden={!isConfirmModalOpen}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className='fs-3'> Are you sure you want to {actionType === 'directDelete' ? 'delete' : actionType} this address?</p>
                            </div>
                                <div className='modal-footer'>
                                   <button className="btn btn-danger btn-lg fs-4" onClick={confirmAction}>Confirm</button>
                                   <button className="btn btn-secondary btn-lg fs-4" onClick={closeConfirmationModal}>Cancel</button>
                                </div>
                        </div>
                    </div>
               </div>

             <div className={`modal fade ${isAlertModalOpen ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden={!isAlertModalOpen}>
                  <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                         <div className="modal-body">
                             <p className='fs-3'>{alertMessage}</p>
                           </div>
                           <div className='modal-footer'>
                             <button className="btn btn-danger btn-lg fs-4"  onClick={closeAlertModal}>Close</button>
                            </div> 
                        </div>
                    </div>
                </div>
                

                        
                        <div className={`modal fade ${isNotFoundModalOpen ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden={!isNotFoundModalOpen}>
                            <div className="modal-dialog modal-dialog-centered">
                               <div className="modal-content">
                                   <div className="modal-body">
                                       <p className='fs-3'>No changes made to the address.</p>
                                   </div>
                                  <div className='modal-footer'>
                                     <button className="btn btn-danger btn-lg fs-4" onClick={closeNotFoundModal}>Close</button>
                                   </div>                                   
                                </div>
                            </div>
                        </div>
                           
                {/* Modal ends here */} 

            </div>
        </div>

    </div>
    </div>
    </>
  );
}
export default AddressListData;