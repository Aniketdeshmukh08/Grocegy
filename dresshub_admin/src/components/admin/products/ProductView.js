import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductView = () => {
  const temp = useParams();
  console.log(temp.productid);
  const [product, setProduct] = useState({});

  const fetchProductById = async id => {
    try {
      const url = process.env.REACT_APP_API_URL + 'products/productById/' + id;
      const response = await axios.get(url);
      console.log(response.data);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProductById(temp.productid);
  }, []);
  return (
    <div className='container responsive my-4'>
      <h2 className='text-center'>Products View</h2>
      <div className='card shadow-sm p-4 bg-light'>
        <div className='mb-3'>
          <b>Product Name -</b> {product.prod_name}
        </div>
        <div className='mb-3'>
          <b>Category -</b> {product.categoryname}
        </div>
        <div className='mb-3'>
          <b>Subcategory -</b> {product.subcategoryname}
        </div>
        <div className='mb-3'>
          <b>Price -</b> {product.price}
        </div>
        <div className='mb-3'>
          <b>Brand -</b> {product.brand_name}
        </div>
        <div className='mb-3'>
          <b>Stock Quantity -</b> {product.stock_quantity}
        </div>
        <div className='mb-3'>
          <b>Discount -</b> {product.discount}
        </div>
        <div className='mb-3'>
          <b>Description -</b>{' '}
          <div dangerouslySetInnerHTML={{ __html: product.prod_desc }} />
        </div>
        <div className='mb-3'>
          <b>Image -</b>{' '}
          <img
            src={`${process.env.REACT_APP_API_URL}${product.image}`}
            alt='Product'
            className='product-view'
          />
        </div>
      </div>

      <div className='row'>
        <div className='text-center my-4'>
          <Link to='/productslist' className='btn btn-primary'>
            Back to Product List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
