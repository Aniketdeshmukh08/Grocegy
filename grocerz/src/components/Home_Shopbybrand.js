import React from 'react';
import { Link } from 'react-router-dom';

const Home_Shopbybrand = () => {
    return (
        <>
            <section class="flash-sale">
                {/* <div class="container"> */}
                    <Link to="/category/shopbybrand">
                        <div class="modern-grocery-section">
                            <div class="product-wrapper">
                                <div class="product-info" id="info-left-1">
                                    <h2 class="wrapper-heading">Shop By Brand </h2>
                                    <a class="shop-btn">Shop Now
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

                                </div>
                            </div>
                        </div>
                    </Link>

                {/* </div> */}
            </section>
        </>
    );
};

export default Home_Shopbybrand;
