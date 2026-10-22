import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes'; // Assuming you have this component
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
//Do not use hashedbitqr
import hashedbitqr from '../assets/images/hashedbitqr.jpg';
import grocjiqr from '../assets/images/grocjiqr.jpeg';
import iconImg from '../assets/images/logo.png'
import '../App.css'
//C:\Users\ASUS\OneDrive\Desktop\hashedBit\grocerz\assets\icon-foreground.png
const OrderDetailsPrint = () => {
  const { orderid, usertype, invoice } = useParams();
  const [order, setOrder] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [totalOriginalPrice, settotalOriginalPrice] = useState(0);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  // const [totalOriginalPrice, settotalOriginalPrice] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [totalquantity, settotalquantity] = useState(0);
  const [netpricefinal, setnetpricefinal] = useState(0);

  // Function to format date properly
  const formatOrderDate = (dateStr) => {
    if (!dateStr) return 'N/A';

    // If it's already in dd/mm/yyyy format, check if year is valid
    const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const year = parseInt(ddmmyyyyMatch[3]);
      // If year is reasonable (between 2020 and 2030), return as is
      if (year >= 2020 && year <= 2030) {
        return dateStr;
      }
    }

    // If it's an ISO string or other format, try to parse and format
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // Return original if can't parse
      }

      const year = date.getFullYear();

      // If year is unreasonable (like 1899), use current date
      if (year < 2020 || year > 2030) {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        return `${day}/${month}/${currentYear}`;
      }

      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateStr; // Return original on error
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orderdetails/${orderid}`
      );
      setOrderDetails(response.data.orderDetails);
      setOrder(response.data.orderDetails[0]);
      //console.log(response.data)

      // let total = 0;
      // response.data.orderDetails.map(item => {
      //   total = total + (item.price * item.quantity);
      // })
      setTotalPrice(response.data.total_original_mrp);

      const { orderDetails } = response.data;
      const totalOriginalMrp = orderDetails.reduce((total, item) => total + item.original_mrp, 0);

      settotalOriginalPrice(totalOriginalMrp)
      const totalQuantity = orderDetails.reduce((total, item) => total + item.quantity, 0);
      const totalPriceFinal = orderDetails.reduce((total, item) => total + item.price_final, 0);
      settotalquantity(totalQuantity)
      setnetpricefinal(totalPriceFinal)
      // Optionally use these values if you need to display them
      // console.log('Total Quantity:', totalQuantity);
      // console.log('Total Price Final:', totalPriceFinal);

      // console.log('orderdeatilspage');
    } catch (error) {
      console.error("Error!! can't fetch orders", error);
    }
  };

  useEffect(() => {
    if (orderDetails.length > 0) {
      downloadInvoice();
    }
  }, [orderDetails]);

  useEffect(() => {
    fetchOrderDetails();
    //downloadInvoice();
    //console.log(orderid, usertype);
  }, [orderid]);

  const handleProductClick = productid => {
    navigate(`/product/${productid}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   let temp = orderDetails.length > 0 ? orderDetails[0] : null;
  //   setOrder([...temp]);
  // }, [orderDetails])


  const downloadInvoice = () => {
    try {
      if (invoice === "invoice") {
        const capture = document.querySelector(".order-print");
        setTimeout(() => {
          html2canvas(capture, { scale: 4 })
            .then((canvas) => {
              const imgData = canvas.toDataURL("image/jpeg", 1.0);
              const pdf = new jsPDF("p", "mm", "a4");

              const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
              const pdfHeight = pdf.internal.pageSize.getHeight() - 20;
              const canvasAspectRatio = canvas.width / canvas.height;
              const pdfAspectRatio = pdfWidth / pdfHeight;

              let imgWidth, imgHeight;
              if (canvasAspectRatio > pdfAspectRatio) {
                imgWidth = pdfWidth;
                imgHeight = pdfWidth / canvasAspectRatio;
              } else {
                imgHeight = pdfHeight;
                imgWidth = pdfHeight * canvasAspectRatio;
              }

              pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);

              pdf.save(`Grocji_${order.srno}.pdf`);
              navigate(`/orderhistory/orderdetail/${orderid}`);
            });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          {/* <div className="blog-bradcrum">
            <span><a href="/">Home</a></span>
            <span className="devider">/</span>
            <span><a href="OrderHistory">Orders</a></span>
            <span className="devider">/</span>
            <span><a href="OrderDetail">OrderDetails</a></span>
          </div> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Grocji - Order Details</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <div className='container mt-5 order-print'>
                <div className='d-flex flex-row justify-content-between'>
                  <img className='imageicon rounded' src={iconImg} />
                  <h2 className='mb-4 pt-4 main-heading-custom-font-1'>
                    Grocji Order Summary - {order && order.srno}
                  </h2>
                  <h4 className='mb-4 pt-4 main-heading-custom-font-1 justify-content-center'>GST - 10NVNPK6103B1ZX</h4>
                </div>

                <div className='card'>
                  {order ? (
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-md-8'>
                          <p>
                            <strong>Order Date & Time :</strong>{' '}
                            <span className='text-success'>
                              {' '}
                              {formatOrderDate(order.order_date)}{' '}
                              {order.order_time && order.order_time.substring(0, 4) +
                                ' ' +
                                order.order_time && order.order_time.substring(8, 12).toUpperCase()}
                            </span>{' '}
                            |{' '}
                            <strong>Order ID :</strong>{' '}
                            <span className='text-success'>{order.order_id}</span>{' '}|{' '}
                            <strong>Order Number :</strong>{' '}
                            <span className='text-success'>{order.srno}</span>
                          </p>
                          {usertype !== 'vendor' && (
                            <div className='row my-5'>
                              <div className='col-sm-12 text-custom-font-1'>
                                <div className='heading-custom-font-1'>Shipping Address</div>
                                <strong>Name :</strong> {order.name}
                                <p>
                                  <strong>Address :</strong> {order.line1}, {order.city}
                                </p>
                                <p>
                                  <strong>Landmark :</strong> {order.landmark}
                                </p>
                                <span>
                                  <strong>Contact:</strong> {order.contact}, {order.alternatecontact}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className='col-md-4 text-end'>
                          <img
                            src={grocjiqr}
                            alt='Shipping Preview'
                            className='img-fluid rounded qr-image'
                          />
                        </div>
                      </div>
                      {usertype !== 'vendor' && (
                        <div className='row my-5'>
                          <div className='col-sm-12'>
                            <div className='heading-custom-font-1'>Bill Details</div>
                            <ul className='list-group text-custom-font-1'>
                              <li className='list-group-item text-success'>
                                <strong>Original Price - &#8377; {totalPrice}</strong>
                              </li>
                              <li className='list-group-item text-success'>
                                <strong>Coupon Discount - &#8377; {order.coupondiscount}</strong>
                              </li>
                              <li className='list-group-item text-success'>
                                <strong>
                                  Product Discount - &#8377;{' '}
                                  {order.totaldiscount}
                                </strong>
                              </li>
                              <li className='list-group-item text-success'>
                                <strong>Additional Discount - &#8377; {order.additionaldiscount}</strong>
                              </li>
                              <li className='list-group-item text-success'>
                                <strong>Total Discount - &#8377; {order.coupondiscount + order.additionaldiscount + order.totaldiscount}</strong>
                              </li>
                              <li className='list-group-item text-success'>
                                <strong>Final Payment Amount - &#8377; {order.paymentamount}</strong>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      <div className='my-5'>
                        <h4 className='heading-custom-font-1'>Items List</h4>
                        <div className='table-responsive text-custom-font-1'>
                          <table className='table table-striped table-bordered'>
                            <thead className='bg-light'>
                              <tr>
                                <th>S.no</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Original MRP</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails.map((item, index) => (
                                <tr
                                  key={index}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleProductClick(item.productid)}
                                >
                                  <td>
                                    <strong>{index + 1}</strong>
                                  </td>
                                  <td>
                                    <strong>{item.prod_name}</strong>
                                  </td>
                                  <td>
                                    <strong>{item.quantity}</strong>
                                  </td>
                                  <td>
                                    <strong>&#8377;&nbsp;{item.original_mrp}</strong>
                                  </td>
                                  <td>
                                    <strong>&#8377;&nbsp;{item.original_mrp - item.price_final}</strong>
                                  </td>
                                  <td>
                                    <strong>&#8377;&nbsp;{item.price_final}</strong>
                                  </td>
                                </tr>
                              ))}
                              <tr className="fs-5 fw-bold bg-light">
                                <td colSpan="2" className="text-center">
                                  Total:
                                </td>
                                <td> </td>
                                <td>
                                  &#8377;&nbsp;{totalOriginalPrice}
                                </td>
                                <td>
                                  &#8377;&nbsp;{totalOriginalPrice - netpricefinal}
                                </td>
                                {usertype !== "vendor" && (
                                  <td>
                                    &#8377;&nbsp;{netpricefinal}
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No order found.</p>
                  )}
                </div>
              </div>


            </div>
            <div className='d-flex justify-content-center'>
              <Link
                to={`/orderhistory/orderdetail/${orderid}`}
                className='shop-btn'
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetailsPrint;