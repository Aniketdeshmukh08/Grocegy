import React from 'react';
import { Link } from 'react-router-dom';

const GrocerySection = () => {
  return (
    <div className='row g-4'>
      {/* Left Section */}
      <div className='col-md-6 m-auto'>
        <div className='product-wrapper wrapper-left '>
          <div className='wrapper-info'>
            <span className='wrapper-subtitle'>&nbsp;</span>
            <h3 className='wrapper-details'>
              Flat 5% Discount&nbsp;
              <br />
              on First Order
            </h3>
            {/* <Link to="/category/fruit20420" className="shop-btn">Shop Now
                            <span>
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.45312" y="0.914062" width="9.25346" height="2.05632" transform="rotate(45 1.45312 0.914062)"></rect>
                                    <rect x="8" y="7.45703" width="9.25346" height="2.05632" transform="rotate(135 8 7.45703)"></rect>
                                </svg>
                            </span>
                        </Link> */}
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className='col-md-6 m-auto'>
        <div className='product-wrapper wrapper-right min-section'>
          <div className='wrapper-info'>
            <span className='wrapper-subtitle'>&nbsp;</span>
            <h3 className='wrapper-details'>
              Flat 5% Discount&nbsp;
              <br />
              on Orders above 1000
            </h3>
            {/* <Link to="/category/fruit20420" className="shop-btn">Shop Now
                            <span>
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.45312" y="0.914062" width="9.25346" height="2.05632" transform="rotate(45 1.45312 0.914062)"></rect>
                                    <rect x="8" y="7.45703" width="9.25346" height="2.05632" transform="rotate(135 8 7.45703)"></rect>
                                </svg>
                            </span>
                        </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrocerySection;
