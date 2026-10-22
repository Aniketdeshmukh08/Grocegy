import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardRoutes from './DashboardRoutes';
import useAutoLogout from '../hooks/useAutoLogout';

const Dashboard = () => { 
  const initialState = {
    name: '-',
    email: '-',
    mobile: '-',
  };

  const [userDetails, setUserDetails] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  const [userOrders, setUserOrders] = useState(0);
  const [totalSpendings, setTotalSpendings] = useState(0);
  const [currentMonthSpendings, setCurrentMonthSpendings] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  // ✅ NEW STATES
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  const userid = localStorage.getItem('userid');
  useAutoLogout();

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}users/searchuser/${userid}`
      );

      setUserDetails({
        name: response.data[0].name,
        email: response.data[0].email,
        mobile: response.data[0].mobile
      });

      const userOrdersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getOrderCountByUserId/${userid}`
      );
      setUserOrders(userOrdersResponse.data.totalOrders);

      const TotalSpendingResp = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getTotalExpenseByUserId/${userid}`
      );
      setTotalSpendings(TotalSpendingResp.data.totalExpense);

      const currentMonthSpendingResp = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getCurrentMonthExpenseByUserId/${userid}`
      );
      setCurrentMonthSpendings(currentMonthSpendingResp.data.currentMonthSpendings);

      // ✅ NEW API (ORDER STATUS)
      const statusResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getOrderStatusCountByUserId/${userid}`
      );

      setDeliveredOrders(statusResponse.data.delivered || 0);
setPendingOrders(statusResponse.data.pending || 0);
setCancelledOrders(statusResponse.data.cancelled || 0);

// ✅ ADD HERE FOR TESTING
setDeliveredOrders(10);
setPendingOrders(5);
setCancelledOrders(2);

      

    } catch (error) {
      console.error(error);
    }
  };

  const updateUserDetails = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}users/updateusersdashboard/${userid}`, {
        name: userDetails.name,
        email: userDetails.email,
        mobile: userDetails.mobile
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetails();
  }, []);

  const fetchTotalDiscount = async (userid) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getTotalDiscountByUserId/${userid}`
      );
      setTotalDiscount(response.data.totalDiscount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userid) {
      fetchTotalDiscount(userid);
    }
  }, [userid]);

  const chartData = [
    { name: "Orders", value: userOrders },
    { name: "Spendings", value: totalSpendings },
    { name: "This Month", value: currentMonthSpendings },
    { name: "Saving", value: totalDiscount }
  ];

  return (
    <>
      <section className="blog about-blog">
        <div className="container">
          <div className="blog-heading about-heading">
            <h1 className="heading">User Dashboard</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />

              <div className='tab-content nav-content' style={{ flex: '1 0%' }}>
                <div className='tab-pane fade show active'>

                  <h5 className='heading'>Welcome {userDetails.name}</h5>

                  <div className='row g-5'>

                    {/* YOUR ORDERS */}
                    <div className='col-lg-3 col-sm-6'>
                      <div className='product-wrapper'>
                        <div className='wrapper-content'>
                          <p className='paragraph'>Your Orders</p>
                          <h3 className='heading'>{userOrders}</h3>
                        </div>
                      </div>
                    </div>

                    {/* TOTAL SPENDINGS → NOW DELIVERED */}
                    <div className='col-lg-3 col-sm-6'>
                      <div className='product-wrapper'>
                        <div className='wrapper-content'>
                          <p className='paragraph'>Total Spendings</p>
                          <h3 className='heading'>{deliveredOrders}</h3>
                        </div>
                      </div>
                    </div>

                    {/* THIS MONTH → NOW PENDING */}
                    <div className='col-lg-3 col-sm-6'>
                      <div className='product-wrapper'>
                        <div className='wrapper-content'>
                          <p className='paragraph'>This Month</p>
                          <h3 className='heading'>{pendingOrders}</h3>
                        </div>
                      </div>
                    </div>

                    {/* TOTAL SAVING → NOW CANCELLED */}
                    <div className='col-lg-3 col-sm-6'>
                      <div className='product-wrapper'>
                        <div className='wrapper-content'>
                          <p className='paragraph'>Total Saving</p>
                          <h3 className='heading'>{cancelledOrders}</h3>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* GRAPH SAME */}
                  <div className="row mt-5">
                    <div className="col-lg-12">
                      <div className="box-shadows p-4">
                        <h4>Order Summary Graph</h4>

                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" />
                          </BarChart>
                        </ResponsiveContainer>

                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;