import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {  toast } from 'react-toastify';

import axios from 'axios';

const QuickFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const stars = [1, 2, 3, 4, 5];

  const navigate = useNavigate()

  function handleRating(star) {
    setRating(star);
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // console.log(`mobile = ${mobile}, subject = ${subject}, rating = ${rating}`);
    if(rating==0)
    {
      toast.error("Rating can not be zero.")
      return 
    }
    try
    {
      let res = await axios.post(`${process.env.REACT_APP_API_URL}quickfeedback/addfeedback`,{
        rating,
        mobile,
        subject
      })
      // console.log(res);
      navigate('/')
    }
    catch(err)
    {
      // console.log(err);
      toast.error("Error in submitting quick feedback!")
      return
    }
  }

  return (
    <>
    
      <section class='blog about-blog'>
        <div class='container'>
          <div class='blog-heading about-heading'>
            <h1 class='heading'>Feedback</h1>
          </div>
        </div>
      </section>
      {/* d-flex justify-content-center align-items-center w-100 */}
      <section class='contact product footer-padding'>
        <div class='container'>
          <div class='contact-section'>
            <div class='row d-flex justify-content-center align-items-center'>
              <div class='col-lg-6'>
                <div class='question-section login-section'>
                  <div class='review-form box-shadows'>
                    <div class='review-form-text'>
                      <h1 class='heading-custom-font-1'>Send Quick Feedback</h1>
                    </div>
                    <form onSubmit={handleSubmit} className='d-flex flex-column gap-4'>
                    <div className='d-flex w-100 justify-content-evenly px-2 align-items-center'>
                        <div className='fs-1'>
                          Rating :
                        </div>
                        <div className='d-flex fs-2 gap-4 justify-content-center align-items-center'>
                        {stars.map((star, index) => (
                          <span
                            key={index}
                            className={`star ${
                              hover >= star || rating >= star ? 'star-active' : 'star-inactive'
                            }`}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      </div>
                      <div class='account-inner-form'>
                        <div class='review-form-name'>
                          <input
                          required
                            name='mobile'
                            type='tel'
                            id='mobile'
                            class='form-control'
                            placeholder='Mobile'
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                          />
                        </div>
                        <div class='review-form-name'></div>
                      </div>

                      <div class='review-textarea'>
                        <textarea
                          name='message'
                          class='form-control'
                          placeholder='Write Your Feedback...........'
                          id='floatingTextarea'
                          rows='3'
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                        ></textarea>
                      </div>
                      <button type='submit' className='shop-btn login-btn'>
                        Send Feedback
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default QuickFeedback;