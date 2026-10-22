import React, { useState } from 'react';
import loaderGif from '../../assets/images/loader.gif';

const Refund = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          {/* <div className='blog-bradcrum'>
            <span>
              <a href='index-2.html'>Home</a>
            </span>
            <span className='devider'>/</span>
            <span>
              <a href='#'>Refund & Return Policy</a>
            </span>
          </div> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Refund & Return Policy</h1>
          </div>
        </div>
      </section>
      <section className='product privacy footer-padding'>
      {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <img
              src={loaderGif}
              alt='Loading...'
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        )}
        {!loading && (
        <div className='container'>
          <div className='privacy-section'>
            <div className='policy'>
              <p className='policy-details pb-4'>
                Thank you for shopping at Gorcji!<br /> 
                We offer refund and/or exchange within the first 30 days of your purchase. If 30 days have passed since your purchase, you will not be offered a refund and/or exchange of any kind.
              </p>
              <h5 className='intro-heading'>Eligibility for Refunds and Exchanges</h5>
              <p className='policy-details'>
                - Your item must be unused and in the same condition that you received it.<br />
                - The item must be in the original packaging.<br />
                - To complete your return, we require a receipt or proof of purchase.<br />
                - Only regular priced items may be refunded, sale items cannot be refunded.<br />
                - If the item in question was marked as a gift when purchased and shipped directly to you, you will receive a gift credit for the value of your return.
              </p>
            </div>
            <div className='policy'>
              <h5 className='intro-heading'>Exchanges (if applicable)</h5>
              <p className='policy-details'>
                We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at grocji@gmail.com. We will inform you of the address for the product to be sent.
              </p>
            </div>
            <div className='policy'>
              <h5 className='intro-heading'>Exempt Goods</h5>
              <p className='policy-details'>
                The following are exempt from refunds:<br />
                - Gift cards<br />
                - Some health and personal care items
              </p>
            </div>
            <div className='policy'>
              <h5 className='intro-heading'>Partial refunds (if applicable)</h5>
              <p className='policy-details'>
                - Any item not in its original condition, is damaged or missing parts for reasons not due to our error.<br />
                - Any item that is returned more than 30 days after delivery.
              </p>
              <p className='policy-details'>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
              </p>
              <p className='policy-details'>
                If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 7-10 days.
              </p>
            </div>
            <div className='policy'>
              <h5 className='intro-heading'>Late or missing refunds</h5>
              <p className='policy-details'>
                If you have not received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted.<br />
                If you have done all of this and still have not received your refund, please contact us at grocji@gmail.com or 8757499345.
              </p>
            </div>
            <div className='policy'>
              <h5 className='intro-heading'>Shipping</h5>
              <p className='policy-details'>
                - Please do not send the product back to the manufacturer. It must be sent to the address provided by the company via email or call.<br />
                - You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable!<br />
                - If you receive a refund, the cost of return shipping will be deducted from your refund.<br />
                - Depending on where you live, the time it may take for your exchanged product to reach you, may vary.<br /> 
                - Please note that we cannot guarantee that we will receive your returned item.
              </p>
            </div>
          </div>
        </div>
        )}
      </section>
    </>
  );
};

export default Refund;
