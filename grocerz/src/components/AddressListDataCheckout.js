import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddressListDataCheckout = () => {
  const userid = localStorage.getItem('userid');
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}address/getByuserId/${userid}`
      );
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <>
      <div className='row'>
        {/* <div className="col-lg-12">

                    <Link to="/address" class="site-btn" >Add a new address</Link>

                </div> */}

        <div className='col-lg-12'>
          {addresses.map(item => (
            <>
              <div class='services__item bg-secondary bg-opacity-10 mb-3'>
                <i class='fa fa-car'></i>
                <h5>Name - {item.name}</h5>
                <p>
                  {item.line1}&nbsp;{item.line2}&nbsp;{item.line3}
                </p>
                <p>
                  {item.city}&nbsp;{item.state}&nbsp;{item.country}
                </p>
                <p>{item.pin}</p>
                <p>
                  Mobile - {item.contact}&nbsp;{item.alternatecontact}
                </p>
                <p>Landmark - {item.landmark}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddressListDataCheckout;
