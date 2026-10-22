import React, { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [formData, setFormData] = useState({
    userid: "",
    name: "",
    email: "",
    mobile: "",
    complain_desc: ""
  });

  const [orderIds, setOrderIds] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userid, setUserid] = useState(localStorage.getItem('userid'));
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = 'Enter a valid email';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.complain_desc.trim()) newErrors.complain_desc = 'Feedback is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));

    if (name === "name" && value !== "") {
      setError(null);

      axios
        .get(`${process.env.REACT_APP_API_URL}orders/getOrderIdsByName/${value}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setOrderIds(response.data);
          } else {
            setOrderIds([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching order IDs:", error);
          setError("Error fetching order IDs. Please try again.");
          setOrderIds([]);
        });
    } else {
      setOrderIds([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setSubmitted(true);
    setError(false);
    setSuccess(false);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}feedback/createFeedback`, {
        userid: formData.userid,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        message: formData.complain_desc
      });

      setFormData(prev => ({
        userid: formData.userid,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        complain_desc: ""
      }));
      setSuccess(true);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setError("Something went wrong");
    }
  };

  const handleCloseModal = () => {
    setError(null);
    setSubmitted(false);
    setSuccess(false);
  };

  const fetchDetails = async (userid) => {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}users/searchuser/${userid}`
      );

      const user = response.data[0];

      response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getByuserId/${userid}`
      );

      let address = '';

      if (response.data.length !== 0) {
        const addressid = response.data[0].addressid;

        response = await axios.get(
          `${process.env.REACT_APP_API_URL}address/addressById/${addressid}`
        );

        address = response.data[0].line1;
      }

      setFormData(prev => ({
        ...prev,
        userid: userid,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: address
      }));
    } catch (err) {
      console.error('Error fetching form data', err.message);
    }
  };

  useEffect(() => {
    setUserid(localStorage.getItem('userid'));
  }, []);

  useEffect(() => {
    userid && fetchDetails(userid);
  }, [userid]);

  return (
    <>
      <section className="blog about-blog">
        <div className="container">
          <div className="blog-heading about-heading">
            <h1 className="heading">Feedback</h1>
          </div>
        </div>
      </section>

      <section className="contact product footer-padding spad pt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
              <div className="question-section">
                <div className="review-form box-shadows">
                  <div className="review-form-text text-center mb-4">
                    <h1 className="heading-custom-font-1">Get In Touch</h1>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="account-inner-form">
                      <div className="form-group form-control-custom">
                        <input 
                          name="name" 
                          type="text" 
                          id="fname" 
                          className="form-control" 
                          placeholder="Name"
                          value={formData.name} 
                          onChange={handleChange} 
                        />
                        {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
                      </div>

                      <div className="form-group">
                        {orderIds.length > 0 ? (
                          <select
                            name="orderid"
                            className="form-control"
                            value={formData.orderid}
                            onChange={handleChange}
                          >
                            <option value="">Select Order ID (Optional)</option>
                            {error ? (
                              <option>{error}</option>
                            ) : (
                              orderIds.map((order, index) => (
                                <option key={index} value={order.order_id}>
                                  {order.order_id}
                                </option>
                              ))
                            )}
                          </select>
                        ) : (
                          <input
                            name="orderid"
                            type="text"
                            className="form-control"
                            placeholder="Enter your Order ID (Optional)"
                            value={formData.orderid}
                            onChange={handleChange}
                          />
                        )}
                      </div>

                      <div className="form-group">
                        <input 
                          name="email" 
                          type="email" 
                          id="email" 
                          className="form-control"
                          placeholder="Email" 
                          value={formData.email} 
                          onChange={handleChange} 
                        />
                        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                      </div>

                      <div className="form-group">
                        <input 
                          name="mobile" 
                          type="tel" 
                          id="mobile" 
                          className="form-control"
                          placeholder="Mobile" 
                          value={formData.mobile} 
                          onChange={handleChange} 
                        />
                        {errors.mobile && <small style={{ color: "red" }}>{errors.mobile}</small>}
                      </div>

                      <div className="form-group">
                        <input 
                          name="address" 
                          type="text" 
                          id="address" 
                          className="form-control"
                          placeholder="Address" 
                          value={formData.address} 
                          onChange={handleChange} 
                        />
                      </div>

                      <div className="form-group">
                        <input 
                          name="subject" 
                          type="text" 
                          id="subject" 
                          className="form-control"
                          placeholder="Subject" 
                          value={formData.subject} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <textarea 
                        name="complain_desc" 
                        className="form-control" 
                        placeholder="Write Your Feedback..........."
                        id="floatingTextarea" 
                        rows="5" 
                        value={formData.complain_desc} 
                        onChange={handleChange}
                      />
                      {errors.complain_desc && <small style={{ color: "red" }}>{errors.complain_desc}</small>}
                    </div>

                    <div className="text-center">
                      <button type="submit" className="shop-btn login-btn">
                        Send Feedback
                      </button>
                    </div>
                  </form>

                 

                  {(success || error) && (
                    <div className='popup-overlay'>
                      <div className='popup-content'>
                        {success ? <h3 className="fs-1 text-success">Success</h3> : <h3 className="fs-1 text-danger">Error</h3>}
                        {success ? <h3>Your feedback was submitted successfully!</h3> : <h3>There was an error submitting your feedback. Please try again.</h3>}
                        <button className='btn shop-btn bg-success' onClick={handleCloseModal}>
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Feedback;
