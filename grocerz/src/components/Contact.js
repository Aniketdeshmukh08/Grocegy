import React, { useEffect, useState } from 'react';
// import "../assets/css/style.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'react-toastify';
import loaderGif from '../assets/images/loader.gif';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [userid, setUserid] = useState(localStorage.getItem('userid'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCloseSuccess = () => {setSuccess(false);setSubmitted(false)};
  const handleCloseError = () => {setError(false);setSubmitted(false)};

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = 'Enter a valid email';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // console.log(formData)
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return; 
  }
    setLoading(true);
    setSubmitted(true);
    try {
      await axios.post( `${process.env.REACT_APP_API_URL}contact/addContact`, formData );
      // console.log('Server response:', response.data);
      setFormData({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        subject: '',
        message: '',
      });
      setErrors({});
      toast.success('The form is submitted successfully.');
      setSuccess(true);
    } catch (error) {
      setError(true);
      toast.error('Error submitting the form. Please try again.');
      // console.error('Error sending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };

  const connectwhatsappGrievance = () => {
    const phoneNumber = '+918757499255';
    const message = `Hi. I have some issues with my order.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };

  const [currentPhoneIndex, setCurrentPhoneIndex] = useState(0);
  const [showCallConfirmationModal, setShowCallConfirmationModal] = useState(false);
  const [showPhoneNumbersModal, setShowPhoneNumbersModal] = useState(false);
  const phoneNumbers = ['+918757499345', '+918757499344'];
  const handleCallClick = () => {
    setShowPhoneNumbersModal(false);
    setShowCallConfirmationModal(true); // Show the modal
  };
  const proceedWithCall = () => {
    const currentNumber = phoneNumbers[currentPhoneIndex];
    window.location.href = `tel:${currentNumber}`;

    // Update index for next click (wrap around if at the end)
    const newIndex = (currentPhoneIndex + 1) % phoneNumbers.length;
    setCurrentPhoneIndex(newIndex);
    setShowCallConfirmationModal(false);
  };
  const handlePhoneClick = () => {
    setShowCallConfirmationModal(false);
    setShowPhoneNumbersModal(true);
  };

  const handleEmailClick = () => {
    const emailAddress = 'grocji@gmail.com';
    window.location.href = `mailto:${emailAddress}`;
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}users/searchuser/${userid}`
      );

      const user = response.data[0];

      setFormData(prev => ({
        ...prev, 
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
    {/* Contact form Submission Modal */}
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

      <section class='blog about-blog'>
        <div class='container'>
          {/* <div class="blog-bradcrum">
                <span><a href="/">Home</a></span>
                <span class="devider">/</span>
                <span><a href="#">Contact</a></span>
            </div> */}
          <div class='blog-heading about-heading'>
            <h1 class='heading'>Contact</h1>
          </div>
        </div>
      </section>

      {/* <div class="breadcrumb-option">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="breadcrumb__links">
                <Link href="/" className="text-decoration-none">
                  <i class="fa fa-home"></i> Home
                </Link>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <section className="contact spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="contact__content">
                <div className="contact__address">
                  <h5>Contact info</h5>
                  <ul>
                    <li>
                      <h6>
                        <i class="fa fa-map-marker"></i> Address
                      </h6>
                      <p>
                      Gurgaon, Haryana, India
                      </p>
                    </li>
                    <li>
                      <h6>
                        <i class="fa fa-phone"></i> Phone
                      </h6>
                      <p>
                        <span>+91 9669787936</span>
                        <span>+91 9599171535</span>
                      </p>
                    </li>
                    <li>
                      <h6>
                        <i class="fa fa-headphones"></i> Support
                      </h6>
                      <p>
                        <a
                          href="https://preview.colorlib.com/cdn-cgi/l/email-protection"
                          className="__cf_email__ text-decoration-none"
                          data-cfemail="44173134342b36306a342c2b302b233625342c3d042329252d286a272b29"
                        >
                          <p>hashedbit@gmail.com</p>
                        </a>
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="contact__form">
                  <h5>SEND MESSAGE</h5>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    <button type="submit" className="site-btn">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact__map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48158.305462977965!2d-74.13283844036356!3d41.02757295168286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2e440473470d7%3A0xcaf503ca2ee57958!2sSaddle%20River%2C%20NJ%2007458%2C%20USA!5e0!3m2!1sen!2sbd!4v1575917275626!5m2!1sen!2sbd"
                  height="780"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Google Map"
                ></iframe>
              </div> 
            </div>
          </div>
        </div>
      </section> */}

      <section class='contact product footer-padding'>
        <div class='container'>
          <div class='contact-section'>
            <div class='row'>
              <div class='col-lg-6'>
                <div class='contact-info-section'>
                  <div class='contact-information'>
                    <h5 class='wrapper-heading'>Contact Information</h5>
                    <p class='paragraph'>
                      Fill the form below or write us .We will help you as soon
                      as possible.
                    </p>
                    <div className='d-block d-lg-none text-center my-5'>
                      <a className='btn btn-success rounded-pill fs-3 px-5 py-3'
                          href='#get-in-touch-section'
                      >
                        Get in Touch
                      </a>
                    </div>
                    <div class='contact-wrapper'>
                      <div class='row gy-5'>
                        <div class='col-6'>
                          <div
                            class='wrapper phone'
                            role='button'
                            onClick={handlePhoneClick}
                          >
                            <div class='wrapper-img'>
                              <span>
                                <svg
                                  width='44'
                                  height='44'
                                  viewBox='0 0 44 44'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <circle
                                    cx='22'
                                    cy='22'
                                    r='21.5'
                                    stroke='#34a853'
                                  ></circle>
                                  <path
                                    d='M10.4708 17.7624L10.4708 17.7624C10.4976 19.0577 10.9088 20.276 11.473 21.4906C13.5525 25.9672 16.7815 29.3804 21.081 31.7969C22.5665 32.6319 24.0756 33.2848 25.7334 33.4698L25.7335 33.4698C26.8399 33.5935 27.7241 33.3528 28.4392 32.5473L28.4392 32.5473C28.724 32.2265 29.0458 31.9115 29.3517 31.612C29.514 31.4532 29.6717 31.2987 29.8172 31.15L29.8174 31.1498C30.2031 30.7562 30.3337 30.4343 30.336 30.1731C30.3383 29.9141 30.2153 29.5973 29.8364 29.2104L29.8363 29.2104C28.988 28.3441 28.1276 27.4873 27.2602 26.637L27.2601 26.6369C26.8659 26.2503 26.5505 26.126 26.2959 26.1268C26.0403 26.1277 25.7225 26.2552 25.3251 26.6438L25.325 26.6439C24.8114 27.1458 24.3044 27.6511 23.8109 28.166L23.8108 28.1661C23.6684 28.3146 23.4735 28.4645 23.2169 28.5099C22.9464 28.5578 22.7021 28.4739 22.5009 28.341C22.2427 28.1708 21.9677 28.0004 21.686 27.8258C21.0293 27.4187 20.3358 26.9889 19.7325 26.4866C18.0622 25.0969 16.5823 23.48 15.5981 21.4476C15.4993 21.2439 15.4281 21.0037 15.4728 20.7408C15.5179 20.4753 15.6665 20.2715 15.8341 20.112L15.8342 20.1119C16.3521 19.6191 16.86 19.1182 17.3507 18.6035L17.3508 18.6034C17.7203 18.2159 17.84 17.9093 17.8397 17.663C17.8395 17.4176 17.7199 17.1127 17.3474 16.7286L17.3474 16.7286C16.4823 15.8366 15.605 14.9566 14.7136 14.0922C14.3582 13.7475 14.053 13.6318 13.7983 13.6338C13.5412 13.6359 13.2305 13.7585 12.8676 14.1078L10.4708 17.7624ZM10.4708 17.7624L10.4706 17.757M10.4708 17.7624L10.4706 17.757M10.4706 17.757C10.4433 16.8876 10.7133 16.1864 11.3505 15.6062M10.4706 17.757L11.3505 15.6062M11.3505 15.6062C11.6606 15.3245 11.9774 15.0025 12.2815 14.6935C12.4844 14.4873 12.6817 14.2868 12.8675 14.1079L11.3505 15.6062Z'
                                    fill='#34a853'
                                    stroke='#34a853'
                                  ></path>
                                  <path
                                    d='M32.2315 21.3816C32.0539 21.4122 31.876 21.4429 31.6979 21.4737C31.0372 19.0025 29.9235 16.9878 28.3306 15.4436C26.7374 13.8992 24.6913 12.8511 22.2058 12.2728C22.239 12.0279 22.2727 11.7796 22.3066 11.53C26.7277 12.1754 31.3242 15.906 32.4497 21.344C32.377 21.3565 32.3043 21.369 32.2315 21.3816Z'
                                    fill='#34a853'
                                    stroke='#34a853'
                                  ></path>
                                  <path
                                    d='M25.1799 18.6377C24.3285 17.812 23.2491 17.2404 21.9585 16.9053C21.9807 16.7507 22.0026 16.5975 22.0243 16.4457C22.0391 16.3421 22.0538 16.2392 22.0685 16.1369C24.6502 16.5866 27.1312 18.8191 27.7615 21.6523C27.6473 21.6723 27.5333 21.6922 27.419 21.7121C27.2786 21.7366 27.1375 21.7612 26.9946 21.7861C26.6295 20.5174 26.0301 19.4623 25.1799 18.6377Z'
                                    fill='#34a853'
                                    stroke='#34a853'
                                  ></path>
                                </svg>
                              </span>
                            </div>
                            <div class='wrapper-content'>
                              <h5 class='wrapper-heading'>Phone</h5>
                            </div>
                          </div>
                        </div>
                        <div class='col-6'>
                          <div
                            class='wrapper phone'
                            role='button'
                            onClick={handleEmailClick}
                          >
                            <div class='wrapper-img'>
                              <span>
                                <svg
                                  width='44'
                                  height='44'
                                  viewBox='0 0 44 44'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                    d='M22 43C33.598 43 43 33.598 43 22C43 10.402 33.598 1 22 1C10.402 1 1 10.402 1 22C1 33.598 10.402 43 22 43ZM22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    d='M11.0183 18.6455C11.2024 18.761 11.3464 18.8458 11.4851 18.9382C14.2825 20.8029 17.0792 22.6676 19.8759 24.5331C21.3894 25.5429 22.6125 25.5413 24.1329 24.5277C26.9304 22.663 29.7271 20.7975 32.5237 18.9328C32.6539 18.8465 32.7856 18.7634 32.9659 18.6478C32.9782 18.8042 32.9959 18.9212 32.9959 19.0391C32.9974 22.1169 32.9997 25.1939 32.9959 28.2718C32.9944 29.6582 32.1625 30.4854 30.773 30.4862C24.9186 30.4877 19.0641 30.4877 13.2096 30.4862C11.8456 30.4854 11.0037 29.6543 11.0022 28.3003C10.9983 25.2086 11.0006 22.1169 11.0014 19.0245C11.0022 18.9151 11.0114 18.8065 11.0183 18.6455Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                    d='M11.001 19.8174C11.001 19.7663 11.001 19.7152 11.001 19.6641C11.001 19.6641 11.001 19.664 11.001 19.664C11.0011 19.4508 11.0011 19.2376 11.0012 19.0245C11.0017 18.9566 11.0054 18.889 11.0098 18.8091C11.0126 18.7601 11.0155 18.7066 11.0181 18.6455C11.0841 18.6869 11.1449 18.7243 11.2021 18.7596C11.3047 18.8227 11.3959 18.8789 11.4849 18.9382M11.6145 19.0246C11.6167 19.026 11.6188 19.0274 11.6209 19.0288C11.7476 19.1133 11.8744 19.1978 12.0011 19.2823C12.001 19.6829 12.0009 20.0834 12.0008 20.4839C11.6675 20.2617 11.3342 20.0396 11.001 19.8174M19.3208 25.365C16.881 23.7376 14.4411 22.1107 12.0008 20.4839C12.0007 20.616 12.0007 20.7482 12.0006 20.8803C11.9998 23.3541 11.9989 25.8265 12.002 28.299L12.002 28.2991C12.0025 28.7664 12.1435 29.0368 12.2981 29.1898C12.4539 29.344 12.7318 29.4858 13.2097 29.4862L13.2094 30.4862L13.21 29.4862C13.2099 29.4862 13.2098 29.4862 13.2097 29.4862C19.064 29.4877 24.9183 29.4877 30.7726 29.4862L30.7728 30.4829L30.7723 29.4862C30.7724 29.4862 30.7725 29.4862 30.7726 29.4862C31.2688 29.4858 31.5467 29.3418 31.6992 29.1899C31.8512 29.0386 31.9952 28.7634 31.9957 28.2707L31.9957 28.2705C31.999 25.6758 31.9978 23.0816 31.9965 20.4862C32.3297 20.264 32.6629 20.0418 32.9961 19.8196C32.9961 19.7617 32.996 19.7037 32.996 19.6457C32.996 19.6443 32.996 19.6428 32.996 19.6414C32.9959 19.4406 32.9958 19.2399 32.9957 19.0391C32.9957 18.9617 32.9881 18.8846 32.9793 18.7965C32.9748 18.7505 32.9699 18.7014 32.9657 18.6478C32.9212 18.6763 32.8797 18.7029 32.8404 18.728C32.7205 18.8046 32.6216 18.8678 32.5236 18.9328C32.4704 18.9682 32.4173 19.0037 32.3641 19.0391C32.364 19.0392 32.3638 19.0393 32.3637 19.0394C32.2411 19.1212 32.1184 19.2029 31.9958 19.2847C31.996 19.545 31.9961 19.8053 31.9962 20.0655C31.9963 20.2057 31.9964 20.346 31.9965 20.4862C31.3081 20.9452 30.6197 21.4042 29.9313 21.8633C28.1836 23.0288 26.4356 24.1945 24.6874 25.3598L24.1327 24.5277L24.6874 25.3598C24.6874 25.3598 24.6874 25.3598 24.6874 25.3598C23.8278 25.9329 22.9502 26.288 22.0029 26.2892C21.055 26.2904 20.1783 25.9371 19.3208 25.365ZM19.3208 25.365L19.8742 24.5353L19.3207 25.365C19.3207 25.365 19.3208 25.365 19.3208 25.365ZM11.4849 18.9382C11.5281 18.967 11.5713 18.9958 11.6145 19.0246L11.4849 18.9382Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    d='M22.0007 14.0029C24.963 14.0029 27.9261 13.9983 30.8883 14.0052C32.1292 14.0083 33.0427 14.9295 32.9934 16.1149C32.9633 16.8296 32.5944 17.3418 32.0082 17.7308C29.4226 19.4476 26.8424 21.1722 24.2598 22.8944C23.8793 23.1485 23.5042 23.4112 23.1145 23.6515C22.3766 24.1075 21.6133 24.1275 20.8901 23.6492C17.8839 21.6605 14.8862 19.6594 11.8915 17.6538C11.1213 17.1377 10.8333 16.2889 11.0936 15.4378C11.3547 14.5837 12.1288 14.0068 13.07 14.0045C15.889 13.9968 18.7088 14.0014 21.5278 14.0014C21.6857 14.0029 21.8436 14.0029 22.0007 14.0029Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                    d='M32.0082 17.7308C32.5944 17.3418 32.9633 16.8296 32.9934 16.1149C33.0427 14.9295 32.1292 14.0083 30.8883 14.0052C28.7724 14.0003 26.6561 14.0012 24.5399 14.0022C23.6935 14.0025 22.8471 14.0029 22.0007 14.0029C21.8436 14.0029 21.6857 14.0029 21.5278 14.0014C20.759 14.0014 19.9902 14.001 19.2213 14.0007C17.1709 13.9998 15.1202 13.9989 13.07 14.0045C12.1288 14.0068 11.3547 14.5837 11.0936 15.4378C10.8333 16.2889 11.1213 17.1377 11.8915 17.6538C14.8862 19.6594 17.8839 21.6605 20.8901 23.6492C21.6133 24.1275 22.3766 24.1075 23.1145 23.6515C23.3977 23.4769 23.6732 23.2904 23.9487 23.104C24.0523 23.0339 24.1558 22.9638 24.2598 22.8944C24.9163 22.4566 25.5726 22.0186 26.229 21.5807C28.1545 20.2959 30.0799 19.0112 32.0082 17.7308ZM21.4417 22.8151C21.6574 22.9577 21.8376 23.0016 21.9909 23.0007C22.1486 22.9998 22.3464 22.9506 22.5888 22.8008L22.5896 22.8003C22.8536 22.6375 23.1029 22.4688 23.3716 22.287C23.4787 22.2145 23.5889 22.1399 23.7043 22.0628L23.705 22.0624C24.3607 21.6251 25.0165 21.1875 25.6725 20.7499C27.5985 19.4647 29.5255 18.179 31.4551 16.8977L31.4553 16.8976C31.8444 16.6394 31.9808 16.3923 31.9942 16.0729C32.0181 15.4929 31.5978 15.0071 30.886 15.0052M21.4417 22.8151C18.4378 20.8279 15.4419 18.8281 12.4482 16.823L21.4417 22.8151ZM12.0499 15.7302L12.0499 15.7303C11.9179 16.1618 12.0459 16.5534 12.448 16.8229M13.0727 15.0045L13.0724 15.0045C12.5581 15.0057 12.1793 15.3069 12.0499 15.7302M24.5417 15.0022C23.695 15.0025 22.848 15.0029 22.0007 15.0029H21.9984C21.8444 15.0029 21.6841 15.0029 21.523 15.0014C20.7548 15.0014 19.987 15.001 19.2194 15.0007C17.1695 14.9998 15.1212 14.9989 13.0727 15.0045M24.5417 15.0022C26.6573 15.0012 28.7714 15.0003 30.8859 15.0052L24.5417 15.0022Z'
                                    fill='#34a853'
                                  ></path>
                                </svg>
                              </span>
                            </div>
                            <div class='wrapper-content'>
                              <h5 class='wrapper-heading'>Email</h5>
                              <p class='paragraph'>grocji@gmail.com</p>
                            </div>
                          </div>
                        </div>
                        <div class='col-lg-12'>
                          <div class='address'>
                            <div class='contact-address'>
                              <div class='address-icon'>
                                <span>
                                  <svg
                                    width='44'
                                    height='44'
                                    viewBox='0 0 44 44'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M17.1611 17.6821C17.1848 20.3432 19.3626 22.4945 22.0205 22.4843C24.6735 22.4741 26.8518 20.2773 26.8314 17.629L26.8314 17.6289C26.8098 14.9632 24.6389 12.824 21.9718 12.8353C19.3106 12.8466 17.1362 15.0295 17.1611 17.6821ZM17.1611 17.6821L17.661 17.6776L17.1611 17.6823C17.1611 17.6822 17.1611 17.6821 17.1611 17.6821ZM13.836 18.3193L13.836 18.3183C13.8642 13.6208 16.7919 10.206 20.6315 9.6048C24.7202 8.96493 28.5519 11.3061 29.7792 15.2223L29.7792 15.2224C30.451 17.3646 30.2918 19.4599 29.2268 21.4239C27.4275 24.7397 25.5965 28.0381 23.7643 31.3387C23.2175 32.3236 22.6706 33.3088 22.1245 34.2946L22.1244 34.2948C22.0724 34.3887 22.0272 34.4449 21.9956 34.4762C21.9645 34.4453 21.9201 34.39 21.869 34.2978L21.869 34.2977C21.6067 33.8243 21.3445 33.3511 21.0822 32.8778C18.9688 29.0636 16.8558 25.2502 14.7605 21.4272C14.1161 20.2514 13.8307 18.9893 13.836 18.3193ZM13.3363 18.3153L13.336 18.3153L13.3363 18.3153Z'
                                      fill='#34a853'
                                      stroke='#34a853'
                                    ></path>
                                    <circle
                                      cx='22'
                                      cy='22'
                                      r='21.5'
                                      stroke='#34a853'
                                    ></circle>
                                  </svg>
                                </span>
                              </div>
                              <div class='address-content'>
                                <h5 class='wrapper-heading'>Address</h5>
                                <p class='paragraph'>Gurgaon, Haryana, India</p>
                              </div>
                            </div>
                            {/* <div class="contact-map">
                                                    <iframe
                                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224568.15030524903!2d76.9897491!3d28.42295755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1722529618520!5m2!1sen!2sin"
                                                        width="524" height="206" allowfullscreen="" loading="lazy"
                                                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                                                </div> */}
                          </div>
                        </div>

                        <div class='col-lg-12'>
                          <div class='address'>
                            <div class='contact-address'>
                              <div class='address-icon'>
                                <span>
                                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M34.925 9.00166C33.244 7.30419 31.2419 5.95827 29.0354 5.04233C26.829 4.12639 24.4623 3.65875 22.0733 3.66666C12.0633 3.66666 3.905 11.825 3.905 21.835C3.905 25.0433 4.74833 28.16 6.325 30.91L3.75833 40.3333L13.3833 37.8033C16.0417 39.2517 19.03 40.0217 22.0733 40.0217C32.0833 40.0217 40.2417 31.8633 40.2417 21.8533C40.2417 16.995 38.3533 12.43 34.925 9.00166ZM22.0733 36.9417C19.36 36.9417 16.7017 36.2083 14.3733 34.8333L13.8233 34.5033L8.10333 36.0067L9.625 30.4333L9.25833 29.865C7.7505 27.4579 6.95003 24.6753 6.94833 21.835C6.94833 13.5117 13.7317 6.72833 22.055 6.72833C26.0883 6.72833 29.8833 8.305 32.725 11.165C34.1323 12.5654 35.2475 14.2313 36.006 16.0661C36.7644 17.9009 37.151 19.868 37.1433 21.8533C37.18 30.1767 30.3967 36.9417 22.0733 36.9417ZM30.36 25.6483C29.9017 25.4283 27.665 24.3283 27.2617 24.1633C26.84 24.0167 26.5467 23.9433 26.235 24.3833C25.9233 24.8417 25.0617 25.8683 24.805 26.1617C24.5483 26.4733 24.2733 26.51 23.815 26.2717C23.3567 26.0517 21.89 25.5567 20.1667 24.0167C18.81 22.8067 17.9117 21.3217 17.6367 20.8633C17.38 20.405 17.6 20.1667 17.8383 19.9283C18.04 19.7267 18.2967 19.3967 18.5167 19.14C18.7367 18.8833 18.8283 18.6817 18.975 18.3883C19.1217 18.0767 19.0483 17.82 18.9383 17.6C18.8283 17.38 17.9117 15.1433 17.545 14.2267C17.1783 13.3467 16.7933 13.4567 16.5183 13.4383H15.6383C15.3267 13.4383 14.85 13.5483 14.4283 14.0067C14.025 14.465 12.8517 15.565 12.8517 17.8017C12.8517 20.0383 14.4833 22.2017 14.7033 22.495C14.9233 22.8067 17.9117 27.39 22.4583 29.3517C23.54 29.8283 24.3833 30.1033 25.0433 30.305C26.125 30.6533 27.115 30.5983 27.9033 30.4883C28.7833 30.36 30.5983 29.3883 30.965 28.325C31.35 27.2617 31.35 26.3633 31.2217 26.1617C31.0933 25.96 30.8183 25.8683 30.36 25.6483Z" fill="#34a853"/>
</svg>
                                </span>
                              </div>
                              <div class='address-content'>
                                <h5 class='wrapper-heading'>WhatsApp</h5>
                                <button
                                  onClick={connectwhatsapp}
                                  class='shop-btn'
                                >
                                  Connect on WhatsApp for Orders - 8757499345
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                <div className="address">
                  <div className="contact-address">
                    <div className="address-icon">
                      <span>
                        <svg
                          width="44"
                          height="44"
                          viewBox="0 0 44 44"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                    d='M22 43C33.598 43 43 33.598 43 22C43 10.402 33.598 1 22 1C10.402 1 1 10.402 1 22C1 33.598 10.402 43 22 43ZM22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    d='M11.0183 18.6455C11.2024 18.761 11.3464 18.8458 11.4851 18.9382C14.2825 20.8029 17.0792 22.6676 19.8759 24.5331C21.3894 25.5429 22.6125 25.5413 24.1329 24.5277C26.9304 22.663 29.7271 20.7975 32.5237 18.9328C32.6539 18.8465 32.7856 18.7634 32.9659 18.6478C32.9782 18.8042 32.9959 18.9212 32.9959 19.0391C32.9974 22.1169 32.9997 25.1939 32.9959 28.2718C32.9944 29.6582 32.1625 30.4854 30.773 30.4862C24.9186 30.4877 19.0641 30.4877 13.2096 30.4862C11.8456 30.4854 11.0037 29.6543 11.0022 28.3003C10.9983 25.2086 11.0006 22.1169 11.0014 19.0245C11.0022 18.9151 11.0114 18.8065 11.0183 18.6455Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                    d='M11.001 19.8174C11.001 19.7663 11.001 19.7152 11.001 19.6641C11.001 19.6641 11.001 19.664 11.001 19.664C11.0011 19.4508 11.0011 19.2376 11.0012 19.0245C11.0017 18.9566 11.0054 18.889 11.0098 18.8091C11.0126 18.7601 11.0155 18.7066 11.0181 18.6455C11.0841 18.6869 11.1449 18.7243 11.2021 18.7596C11.3047 18.8227 11.3959 18.8789 11.4849 18.9382M11.6145 19.0246C11.6167 19.026 11.6188 19.0274 11.6209 19.0288C11.7476 19.1133 11.8744 19.1978 12.0011 19.2823C12.001 19.6829 12.0009 20.0834 12.0008 20.4839C11.6675 20.2617 11.3342 20.0396 11.001 19.8174M19.3208 25.365C16.881 23.7376 14.4411 22.1107 12.0008 20.4839C12.0007 20.616 12.0007 20.7482 12.0006 20.8803C11.9998 23.3541 11.9989 25.8265 12.002 28.299L12.002 28.2991C12.0025 28.7664 12.1435 29.0368 12.2981 29.1898C12.4539 29.344 12.7318 29.4858 13.2097 29.4862L13.2094 30.4862L13.21 29.4862C13.2099 29.4862 13.2098 29.4862 13.2097 29.4862C19.064 29.4877 24.9183 29.4877 30.7726 29.4862L30.7728 30.4829L30.7723 29.4862C30.7724 29.4862 30.7725 29.4862 30.7726 29.4862C31.2688 29.4858 31.5467 29.3418 31.6992 29.1899C31.8512 29.0386 31.9952 28.7634 31.9957 28.2707L31.9957 28.2705C31.999 25.6758 31.9978 23.0816 31.9965 20.4862C32.3297 20.264 32.6629 20.0418 32.9961 19.8196C32.9961 19.7617 32.996 19.7037 32.996 19.6457C32.996 19.6443 32.996 19.6428 32.996 19.6414C32.9959 19.4406 32.9958 19.2399 32.9957 19.0391C32.9957 18.9617 32.9881 18.8846 32.9793 18.7965C32.9748 18.7505 32.9699 18.7014 32.9657 18.6478C32.9212 18.6763 32.8797 18.7029 32.8404 18.728C32.7205 18.8046 32.6216 18.8678 32.5236 18.9328C32.4704 18.9682 32.4173 19.0037 32.3641 19.0391C32.364 19.0392 32.3638 19.0393 32.3637 19.0394C32.2411 19.1212 32.1184 19.2029 31.9958 19.2847C31.996 19.545 31.9961 19.8053 31.9962 20.0655C31.9963 20.2057 31.9964 20.346 31.9965 20.4862C31.3081 20.9452 30.6197 21.4042 29.9313 21.8633C28.1836 23.0288 26.4356 24.1945 24.6874 25.3598L24.1327 24.5277L24.6874 25.3598C24.6874 25.3598 24.6874 25.3598 24.6874 25.3598C23.8278 25.9329 22.9502 26.288 22.0029 26.2892C21.055 26.2904 20.1783 25.9371 19.3208 25.365ZM19.3208 25.365L19.8742 24.5353L19.3207 25.365C19.3207 25.365 19.3208 25.365 19.3208 25.365ZM11.4849 18.9382C11.5281 18.967 11.5713 18.9958 11.6145 19.0246L11.4849 18.9382Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    d='M22.0007 14.0029C24.963 14.0029 27.9261 13.9983 30.8883 14.0052C32.1292 14.0083 33.0427 14.9295 32.9934 16.1149C32.9633 16.8296 32.5944 17.3418 32.0082 17.7308C29.4226 19.4476 26.8424 21.1722 24.2598 22.8944C23.8793 23.1485 23.5042 23.4112 23.1145 23.6515C22.3766 24.1075 21.6133 24.1275 20.8901 23.6492C17.8839 21.6605 14.8862 19.6594 11.8915 17.6538C11.1213 17.1377 10.8333 16.2889 11.0936 15.4378C11.3547 14.5837 12.1288 14.0068 13.07 14.0045C15.889 13.9968 18.7088 14.0014 21.5278 14.0014C21.6857 14.0029 21.8436 14.0029 22.0007 14.0029Z'
                                    fill='#34a853'
                                  ></path>
                                  <path
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                    d='M32.0082 17.7308C32.5944 17.3418 32.9633 16.8296 32.9934 16.1149C33.0427 14.9295 32.1292 14.0083 30.8883 14.0052C28.7724 14.0003 26.6561 14.0012 24.5399 14.0022C23.6935 14.0025 22.8471 14.0029 22.0007 14.0029C21.8436 14.0029 21.6857 14.0029 21.5278 14.0014C20.759 14.0014 19.9902 14.001 19.2213 14.0007C17.1709 13.9998 15.1202 13.9989 13.07 14.0045C12.1288 14.0068 11.3547 14.5837 11.0936 15.4378C10.8333 16.2889 11.1213 17.1377 11.8915 17.6538C14.8862 19.6594 17.8839 21.6605 20.8901 23.6492C21.6133 24.1275 22.3766 24.1075 23.1145 23.6515C23.3977 23.4769 23.6732 23.2904 23.9487 23.104C24.0523 23.0339 24.1558 22.9638 24.2598 22.8944C24.9163 22.4566 25.5726 22.0186 26.229 21.5807C28.1545 20.2959 30.0799 19.0112 32.0082 17.7308ZM21.4417 22.8151C21.6574 22.9577 21.8376 23.0016 21.9909 23.0007C22.1486 22.9998 22.3464 22.9506 22.5888 22.8008L22.5896 22.8003C22.8536 22.6375 23.1029 22.4688 23.3716 22.287C23.4787 22.2145 23.5889 22.1399 23.7043 22.0628L23.705 22.0624C24.3607 21.6251 25.0165 21.1875 25.6725 20.7499C27.5985 19.4647 29.5255 18.179 31.4551 16.8977L31.4553 16.8976C31.8444 16.6394 31.9808 16.3923 31.9942 16.0729C32.0181 15.4929 31.5978 15.0071 30.886 15.0052M21.4417 22.8151C18.4378 20.8279 15.4419 18.8281 12.4482 16.823L21.4417 22.8151ZM12.0499 15.7302L12.0499 15.7303C11.9179 16.1618 12.0459 16.5534 12.448 16.8229M13.0727 15.0045L13.0724 15.0045C12.5581 15.0057 12.1793 15.3069 12.0499 15.7302M24.5417 15.0022C23.695 15.0025 22.848 15.0029 22.0007 15.0029H21.9984C21.8444 15.0029 21.6841 15.0029 21.523 15.0014C20.7548 15.0014 19.987 15.001 19.2194 15.0007C17.1695 14.9998 15.1212 14.9989 13.0727 15.0045M24.5417 15.0022C26.6573 15.0012 28.7714 15.0003 30.8859 15.0052L24.5417 15.0022Z'
                                    fill='#34a853'
                                  ></path>
                        </svg>
                      </span>
                     </div>
                    <div className="address-content">
                      <h5 className="wrapper-heading">Grievance</h5>
                      <button
                                  onClick={connectwhatsappGrievance}
                                  class='shop-btn'
                                >
                                  Connect on WhatsApp for Complain - 8757499255
                                </button>
                      {/* <button
                        onClick={() => window.open('sms:+918757499255', '_self')}
                        className="shop-btn"
                      >
                        Send SMS to - 8757499255
                      </button> */}
                    </div>
                            </div>
                            <div className='mt- 4 d-flex gap-1 flex-wrap'>
                              <Link to='/feedback' className='shop-btn'>
                                Feedback
                              </Link>
                              <Link to='/complainform' className='shop-btn'>
                                Complain
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id='get-in-touch-section' class='col-lg-6'>
                <div class='question-section login-section '>
                  <div class='review-form box-shadows'>
                    <div class='review-form-text'>
                      <h1 class='heading-custom-font-1'>Get In Touch</h1>
                      {/* <img src="assets/images/homepage-one/vector-line.png" alt="img"/> */}
                    </div>
                    {/* {loading && (
                      <div className='loader-div'>
                        <img className='loader-img'
                          src={loaderGif}
                          alt='Loading...'/>
                      </div>
                    )} */}
                    
                    {/* {!loading && ( */}
                    <form onSubmit={handleSubmit}>
                      <div class=' account-inner-form'>
                        <div class='review-form-name'>
                          {/* <label for="fname" class="form-label">Name*</label> */}
                          <input
                            name='name'
                            type='text'
                            id='fname'
                            class='form-control'
                            placeholder='Name'
                            value={formData.name}
                            onChange={handleChange}
                          />
                          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
                        </div>
                        <div class='review-form-name'>
                          {/* <label for="email" class="form-label">Email*</label> */}
                          <input
                            name='email'
                            type='email'
                            id='email'
                            class='form-control'
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                        </div>
                        <div class='review-form-name'>
                          <input
                            name='mobile'
                            type='tel'
                            id='mobile'
                            class='form-control'
                            placeholder='Mobile'
                            value={formData.mobile}
                            onChange={handleChange}
                          />
                          {errors.mobile && <small style={{ color: "red" }}>{errors.mobile}</small>}
                        </div>
                        <div class='review-form-name'>
                          {/* <label for="subject" class="form-label">Subject*</label> */}
                          <input
                            name='subject'
                            type='text'
                            id='subject'
                            class='form-control'
                            placeholder='Subject'
                            value={formData.subject}
                            onChange={handleChange}
                          />
                          {errors.subject && <small style={{ color: "red" }}>{errors.subject}</small>}
                        </div>
                      </div>
                      <div class='review-textarea'>
                        {/* <label for="floatingTextarea">Message*</label> */}
                        <textarea
                          name='message'
                          class='form-control'
                          placeholder='Write Message...........'
                          id='floatingTextarea'
                          rows='3'
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                        {errors.message && <small style={{ color: "red" }}>{errors.message}</small>}
                      </div>
                      {/* <div class="login-btn">
                                    <a href="#" class="shop-btn">Send Now</a>
                                </div> */}
                      <button type='submit' className='shop-btn login-btn'>
                        Send Message
                      </button>
                    </form>
                    {/* )} */}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal */}
      {showCallConfirmationModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <div className="modal-dialog modal-dialog-centered"> 
          <div className="modal-content">
            <div className="modal-body">
              <p className="text-dark fs-3">Do you want to proceed with the call?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary fs-3" onClick={proceedWithCall}>Confirm</button>
              <button type="button" className="btn btn-danger fs-3" onClick={()=>setShowCallConfirmationModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      )}
      {/* Modal tp display phone numbers */}
      {showPhoneNumbersModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <p>Phone Numbers</p>
              </div>
              <div className="modal-body py-5">
                {phoneNumbers.map((phoneNumber, index) => (
                  <p key={index} className="fs-3">
                    {phoneNumber}
                  </p>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type='button'
                  className='btn btn-primary fs-3'
                  onClick={handleCallClick}
                >
                  Call
                </button>
                <button
                  type="button"
                  className="btn btn-secondary fs-3"
                  onClick={() => setShowPhoneNumbersModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;