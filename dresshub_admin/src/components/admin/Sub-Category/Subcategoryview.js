import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Subcategoryview = () => {
  const { subcategoryid } = useParams();
  const [subcategory, setSubcategory] = useState(null);

  const fetchSubcategoryById = async subcategoryid => {
    try {
      const url =
        process.env.REACT_APP_API_URL +
        'subCategory/subCategoryById/' +
        subcategoryid;
      const response = await axios.get(url);

      if (response.data.length > 0) {
        setSubcategory(response.data[0]);
      } else {
        console.log('Subcategory not found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubcategoryById(subcategoryid);
  }, [subcategoryid]);

  return (
    <div>
      <h2>Subcategory View</h2>
      <br />
      <br />
      {subcategory ? (
        <div>
          <div>Subcategory Name: {subcategory.subcategoryname}</div>
          <div>Sequence: {subcategory.sequence}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div className='row'>
        <div className='text-center my-4'>
          <Link to='/subcategorylist' className='btn btn-primary'>
            Back to Subcategory List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Subcategoryview;
