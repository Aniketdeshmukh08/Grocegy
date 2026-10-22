import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loaderGif from '../assets/images/loader.gif';
const Complainform = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    orderid: '',
    subject: '',
    complain_desc: '',
  });
  const [userid, setUserid] = useState(localStorage.getItem('userid'));

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    setError(false);
    setSuccess(false);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}complains/addcomplain`,
        formData
      );
      setFormData(prev => ({
        ...prev,
        orderid: '',
        subject: '',
        complain_desc: '',
      }))
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error sending data:', error);
      setLoading(false);
      setError(true);

    }
  };
  const handleCloseSuccess = () => {setSuccess(false);setSubmitted(false)};
  const handleCloseError = () => {setError(false);setSubmitted(false)};

  const fetchDetails = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}users/searchuser/${userid}`
      );
  
      const user = response.data[0];
  
      setFormData(prev => ({
        ...prev, 
        userid: userid,
        name: user.name, 
        email: user.email, 
        mobile: user.mobile,
      }));   
    } catch (err) {
      console.error('Error fetching form data', err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setUserid(localStorage.getItem('userid'));
  }, []);

  useEffect(() => {
    userid && fetchDetails();
  }, [userid]);

  return (
    <>
      <section className='blog about-blog mb-5'>
        <div className='container'>
          <div className='blog-heading about-heading text-center'>
            <h1 className='heading'>Complain Form</h1>
          </div>
        </div>
      </section>

      <div className='container mb-5 '>
        {loading && (
          <div className='loader-div'>
          <img className='loader-img'
            src={loaderGif}
            alt='Loading...'/>
        </div>
        )}
        {!loading && (
          <div className='row justify-content-center'>
            <div className='col-lg-12'>
              <div className='question-section login-section'>
                <div className='review-form box-shadows shadow-lg p-4'>
                  <div className='review-form-text mb-4'></div>
                  <form onSubmit={handleSubmit}>
                    <div className='account-inner-form'>
                      <div className='mb-3'>
                        <input
                          name='name'
                          type='text'
                          id='fname'
                          className='form-control'
                          placeholder='Name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='email'
                          type='email'
                          id='email'
                          className='form-control'
                          placeholder='Email'
                          value={formData.email}
                          onChange={handleChange}
                          
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='mobile'
                          type='text'
                          id='mobile'
                          className='form-control'
                          placeholder='Mobile'
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='orderid'
                          type='text'
                          id='orderid'
                          className='form-control'
                          placeholder='Order ID'
                          value={formData.orderid}
                          onChange={handleChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='subject'
                          type='text'
                          id='subject'
                          className='form-control'
                          placeholder='Subject'
                          value={formData.subject}
                          onChange={handleChange}
                         
                        />
                      </div>
                    </div>
                    <div className='mb-3'>
                      <textarea
                        name='complain_desc'
                        className='form-control'
                        placeholder='Write Message...........'
                        id='floatingTextarea'
                        rows='4'
                        value={formData.complain_desc}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type='submit' className='shop-btn login-btn'>
                    Send Message
                  </button>         

                  {/* Modal for Sucess Or error Message   */}
                   <div
                    className={`modal fade ${(submitted && (success || error) ) ? "show d-block" : ""}`}
                    tabIndex="-1"
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          {success ? <h5 className="modal-title text-success fs-1">Success</h5> :  <h5 className="modal-title text-danger fs-1">Error</h5>}
                          <button
                            type="button"
                            className="btn-close pr-5"
                            onClick={success ? handleCloseSuccess : handleCloseError}
                          ></button>
                        </div>
                        <div className="modal-body py-5">
                            {success ?  <p>Your form was submitted successfully!</p>: <p>There was an error submitting your form. Please try again.</p>}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary fs-5"
                            onClick={success ? handleCloseSuccess : handleCloseError}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  </form>
                </div>
                  </div>
              </div>
            </div>
        )}
          </div>
        
      

    </>
  );
};

export default Complainform;
