import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductView = () => {
  const temp = useParams();
  console.log(temp.productid);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProductById = async id => {
    try {
      setLoading(true);
      const url = process.env.REACT_APP_API_URL + 'products/productById/' + id;
      const response = await axios.get(url);

      if (response.data && Object.keys(response.data).length > 0) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductById(temp.productid);
  }, [temp.productid]);

  if (loading) {
    return (
      <div className='container my-4'>
        <div className='text-center py-5'>
          <div className='spinner-border text-success' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-3 text-muted'>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!product || Object.keys(product).length === 0)) {
    return (
      <div className='container my-4'>
        <div className='alert alert-warning text-center'>
          <h5>Product not found</h5>
          <Link to='/productslist' className='btn btn-primary mt-3'>
            ← Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container my-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2 className='text-success fw-bold mb-0'>👁 Product Details</h2>
        <Link to='/productslist' className='btn btn-outline-secondary'>
          ← Back to List
        </Link>
      </div>

      <div className='card shadow-sm border-0'>
        <div className='card-body p-4'>
          <div className='row g-4'>
            {/* Product Image */}
            <div className='col-md-4'>
              <div className='card bg-light border-0'>
                <div className='card-body text-center p-3'>
                  <img
                    src={`${process.env.REACT_APP_API_URL}${product.image}`}
                    alt={product.prod_name}
                    className='img-fluid rounded'
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className='col-md-8'>
              <div className='row g-3'>
                <div className='col-12'>
                  <h4 className='text-success mb-0'>{product.prod_name}</h4>
                  <hr className='mt-2' />
                </div>

                <div className='col-md-6'>
                  <label className='text-muted small mb-1'>Category</label>
                  <div className='fw-semibold'>{product.categoryname || 'N/A'}</div>
                </div>

                <div className='col-md-6'>
                  <label className='text-muted small mb-1'>Subcategory</label>
                  <div className='fw-semibold'>{product.subcategoryname || 'N/A'}</div>
                </div>

                <div className='col-md-6'>
                  <label className='text-muted small mb-1'>Brand</label>
                  <div className='fw-semibold'>{product.brand_name || 'N/A'}</div>
                </div>

                <div className='col-md-6'>
                  <label className='text-muted small mb-1'>Stock Quantity</label>
                  <div className='fw-semibold'>
                    <span className={`badge ${product.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className='col-md-6'>
                  <label className='text-muted small mb-1'>Price</label>
                  <div className='fw-semibold fs-5 text-success'>₹{product.price}</div>
                </div>

                <div className='col-md-6'>
                  <label className='text-muted small mb-1'>Discount</label>
                  <div className='fw-semibold'>
                    {product.discount > 0 ? (
                      <>
                        <span className='text-danger'>₹{product.discount}</span>
                        <span className='text-muted small ms-2'>
                          (Final: ₹{(product.price - product.discount).toFixed(2)})
                        </span>
                      </>
                    ) : (
                      'No discount'
                    )}
                  </div>
                </div>

                <div className='col-12'>
                  <label className='text-muted small mb-1'>Description</label>
                  <div
                    className='border rounded p-3 bg-light'
                    dangerouslySetInnerHTML={{ __html: product.prod_desc || 'No description available' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='card-footer bg-white border-top'>
          <div className='d-flex justify-content-center gap-3 py-2'>
            <Link
              to={`/productedit/${product.productid}`}
              className='btn btn-warning px-4'
            >
              ✏ Edit Product
            </Link>
            <Link
              to='/productslist'
              className='btn btn-outline-secondary px-4'
            >
              ← Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
