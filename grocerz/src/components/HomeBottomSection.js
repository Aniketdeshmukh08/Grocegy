import React from 'react';
import { Link } from 'react-router-dom';

const HomeBottomSection = () => {
  return (
    <>
      <div class='healthy-section'>
        <div class='row gy-4 gx-5 gy-lg-0'>
          <div class='col-lg-6 col-md-6'>
            <Link to='/category/fruit20420'>
              <div class='product-wrapper wrapper-one' data-aos='fade-up'>
                <div class='wrapper-info'>
                  <h2 class='wrapper-details'>Healthy & Fresh Fruits</h2>
                  <a class='shop-btn' href='category/fruit20420'>
                    Shop Now
                    <span>
                      <svg
                        width='8'
                        height='14'
                        viewBox='0 0 8 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <rect
                          x='1.45312'
                          y='0.914062'
                          width='9.25346'
                          height='2.05632'
                          transform='rotate(45 1.45312 0.914062)'
                        />
                        <rect
                          x='8'
                          y='7.45703'
                          width='9.25346'
                          height='2.05632'
                          transform='rotate(135 8 7.45703)'
                        />
                      </svg>
                    </span>
                  </a>
                </div>
                <div class='wrapper-img'>
                  <img
                    src='assets/images/homepage-one/category-img/c-shop-img-1.webp'
                    alt='img'
                  />
                </div>
              </div>
            </Link>
          </div>
          <div class='col-lg-6 col-md-6'>
            <Link to='/category/fruit20420'>
              <div class='product-wrapper wrapper-two' data-aos='fade-up'>
                <div class='wrapper-img'>
                  <img
                    src='assets/images/homepage-one/category-img/c-shop-img-2.webp'
                    alt='img'
                  />
                </div>
                <div class='wrapper-info'>
                  <h2 class='wrapper-details'>Fresh Vegetables</h2>
                  <a class='shop-btn' href='/category/fruit20420'>
                    Shop Now
                    <span>
                      <svg
                        width='8'
                        height='14'
                        viewBox='0 0 8 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <rect
                          x='1.45312'
                          y='0.914062'
                          width='9.25346'
                          height='2.05632'
                          transform='rotate(45 1.45312 0.914062)'
                        />
                        <rect
                          x='8'
                          y='7.45703'
                          width='9.25346'
                          height='2.05632'
                          transform='rotate(135 8 7.45703)'
                        />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </Link>
          </div>
          {/* <div class="col-lg-4 col-md-6">
                                <div class="product-wrapper wrapper-three" data-aos="fade-up">
                                    <div class="wrapper-info">
                                        <h4 class="wrapper-details">
                                            Groomimg
                                            <br></br> Cleaning
                                        </h4>
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
                                    <div class="wrapper-img">
                                        <img src="assets/images/homepage-one/category-img/c-shop-img-3.webp" alt="img" />
                                    </div>
                                </div>
                            </div> */}
        </div>
      </div>
    </>
  );
};

export default HomeBottomSection;
