import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Category = () => {
  const [categoryName, setCategoryName] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const { categoryid } = useParams();

   const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getHeaders = () => {
    const token = getToken();
    return token ? {
      'x-access-token': token,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  const formatSubcategoryName = name => {
    return name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}category/allcategory}`
        );
        setCategoryName();

        const subcategoryResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}subCategory/categoryid/${categoryid}`
        );
        setSubcategories(subcategoryResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategoryData();
  }, [categoryid]);

  useEffect(() => {
    //console.log('subcategories - ', subcategories)
  });

  const addCategory = async (categoryname) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}category/addCategory`,
        { categoryname },
        { headers: getHeaders() }
      );
      console.log('Category added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      if (error.response?.data?.err?.includes('Token')) {
        alert('Please login again - Token expired');
      }
      throw error;
    }
  };

  const updateCategory = async (id, categoryname) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}category/updateCategory/${id}`,
        { categoryname },
        { headers: getHeaders() }
      );
      // console.log('Category updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response?.data?.err?.includes('Token')) {
        alert('Please login again - Token expired');
      }
      throw error;
    }
  };

  const removeCategory = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}category/removeCategory/${id}`,
        {},
        { headers: getHeaders() }
      );
      // console.log('Category removed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing category:', error);
      if (error.response?.data?.err?.includes('Token')) {
        alert('Please login again - Token expired');
      }
      throw error;
    }
  };

  const updateStatus = async (id, stat) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}category/updatestatus/${id}`,
        { stat },
        { headers: getHeaders() }
      );
      // console.log('Status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response?.data?.err?.includes('Token')) {
        alert('Please login again - Token expired');
      }
      throw error;
    }
  };

  return (
    <div>
      {/* <div>
        <img
          draggable="false"
          className="image-image  image-hand"
          src="https://assets.myntassets.com/w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/5/3/b54399f0-6ed5-44b3-84b0-e9d5c1657aaa1651599573991-CR7_Desk_Baner.jpg"
          srcset=""
          alt=""
        />
      </div> */}
      <div>
        <h4 className='text-banner-title'>Category - {categoryName}</h4>
      </div>
      <div className='image-container'>
        <div className='row'>
          {subcategories.map(item => (
            <>
              <div className='col-3'>
                <Link
                  to={`/category/${categoryid}/${formatSubcategoryName(item.subcategoryname)}/${item.subcategory_id}`}
                >
                  <img
                    draggable='false'
                    className='image-image undefined image-hand img-responsive'
                    src='https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/1dce9c3e-77fa-48f1-85a3-d3c136c1d73e1598892377652-USPA.jpg'
                    srcset=''
                    alt=''
                  />
                  <p className='text-center'>{item.subcategoryname}</p>
                </Link>
              </div>
            </>
          ))}
        </div>

        {/* {subcategories.length === 0 ? (
          <p>No subcategories found</p>
        ) : (
          <>

            <div className="text-banner-title">
              {subcategories.map((subcategory) => (
                <div key={subcategory.subcategory_id}>
                  <div>
                    <Link to={`/category/${categoryid}/${formatSubcategoryName(subcategory.subcategoryname)}/${subcategory.subcategory_id}`}>
                      <img
                        draggable="false"
                        className="image-image undefined image-hand"
                        src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/1dce9c3e-77fa-48f1-85a3-d3c136c1d73e1598892377652-USPA.jpg"
                        srcset=""
                        alt=""
                      />
                      <h5>
                        {subcategory.subcategoryname}
                      </h5>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )} */}
        {/* <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/3fa337a0-c792-4038-8d12-50d463c189a11598892377363-Levis.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/af31285e-f6a3-426e-bbea-0aedef9da17c1598892377537-Tommy-Hilfiger.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          class="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/8d5afb84-a464-40af-9971-2e9f0827e9b71598892377591-UCB.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/a7d3676a-9694-4a84-835e-0408fdad884b1598892377407-Nike.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/cec595c6-c7ec-4259-af8b-997a33a09ce71598892377444-Puma.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/0206da63-a7cc-4f83-8527-90d7dc74706b1598892377489-Skechers.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/d977e7ac-67dd-4fa6-b922-fe0057385dfa1598892377205-Crocs.jpg"
          srcset=""
          alt=""
        /> */}
      </div>
      <div>
        <h4 className='text-banner-title'>Categories To Bag</h4>
      </div>
      <div className='images-category'>
        <img
          draggable='false'
          className='image-image undefined image-hand'
          src='https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/8/89f1bd9d-3a28-456d-888a-beff717a06f81594222908155-Shirts.jpg'
          srcset=''
          alt=''
        />
        <img
          draggable='false'
          className='image-image undefined image-hand'
          src='https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/8/9ff1f34e-9242-47fd-9566-e7d7a5c240511594222908483-T-shirt.jpg'
          srcset=''
          alt=''
        />
        <img
          draggable='false'
          className='image-image undefined image-hand'
          src='https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/8/720cf6ef-3be4-4825-8211-0125c942e3821594222907960-Jeans.jpg'
          srcset=''
          alt=''
        />
        <img
          draggable='false'
          className='image-image undefined image-hand'
          src='https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/8/2bac5e2d-337b-42c0-88c7-3d4e2dc464141594222908262-Shorts-_-Trousers.jpg'
          srcset=''
          alt=''
        />
        <img
          draggable='false'
          className='image-image undefined image-hand'
          src='https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/8/ae14f627-9fd9-41ce-80a4-f107c316c7eb1594222907625-Casual-shoes.jpg'
          srcset=''
          alt=''
        />
        <img
          draggable='false'
          className='image-image undefined image-hand'
          src='https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/8/f0f9b81a-b9d5-4b8b-94d5-ea878fa9b18e1594222834121-Infant-Essential.jpg'
          srcset=''
          alt=''
        />
      </div>
      {/* <div>
        <h4 className="text-banner-title">Explore Top Brands</h4>
      </div>
      <div className="images-Brands">
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/25/a88b9390-5adb-493b-a1b3-702c59ccf53a1598348260502-Nike.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/25/c9f66558-feab-4d76-aa3c-adc68d81dce21598348260415-Levis.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/5/178c1e5d-69f2-402f-a2a5-ef44700a0f691596640983793-Roadster---.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          class="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/25/085719b1-c71e-4f47-950c-9a6b7f291fac1598348260370-Jack-_-Jones.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/5/774f42c4-f459-4514-9b90-cf8a60a5f68c1596644478087-hrx30.jpg"
          srcset=""
          alt=""
        />
      </div>
      <div>
        <h4 className="text-banner-title">Myntra Luxe</h4>
      </div>
      <div className="images-myntra">
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2021/11/17/85fa3b9b-9e7c-43a5-9de0-1cb32f3180151637149111314-MP-Farah.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2021/11/17/480f4bde-1d72-4517-be6d-af2dfef7528e1637149111337-MP-Collective.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2021/11/17/cadd8457-b8ec-464c-9bc6-6082a24075591637149111331-MP-OriginalPenguin.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2021/11/17/e185b9a2-0c12-4379-a85c-a4ceed2fe9931637149111326-MP-D1Milano.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2021/11/17/ab5c5029-d24f-4789-979c-d4910801ea191637149111321-MP-HUGOBoss.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2021/11/17/621ce33b-3383-4347-99bf-2038b95f27151637149369429-MP-Ducati.jpg"
          srcset=""
          alt=""
        />
      </div>
      <div>
        <h4 className="text-banner-title">Trending In Indian Wear</h4>
      </div>
      <div className="images-treanding">
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/19/a9f68785-e282-425a-b270-c978c387b0f31597840342635-Content-ethnicwear-color-whites.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/19/0d1e0a28-3088-4719-a692-4cdaa7a33cc71597840342726-Content-ethnicwear-occasion-casuallook.jpg"
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/28/9d248917-d1b0-4910-8de0-4ed7c2b4af8e1595935030939-Content-ethnicwear-trends-printedkurtaset.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/28/83d9ca97-4aa3-46ce-bd28-b135d3b94a021595935030673-Content-ethnicwear-essentials-everydaykurtas.jpg"
          srcset=""
          alt=""
        />
        <img
          draggable="false"
          className="image-image undefined image-hand"
          src="https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2020/7/28/9e4fb95e-6268-49c5-9ed1-e6b1bd4b5efd1595935030880-Content-ethnicwear-trend-fashionmeetcomfort.jpg"
          srcset=""
          alt=""
        />
      </div> */}
    </div>
  );
};

export default Category;
