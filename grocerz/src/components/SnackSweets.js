import React from 'react';
import { Link } from 'react-router-dom';

const SnackSweets = () => {
    return (
        <>
            <div className='container'>
                <div class="grocery-section">
                    <div class="row g-5">
                        <div class="col-md-6">
                            <Link to='/category/food&sweet' className='bg-sweets'>
                                <div class="product-wrapper">
                                    <div class="wrapper-info">
                                        {/* <span class="wrapper-subtitle">Fresh Sweets</span> */}
                                        {/* <h3 class="wrapper-details">Fresh Sweets</h3> */}
                                        <center>
                                            <a class="shop-btn" href='/category/biscu15589'>
                                                <h3 class="wrapper-details">Fresh Sweets</h3>
                                                Shop Now
                                            <span>
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="1.45312" y="0.914062" width="9.25346" height="2.05632"
                                                        transform="rotate(45 1.45312 0.914062)" />
                                                    <rect x="8" y="7.45703" width="9.25346" height="2.05632"
                                                        transform="rotate(135 8 7.45703)" />
                                                </svg>
                                            </span>
                                        </a>
                                        </center>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div class="col-md-6">
                            <Link to='/category/food&sweet' className='bg-snacks'>
                                <div class="product-wrapper">
                                    <div class="wrapper-info">
                                        {/* <span class="wrapper-subtitle">Evening Snacks</span> */}
                                        {/* <h3 class="wrapper-details">Evening Snacks</h3> */}
                                        <center>
                                            
                                            <a class="shop-btn" href='/category/biscu15589'>
                                                <h3 class="wrapper-details">Evening Snacks</h3>
                                                Shop Now
                                            <span>
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="1.45312" y="0.914062" width="9.25346" height="2.05632"
                                                        transform="rotate(45 1.45312 0.914062)" />
                                                    <rect x="8" y="7.45703" width="9.25346" height="2.05632"
                                                        transform="rotate(135 8 7.45703)" />
                                                </svg>
                                            </span>
                                        </a>
                                        </center>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default SnackSweets;
