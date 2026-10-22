import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';
import { marketCategory } from '../utils/category';
import Modal from 'react-modal';
import {  toast } from 'react-toastify';
//Do not use hashedbitqr
import hashedbitqr from '../assets/images/hashedbitqr.jpg';
import grocjiqr from '../assets/images/grocjiqr.jpeg';
const OrderDetail = () => {
   const initialState = {
     name: '-',
     email: '-',
     mobile: '-',
   };

   const [userDetails, setUserDetails] = useState(initialState);
   const userId = localStorage.getItem('userid');

  const [showPopup, setShowPopup] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [Added_quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState(marketCategory);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [oldOrders, setOldOrders] = useState([]);
  const { orderid } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [oldOrdersloading, setOldOrdersLoading] = useState(false);
  const [err, setError] = useState(false);
  const usertype = window.localStorage.getItem('usertype');

  const [costPrice, setCostprice] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [modal, setModal] = useState(false);
  const [userid, setUserid] = useState('');

  const [productid, setproductid] = useState([]);
  const [quantity, setquantity] = useState(' ');
  const [costPriceModal, setCostPriceModal] = useState(false);
  const [alertmodal, setAlertModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashPayment, setCashPayment] = useState(null);
  const [onlinePayment, setOnlinePayment] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOriginalPrice, settotalOriginalPrice] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [totalquantity, settotalquantity] = useState(0);
  const [totalpricefinal, settotalpricefinal] = useState(0);
  const [costAmount, setCostAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [billStatusModal, setBillStatusModal] = useState(false);
  const [billStatus, setBillStatus] = useState('');
  //  const [netpricefinal ,setnetpricefinal] = useState(0)
  const [isInstructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [deliveryPartnerNote, setDeliveryPartnerNote] = useState('');
  const handleOrderClick = order_id => {
    navigate(`/orderhistory/orderdetail/${order_id}`);
  };

  const connectwhatsapp_update = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi. I want to update an order. My Order ID is: ${orderid || 'N/A'}`;

    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    const newTab = window.open(whatsappLink, '_blank');

    if (newTab) {
      newTab.focus();
    } else {
      alert('Popup blocked! Please allow popups for this site.');
    }
  };
  const sendOrderDetailViaWhatsApp = () => {
        
        const order = orderDetails.length > 0 ? orderDetails[0] : {};
        const senderName = "Grocji";
        const phoneNumber =  order.contact;
        
        let itemList = "";
        orderDetails.forEach((item, idx) => {
        itemList += `${idx + 1}. ${item.prod_name} x ${item.quantity}\n`;
        });

        const msg = `
Order Details
            Order ID: ${order.order_id}
            Order Number: ${order.srno}
            Date/Time: ${order.order_date} ${order.order_time}
            Customer: ${order.name}
            Contact: ${order.contact}
            Shipping Address: ${order.line1},${order.city}
            Final Payment Amount: ₹${totalpricefinal}
            Payment Status: ${order.paymentstatus || ""}
            Paid Amount (Cash/Online): ${order.payment_cash} / ${order.payment_online } 
            Bill Status: ${order.billstatus === 1 ? 'Approved' : 'Not Approved'}
Items List:
${itemList}

            Sent by: ${senderName}
            Thank you for shopping with us!
`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const fetchUseridFromOrderHistory = async () => {
    try {
      setOldOrdersLoading(true);
      const allOrdersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/allOrders`
      );
      const currentOrder = allOrdersResponse.data.find(
        order => order.order_id === orderid
      );

      if (currentOrder) {
        if (usertype === 'admin') {
          const oldOrdersResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}orders/getByuserId/${currentOrder.userid}`
          );
          const filteredOrders = oldOrdersResponse.data.filter(
            order => order.order_id !== orderid
          );
          setOldOrders(filteredOrders);
        }
      }
    } catch (err) {
      console.error('Error fetching userid', err);
    } finally {
      setOldOrdersLoading(false);
    }
  };

  const findClassNames = (order_status, delivery_status) => {
    if (order_status === 'COMPLETED' && delivery_status === 'DELIVERED') {
      return 'card-body bg-opacity-25 bg-success';
    }
    if (delivery_status === 'DELIVERED') {
      return 'card-body bg-info bg-opacity-25';
    }
    if (order_status === 'Placed') {
      return 'card-body bg-warning bg-opacity-25';
    }
    if (order_status === 'CANCELLED') {
      return 'card-body bg-danger bg-opacity-25';
    }
    if (order_status === 'COMPLETED') {
      return 'card-body bg-success bg-opacity-25';
    }
    return 'card-body bg-warning bg-opacity-25';
  };

  // Fetch all categories
  const fetchCategoryData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}category/allcategory}`;
      const response = await axios.get(url);
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories !');
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubCategoryData = async Categoryid => {
    try {
      if (Categoryid) {
        const url = `${process.env.REACT_APP_API_URL}subCategory/categoryid/${Categoryid}`;
        const response = await axios.get(url);
        setSubcategories(response.data);
      }
    } catch (error) {
      setError('Error fetching subcategories !');
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fetch products based on selected subcategory
  const fetchProductsData = async subCategoryid => {
    try {
      if (subCategoryid) {
        const url = `${process.env.REACT_APP_API_URL}products/bySubCategory`;
        const response = await axios.post(url, { category, subcategory });
        // let tempObj = response.data.map(temp => ({
        //   ...temp,
        //   price: temp.price - temp.discount,
        // }));
        // setProducts([...tempObj]);
        setProducts(response.data);
      }
    } catch (error) {
      setError('Error fetching products !');
      console.error('Error fetching products:', error);
    }
  };

  // update quantity in orderDetails list
  const updateQuantity = (productId, newQuantity) => {
    const updatedOrderDetails = orderDetails.map(item => {
      if (item.productid === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setOrderDetails(updatedOrderDetails);
  };

  // For Admin and Deliverypartner to Save Note
  const handleSaveNotes = async () => {
    setLoading(true);
    try {
      const payload = {
        usertype: usertype
      };
      if (usertype === 'admin') {
        payload.admin_note = adminNote;
      } else if (usertype === 'deliverypartner') {
        payload.delivery_partner_note = deliveryPartnerNote;
      }

      await axios.put(`${process.env.REACT_APP_API_URL}orders/update-notes/${orderid}`, payload);
      toast.success('Your Note has been saved!');
      await fetchOrderDetails();
      setInstructionsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save Your Note.');
      console.error('Error saving Your Note:', error);
    } finally {
      setLoading(false);
    }
  };

  //For Customer to Save Instructions
  const handleUpdateCustomerNote = async () => {
    setLoading(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}orders/update-notes/${orderid}`, {
        customer_note: customerNote
      });
      toast.success('Your Instructions has been saved!');
      await fetchOrderDetails();
      setInstructionsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save your Instructions.');
      console.error('Error saving your Instructions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orderdetails/${orderid}`;
      const response = await axios.get(url);
      setOrderDetails(response.data.orderDetails);

      if (response.data.orderDetails && response.data.orderDetails.length > 0) {
        const details = response.data.orderDetails[0];
        setCustomerNote(details.customer_note || '');
        setAdminNote(details.admin_note || '');
        setDeliveryPartnerNote(details.delivery_partner_note || '');
      }

      // const orderDetails = response.data;
      // const updatedOrderDetails = orderDetails.map(item => {
      //   // console.log(item.original_mrp )
      //   const totalOriginalPrice_unit = Number(item.price || 0);
      //   const totalquantity = item.quantity;
      //   const totalpricefinal = Number(item.price_final || 0);
      //   const totalDiscount = (item.original_mrp - item.price_final) *item.quantity ;
      //   // const totalDiscount = totalOriginalPrice - totalpricefinal;
      //   // const totalDiscount = (totalOriginalPrice - item.price_final)*item.quantity;
      //   return { ...item, totalOriginalPrice_unit, totalquantity, totalDiscount, totalpricefinal };
      // });
      console.log(response)
      settotalOriginalPrice(response.data.total_original_mrp);
      settotalDiscount(response.data.sumoftotaldiscount);
      settotalquantity(response.data.total_quantity);
      settotalpricefinal(response.data.total_pricefinal);
      // setOrderDetails(updatedOrderDetails);
    } catch (error) {
      setError('Something went wrong please try again !');
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(totalOriginalPrice , totalpricefinal)
  const handleAddDiscount = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}orders/updateDiscount/${orderid}`,
        {
          additionaldiscount: discountAmount,
        }
      );

      if (response.status === 200) {
        toast.success('Discount applied successfully!');
        await fetchOrderDetails();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        toast.error('Order not found!');
      } else {
        toast.error('Failed to apply discount!');
      }
      console.error('Error applying discount:', error);
    } finally {
      setLoading(false);
      setShowDiscountPopup(false);
    }
  };

  const fetchCostAmount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getcostamount/${orderid}`
      );
      setCostAmount(response.data.costamount || 0);
    } catch (error) {
      console.error('Error fetching cost amount:', error);
    }
  };

  // const product_price = async () => {
  //   try {
  //     const prices = [];
  //     for (let index = 0; index < productid.length; index++) {
  //       const url = `${process.env.REACT_APP_API_URL}products/productByPId/${productid[index]}`;
  //       const response = await axios.get(url);
  //       const product_prices = response.data.price;
  //       const total_product_price = product_prices * quantity[index];
  //       prices.push(total_product_price);
  //     }
  //     setProductPrices(prices);
  //   } catch (error) {
  //     console.error('Error fetching product prices:', error);
  //   }
  // };
  // useEffect(() => {
  //   if (productid.length > 0 && quantity.length > 0) {
  //     product_price();
  //   }
  // }, [productid, quantity]);

  // Handle adding product to order
  const handleSavePayment = async () => {
    // Validation
    if (cashPayment === null || isNaN(cashPayment)) {
      toast.error("Cash amount is required and must be a number");
      return;
    }
    if (onlinePayment === null || isNaN(onlinePayment)) {
      toast.error("Online amount is required and must be a number");
      return;
    }

    const data = {
      cashPayment: cashPayment,
      onlinePayment: onlinePayment
    };

    setLoading(true);

    try {
      const url = `${process.env.REACT_APP_API_URL}orders/addreceivedamounttemp/${orderid}`;
      const response = await axios.put(url, data);
      toast.success('Payment Amount Added!');
      fetchOrderDetails();
    } catch (error) {
      console.error(error);
      setError('Something went wrong, please try again!');
      toast.error(error?.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
      setPaymentModal(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const productObj = products.find(
        product => product.productid === selectedProduct
      );
      if (!productObj) {
        throw new Error('Selected product not found');
      }
      //console.log(productObj);
      // Extract required product details
      const { productid, discount, price, original_mrp = price } = productObj;
      const quantity = Added_quantity;

      if (!original_mrp || !price) {
        console.error('Missing original_mrp or price for product:', productObj);
        throw new Error('Product pricing details are missing');
      }
      const totalOriginalMRP = original_mrp * quantity;
      const totalFinalPrice = (original_mrp - discount) * quantity;
      const totaldiscount = totalOriginalMRP - totalFinalPrice;
      const productWithQuantity = {
        productid,
        original_mrp: totalOriginalMRP,
        price_final: totalFinalPrice,
        quantity,
        discount: totaldiscount,
      };
      const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${orderid}`;
      await axios.post(url, productWithQuantity, {
        headers: { 'Content-Type': 'application/json' },
      });

      fetchOrderDetails();
      setShowPopup(false);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error(
        'Error adding product to order:',
        error.response?.data || error.message
      );
      setError('Something went wrong, please try again!');
      toast.error('Something went wrong, please try again!');
    } finally {
      setLoading(false);
    }
  };
  const removeItemFromOrder = async productid => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orderdetails/removeOrderProduct/${orderid}/${productid}`;
      await axios.put(url);
      fetchOrderDetails();
      setLoading(false);
    } catch (error) {
      console.error('Error removing product from order:', error);
      toast.error('Something Went wrong please try again !');
    }
  };

  const handleDeliveryStaff = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}users/deliverypartners`;
      const response = await axios.get(url);
      setDeliveryPartners(response.data[0]);
    } catch (error) {
      setError('Error fetching Delivery Partners !');
      console.error('Error fetching Delivery Partners:', error);
      toast.error('Something Went wrong please try again !');
    }
    setModal(!modal);
  };

  // Update delivery partner in orders table
  const fetchDeliveryPartner = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}orders/updatedeliverypartner/${orderid}/${userid}`;
      const response = await axios.put(url);
      if (response.status === 200) {
        //alert(response.data.message);

        setAlertModal(true);
      }
    } catch (error) {
      console.error('Error updating delivery partner from order:', error);
    }
    setModal(!modal);
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoryData();
    fetchOrderDetails();
     fetchUserDetails();
  }, [orderid]);

  // Fetch subcategories when category changes
  useEffect(() => {
    fetchSubCategoryData(category);
  }, [category]);

  // Fetch products when subcategory changes
  useEffect(() => {
    fetchProductsData(subcategory);
  }, [subcategory]);

  useEffect(() => {
    fetchOrderDetails();
    fetchCostAmount();

  }, [orderid]);

  const handleProductClick = productid => {
    navigate(`/product/${productid}`);
  };

  useEffect(() => {
    fetchUseridFromOrderHistory();
    window.scrollTo(0, 0);
    // fetchUserName()
  }, [orderid]);

  // const totalOriginalPrice = productPrices.reduce((acc, curr) => acc + curr, 0);
  let order = {
    srno: '',
    order_date: '',
    order_time: '',
    name: '',
  };
  order = orderDetails.length > 0 ? orderDetails[0] : order;
  // console.log("Order Data:", order);
  // console.log("Coupon Discount:", order.coupondiscount);
  // console.log("Additional Discount:", order.additionaldiscount);
  // console.log("Product Discount:", order.totaldiscount);
  // Handle add cost price
  const handleCostPriceAdd = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}orders/addcostamount/${orderid}`;
      const response = await axios.put(url, { costamount: costPrice });
      if (response.status == 200) {
        toast.success('Cost Price added!');
      }
    } catch (error) {
      console.error('Error fetching Delivery Partners:', error);
      toast.error('Something Went wrong please try again !');
    }
    setCostPriceModal(!costPriceModal);
  };

  const handleBillStatusChange = async (status) => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orders/updateBillStatus/${orderid}`;
      const response = await axios.put(url, { billStatus: status });

      if (response.status === 200) {
        toast.success(`Bill status updated to ${status}`);
        fetchOrderDetails();
      }
    } catch (error) {
      toast.error('Failed to update bill status');
      console.error('Error updating bill status:', error);
    } finally {
      setLoading(false);
      setBillStatusModal(false);
    }
  };

   const fetchUserDetails = async () => {
     try {
       const response = await axios.get(
         `${process.env.REACT_APP_API_URL}users/searchuser/${userId}`
       );
       setUserDetails({
         name: response.data[0].name,
         email: response.data[0].email,
         mobile: response.data[0].mobile
       });
     } catch (error) {
       console.error(error);
     }
   };

  return (
    <>
      
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Order Details</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container'>
                <h2 className='mb-4 main-heading-custom-font-1'>
                  Order Summary - {order && order.srno}
                </h2>
                {/* order summary card */}
                <div className='card'>
                  {loading && !orderDetails.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                      }}
                    >
                      <img
                        src={loaderGif}
                        alt='Loading...'
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                  ) : (
                    <div className='card-body'>
                      <p>
                        <strong>Order Date & Time :</strong>
                        <span className='text-success'>
                          {' '}
                          {order.order_date}{' '}
                          {order.order_time.substring(0, 4) +
                            ' ' +
                            order.order_time.substring(8, 12).toUpperCase()}
                        </span>{' '}
                        | <strong>Order ID :</strong>{' '}
                        <span className='text-success'>{order.order_id}</span> |{' '}
                        <strong>Order Number :</strong>{' '}
                        <span className='text-success'>{order.srno}</span>
                      </p>
                      {
                        order.delivery_partner_name ? (
                          <p>
                            <strong>Delivery Person :</strong>
                            <span className='text-success'>
                              {' '}
                              {order.delivery_partner_name}
                            </span>
                            | {' '}
                            <strong>Delivery Person number :</strong>{' '}
                            <span className='text-success'>
                              {' '} {order.delivery_partner_mobile}
                            </span>
                          </p>
                        ) : null
                      }
                      <div className='row my-2'>
                        <div className='col-lg-8 col-md-7 col-sm-12'>
                          <div className='heading-custom-font-1'>
                            Shipping Address
                          </div>
                          <p className='mb-2'>
                            <strong>Name :</strong> {order.name}
                          </p>
                          <p className='mb-2'>
                            <strong>Address :</strong> {order.line1},{' '}
                            {order.city}
                          </p>
                          <p className='mb-2'>
                            <strong>Landmark :</strong> {order.landmark}
                          </p>
                          <p className='mb-2'>
                            <span>
                              <strong>Contact: </strong>
                              {order.contact}, {order.alternatecontact}
                            </span>
                          </p>
                        </div>
                        <div className='col-lg-4 col-md-5 col-sm-12 d-flex justify-content-center justify-content-md-end align-items-center pt-3 pt-0 mt-0 '>
                          <div className='text-center'>
                            <img
                              src={grocjiqr}
                              alt='Shipping Preview'
                              className='img-fluid rounded'
                              style={{
                                width: '175px',
                                height: '175px',
                                maxWidth: '100%',
                                objectFit: 'contain'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='row '>
                        <div className='col-sm-12'>
                          <div className='heading-custom-font-1'>
                            Bill Details
                          </div>
                          <ul className='list-group text-custom-font-1'>
                             <li className='list-group-item text-success'>
                               <strong>
                                 Name -  {userDetails.name}
                               </strong>
                             </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Number -  {userDetails.mobile}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Original Price - &#8377; {totalOriginalPrice}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Coupon Discount - &#8377; {order.coupondiscount}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Product Discount - &#8377;{' '}
                                {totalOriginalPrice - totalpricefinal}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Additional Discount - &#8377;{' '}
                                {order.additionaldiscount}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Total Discount - &#8377;{' '}
                                {(order.coupondiscount || 0) +
                                  (order.additionaldiscount || 0) +
                                  totalDiscount}
                              </strong>
                            </li>
                            {usertype === 'admin' && (
                              <li className='list-group-item text-success'>
                                <strong>
                                  Cost Price - &#8377; {costAmount}
                                </strong>
                              </li>
                            )}
                            <li className='list-group-item text-success'>
                              <strong>
                                Final Payment Amount - {order.paymentamount}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Payment Status - {order.paymentstatus}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Paid Amount - Cash - {order.payment_cash} /
                                Online -{' '}
                                {order.payment_online
                                  ?.toString()
                                  .replace(/[^0-9.]/g, '')}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Bill Status -  {order.billstatus === 1 ? 'Approved' : 'Not Approved'}
                              </strong>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className='my-5'>
                        {usertype === 'admin' && (
                          <>
                            <div
                              className='btn shop-btn mx-1'
                              onClick={() => setShowPopup(true)}
                            >
                              Add Product to existing order
                            </div>
                            <div
                              className='btn shop-btn mx-4'
                              onClick={() => setShowDiscountPopup(true)}
                            >
                              Provide Additional Discount
                            </div>

                            <div className='btn shop-btn my-4'
                              onClick={() => setBillStatusModal(true)}
                            >
                              Approve Bill
                            </div>

                          </>
                        )}
                        {showPopup && (
                          <div className='popup-overlay'>
                            <div className='popup-content'>
                              <h3>Select Product</h3>

                              {/* Category Selection */}
                              <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                              >
                                <option value=''>Select Category</option>
                                {categories.map(category => (
                                  <option
                                    key={category.category_id}
                                    value={category.category_id}
                                  >
                                    {category.categoryname}
                                  </option>
                                ))}
                              </select>

                              {/* Subcategory Selection */}
                              {category && (
                                <select
                                  value={subcategory}
                                  onChange={e => setSubcategory(e.target.value)}
                                >
                                  <option value=''>Select Subcategory</option>
                                  {subcategories
                                    .filter(sub => sub.category_id === category)
                                    .map(subcategory => (
                                      <option
                                        key={subcategory.subcategory_id}
                                        value={subcategory.subcategory_id}
                                      >
                                        {subcategory.subcategoryname}
                                      </option>
                                    ))}
                                </select>
                              )}

                              {/* Product List Selection */}
                              {subcategory && (
                                <select
                                  value={selectedProduct}
                                  onChange={e => {
                                    setSelectedProduct(e.target.value);
                                  }}
                                >
                                  <option value=''>Select Product</option>
                                  {products.length > 0 &&
                                    products.map(product => (
                                      <option
                                        key={product.productid}
                                        value={product.productid}
                                      >
                                        {product.prod_name}{' '}
                                        <span style={{ color: '#34a853' }}>
                                          {' '}
                                          | Price -{' '}
                                          {product.price - product.discount}
                                        </span>
                                      </option>
                                    ))}
                                </select>
                              )}

                              {/* Quantity Selection */}
                              {selectedProduct && (
                                <input
                                  type='number'
                                  value={Added_quantity}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d+$/.test(val)) {
                                      setQuantity(val === '' ? '' : parseInt(val));
                                    }
                                  }}
                                  min='1'
                                  step='1'
                                  placeholder='Select Quantity'
                                  style={{
                                    backgroundColor: '#f5f5f5',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '15px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '15px',
                                  }}
                                />
                              )}

                              <button
                                className='btn shop-btn'
                                onClick={handleAddProduct}
                              >
                                Add Product
                              </button>
                              <button
                                className='btn shop-btn'
                                onClick={() => setShowPopup(false)}
                              >
                                Close
                              </button>
                              {loading && (
                                <div className='spinner-overlay'>
                                  <p className='spinner2'></p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className='row justify-content-between'>
                          <div className='col-sm-6'>
                            <div className='heading-custom-font-1'>
                              Items List
                            </div>
                          </div>
                          <div className='col-sm-6'>
                            <div className='heading-custom-font-1 my-2'>
                              Order Status : {order.delivery_status}{' '}
                            </div>
                          </div>
                        </div>

                        <div className='my-5'>
                          {/* <h4 className='heading-custom-font-1'>Items List</h4> */}
                          <div className='table-responsive text-custom-font-1'>
                            <table className='table table-striped table-bordered'>
                              <thead className='bg-light'>
                                <tr>
                                  <th>S.no</th>
                                  {/* <th>Product image</th> */}
                                  <th>Product Name</th>
                                  <th>Quantity</th>
                                  <th>Original MRP</th>
                                  <th>Discount</th>
                                  <th>Final Price</th>
                                  {<th>Actions</th> }
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
                                    {/* <td>
                                      <strong>
                                        <img
                                          src={`${process.env.REACT_APP_IMAGE_URL}${item.image}`}
                                          className='img-fluid'
                                          alt={`${item.prod_name}`}
                                          style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover'
                                          }}
                                        />
                                      </strong>
                                    </td> */}
                                    <td>
                                      <strong>{item.prod_name}</strong>
                                    </td>
                                    <td>
                                      <strong>{item.quantity}</strong>
                                    </td>
                                    <td>
                                      <strong>
                                        &#8377;&nbsp;{item.original_mrp}
                                      </strong>
                                    </td>
                                    <td>
                                      <strong>
                                        &#8377;&nbsp;
                                        {item.original_mrp - item.price_final}
                                      </strong>
                                    </td>
                                    <td>
                                      <strong>
                                        &#8377;&nbsp;{item.price_final}
                                      </strong>
                                    </td>
                                    <td> 
                                      {usertype === 'admin' && (
                                        <div className='col-md-2'>
                                          <button
                                            className='btn btn-danger'
                                            disabled={loading}
                                            onClick={e => {
                                              e.stopPropagation();
                                              removeItemFromOrder(
                                                item.productid
                                              );
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                <tr className='fs-5 fw-bold bg-light'>
                                  <td colSpan='2' className='text-center'>
                                    Total:
                                  </td>
                                  <td>&nbsp;{totalquantity}</td>
                                  <td>&#8377;&nbsp;{totalOriginalPrice}</td>
                                  <td>
                                    &#8377;&nbsp;
                                    {totalOriginalPrice - totalpricefinal}
                                  </td>
                                  {usertype !== "vendor" && (
                                  <td>
                                    &#8377;&nbsp;{totalpricefinal}
                                  </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {usertype === 'deliverypartner' && (
                        <div className='text-center my-3'>
                          <div className='row justify-content-center'>
                            {order.delivery_status !== 'CANCELLED' && (
                              <div className='col-12 col-md-auto my-2'>
                                <Link
                                  to={`/orderhistory/orderdetailsprint/${orderid}/customer/invoice`}
                                  className='shop-btn w-100'
                                >
                                  Download Invoice
                                </Link>
                              </div>
                            )}
                            <div className='col-12 col-md-auto my-2'>
                              <div
                                className='btn shop-btn w-100'
                                onClick={() => setCostPriceModal(true)}
                              >
                                Add Cost Price
                              </div>
                            </div>
                            <div className='col-12 col-md-auto my-2'>
                              <button
                                className='btn shop-btn w-100'
                                onClick={() => setInstructionsModalOpen(true)}
                              >
                                Instructions
                              </button>
                            </div>
                            <div className='col-12 col-md-auto my-2'>
                              <div
                                className='btn shop-btn w-100'
                                onClick={() => setPaymentModal(true)}
                              >
                                Receive Payment
                              </div>
                            </div>
                          </div>
                        </div>
                      )}


                      {usertype === 'admin' && (
                        <div className='text-center my-3'>
                          <div className='row justify-content-center'>
                            {order.delivery_status !== 'CANCELLED' && (
                              <div className='col-12 col-md-auto my-2'>
                                <Link
                                  to={`/orderhistory/orderdetailsprint/${orderid}/customer/invoice`}
                                  className='shop-btn w-100 my-4'
                                >
                                  Download Invoice
                                </Link>
                              </div>
                            )}

                            {/* Print Invoice Button */}
                            <div className='col-12 col-md-auto my-2'>
                              <Link
                                to={`/orderhistory/orderdetailsprint/${orderid}/customer`}
                                className='shop-btn w-100 my-4'
                              >
                                Print Invoice
                              </Link>
                            </div>

                            <div className='col-12 col-md-auto my-2'>
                              <button
                                className='btn shop-btn w-100 my-4'
                                onClick={() => setInstructionsModalOpen(true)}
                              >
                                Instructions
                              </button>
                            </div>

                            {/* Assign Delivery Staff Button */}
                            <div className='col-12 col-md-auto my-2'>
                              <button
                                className='btn shop-btn w-100 my-4'
                                onClick={handleDeliveryStaff}
                              >
                                Assign Delivery Staff
                              </button>
                            </div>

                            {/* Add Cost Price */}
                            <div className='col-12 col-md-auto my-2'>
                              <div
                                className='btn shop-btn w-100 my-4'
                                onClick={() => setCostPriceModal(true)}
                              >
                                Add Cost Price
                              </div>
                            </div>

                            {/* Receive Payment */}
                            <div className='col-12 col-md-auto my-2'>
                              <div
                                className='btn shop-btn w-100 my-4'
                                onClick={() => setPaymentModal(true)}
                              >
                                Receive Payment
                              </div>
                            </div>

                            {/* Chat with Customer button */}
                            {/* <div className='col-12 col-md-auto my-2'>
                              <div className='btn shop-btn w-100'>
                                Chat with Customer
                              </div>
                            </div> */}

                            {/* Back Button */}
                            <div className='col-12 col-md-auto my-2'></div>
                          </div>
                        </div>
                      )}

                      {/* {usertype === 'user' && (
                        <div className='text-center my-3'>
                          <div className='d-flex justify-content-center'>
                            <Link to='/OrderHistory' className='shop-btn mx-1'>
                              Back
                            </Link>
                          </div>
                        </div>
                      )} */}

                      {usertype === 'admin' && (
                        <>
                          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center mt-4'>
                            <button
                              onClick={connectwhatsapp_update}
                              className='shop-btn shop-btn-yellow w-auto my-4'
                            >
                              Update Order on WhatsApp
                            </button>
                             <button
                              onClick={sendOrderDetailViaWhatsApp}
                              className='shop-btn shop-btn-yellow w-auto my-4'
                            >
                              Send OrderDetail via WhatsApp
                            </button>
                            <Link
                              to='/allorders'
                              className='shop-btn shop-btn-yellow px-4 my-4'
                            >
                              Back to All Orders
                            </Link>
                          </div>
                          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center mt-4'>
                            <a
                              className='shop-btn shop-btn-red px-4 my-4'
                              rel='noreferrer'
                              target='_blank'
                              href={`https://api.whatsapp.com/send?phone=91${order.contact}&text=Hi, I am Grocji. I want to discuss about your order.`}
                            >
                              Chat with Customer
                            </a>
                          </div>
                        </>
                      )}

                      {usertype === 'user' && (
                        <>
                          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center mt-4'>
                            <button
                              onClick={connectwhatsapp_update}
                              className='shop-btn w-auto my-4'
                            >
                              Update Order on WhatsApp
                            </button>
                            <button
                              className='btn shop-btn w-auto my-4'
                              onClick={() => setInstructionsModalOpen(true)}
                            >
                              Instructions
                            </button>
                            <Link
                              to='/orderhistory'
                              className='shop-btn btn-success px-4 my-4'
                            >
                              Back to My Orders
                            </Link>
                            <button
                              className='shop-btn btn btn-success px-4 my-4'
                              onClick={() => navigate('/feedback')}
                            >
                              Submit Feedback
                            </button>
                          </div>

                          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center'>
                            <Link className='shop-btn shop-btn-yellow px-4 my-4'>
                              Call Customer Support - 8757499345
                            </Link>
                            <a
                              className='shop-btn shop-btn-red px-4 my-4'
                              rel='noreferrer'
                              target='_blank'
                              href='https://api.whatsapp.com/send?phone=918757499345&text=Hi, I want to discuss about my order.'
                            >
                              Chat with Customer Support
                            </a>
                          </div>

                          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center'>
                            <Link className='shop-btn shop-btn-yellow px-4 my-4'>
                              Call Delivery Partner - 8757499344
                            </Link>
                            <a
                              className='shop-btn shop-btn-red px-4 my-4'
                              rel='noreferrer'
                              target='_blank'
                              href='https://api.whatsapp.com/send?phone=918757499344&text=Hi, I have placed an order now.'
                            >
                              Chat with Delivery Partner
                            </a>
                          </div>
                        </>
                      )}

                      {usertype === 'deliverypartner' && (
                        <>
                          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center mt-4'>
                            <button
                              onClick={connectwhatsapp_update}
                              className='shop-btn shop-btn-yellow w-auto my-4'
                            >
                              Update Order on WhatsApp
                            </button>
                            <Link
                              to='/allorders'
                              className='shop-btn shop-btn-yellow px-4 my-4'
                            >
                              Back to All Orders
                            </Link>
                          </div>
                        </>
                      )}

                      {modal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Select Delivery Partner</h3>

                            <select
                              value={userid}
                              onChange={e => setUserid(e.target.value)}
                            >
                              <option value1=''>Select</option>
                              {deliveryPartners.map(item => (
                                <option key={item.userid} value={item.userid}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                            <button
                              className='btn shop-btn'
                              onClick={fetchDeliveryPartner}
                            >
                              Add Delivery Partner
                            </button>
                            <button
                              className='btn shop-btn'
                              onClick={() => {
                                setUserid('');
                                setModal(!modal);
                              }}
                            >
                              Close
                            </button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {alertmodal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Delivery Partner Assigned</h3>
                            <button
                              onClick={() => {
                                setAlertModal(!alertmodal);
                              }}
                            >
                              Ok
                            </button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Add Discount Modal */}
                      {showDiscountPopup && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Provide Additional Discount</h3>
                            <input
                              type='number'
                              onChange={e =>
                                setDiscountAmount(
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min='0'
                              step='0.01'
                              placeholder='Enter Discount Amount'
                              style={{
                                backgroundColor: '#f5f5f5',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '15px',
                              }}
                            />
                            <button
                              className='btn shop-btn'
                              onClick={handleAddDiscount}
                            >
                              Add Discount
                            </button>
                            <button
                              className='btn shop-btn'
                              onClick={() => setShowDiscountPopup(false)}
                            >
                              Close
                            </button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Add cost price modal */}
                      {costPriceModal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Enter Amount</h3>
                            <input
                              type='number'
                              value={costPrice}
                              onChange={e => {
                                const newAmount = parseFloat(e.target.value);
                                setCostprice(newAmount);
                              }}
                              min='0'
                              step='0.01'
                              placeholder='Enter Cost Amount'
                              style={{
                                backgroundColor: '#f5f5f5',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '15px',
                              }}
                            />

                            <button
                              className='btn shop-btn'
                              onClick={handleCostPriceAdd}
                            >
                              Add Cost Amount
                            </button>
                            <button
                              className='btn shop-btn'
                              onClick={() => setCostPriceModal(false)}
                            >
                              Close
                            </button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Add payment modal */}
                      {paymentModal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Enter Payment Amounts</h3>

                            {/* Cash Payment Input */}
                            <div className="mb-3 text-start">
                              <label htmlFor="cashAmount" className="form-label fw-bold fs-4">
                                Cash Amount
                              </label>
                              <input
                                type='number'
                                id="cashAmount"
                                className="form-control form-control-lg bg-light border-secondary fs-4"
                                value={cashPayment}
                                onChange={e => {
                                  const newAmount = parseFloat(e.target.value);
                                  setCashPayment(newAmount);
                                }}
                                min='0'
                                step='0.01'
                                placeholder='Enter cash Amount'
                                required

                              />
                            </div>

                            {/* Online Payment Input */}
                            <div className="mb-4 text-start">
                              <label htmlFor="onlineAmount" className="form-label fw-bold fs-4">
                                Online Amount
                              </label>
                              <input
                                type='number'
                                id="onlineAmount"
                                className="form-control form-control-lg bg-light border-secondary fs-4"
                                value={onlinePayment}
                                onChange={e => {
                                  const newAmount = parseFloat(e.target.value);
                                  setOnlinePayment(newAmount);
                                }}
                                min='0'
                                step='0.01'
                                placeholder='Enter online Amount'
                                required

                              />
                            </div>

                            <button className='btn shop-btn' onClick={handleSavePayment}>
                              Save Payment
                            </button>
                            <button className='btn shop-btn' onClick={() => setPaymentModal(false)}>
                              Close
                            </button>

                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}


                    </div>
                  )}
                </div>

                {billStatusModal && (
                  <div className='popup-overlay'>
                    <div className='popup-content'>
                      <h3>Update Bill Status</h3>


                      <div className='d-flex justify-content-center gap-3 my-4'>
                        <button
                          className='btn btn-success'
                          onClick={() => handleBillStatusChange('Approved')}
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => handleBillStatusChange('Cancelled')}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>

                      <button
                        className='btn shop-btn'
                        onClick={() => setBillStatusModal(false)}
                        disabled={loading}
                      >
                        Close
                      </button>

                      {loading && (
                        <div className='spinner-overlay'>
                          <p className='spinner2'></p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/*INSTRUCTIONS MODAL */}
                {isInstructionsModalOpen && (
                  <div className='popup-overlay'>
                    <div className='popup-content'>
                      <h3>Order Instructions</h3>

                      {usertype === 'user' && (
                        <div className="mb-3 text-start">
                          <label className="form-label fw-bold">Your Delivery Instructions</label>
                          <textarea
                            className="form-control"
                            value={customerNote}
                            onChange={(e) => setCustomerNote(e.target.value)}
                            readOnly={false}
                            rows="3"
                          ></textarea>
                        </div>
                      )}

                      {(usertype === 'admin' || usertype === 'deliverypartner') && (
                        <>
                          <div className="mb-3 text-start">
                            <label className="form-label fw-bold">Customer's Instructions</label>
                            <textarea
                              className="form-control"
                              value={customerNote}
                              readOnly={true}
                              rows="3"
                            ></textarea>
                          </div>


                          <div className="mb-3 text-start">
                            <label className="form-label fw-bold">Delivery Partner's Note</label>
                            <textarea
                              className="form-control"
                              value={deliveryPartnerNote}
                              onChange={(e) => setDeliveryPartnerNote(e.target.value)}
                              readOnly={usertype !== 'deliverypartner'}
                              rows="3"
                            ></textarea>
                          </div>


                          <div className="mb-3 text-start">
                            <label className="form-label fw-bold">Admin's Note</label>
                            <textarea
                              className="form-control"
                              value={adminNote}
                              onChange={(e) => setAdminNote(e.target.value)}
                              readOnly={usertype !== 'admin'}
                              rows="3"
                            ></textarea>
                          </div>
                        </>
                      )}


                      {usertype === 'user' && (
                        <button className='btn shop-btn' onClick={handleUpdateCustomerNote} disabled={loading}>
                          Save My Instructions
                        </button>
                      )}
                      {(usertype === 'deliverypartner' || usertype === 'admin') && (
                        <button className='btn shop-btn' onClick={handleSaveNotes} disabled={loading}>
                          Save My Note
                        </button>
                      )}
                      <button className='btn shop-btn mt-2' onClick={() => setInstructionsModalOpen(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {usertype === 'admin' && (
                  <section className='mt-5 old-orders-section'>
                    <h2 className='mb-2 main-heading-custom-font-1'>
                      Old Orders - {/*{order && order.srno}*/}
                    </h2>
                    <div className='card p-3'>
                      {oldOrdersloading ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                          }}
                        >
                          <img
                            src={loaderGif}
                            alt='Loading...'
                            style={{ width: '80px', height: '80px' }}
                          />
                        </div>
                      ) : oldOrders.length > 0 ? (
                        oldOrders.map((order, index) => (
                          <div key={index} className='card mb-3'>
                            <div
                              className={findClassNames(
                                order.order_status,
                                order.delivery_status
                              )}
                            >
                              <div className='row'>
                                <div className='col-sm-12'>
                                  <div className='order-card'>
                                    <div className='order-details'>
                                      <h5 className='card-title'>
                                        <strong>
                                          Order NO - {order.srno}. Total ₹
                                          {order.paymentamount}
                                        </strong>
                                      </h5>
                                    </div>

                                    <button
                                      className='view-details-btn'
                                      onClick={() =>
                                        handleOrderClick(order.order_id)
                                      }
                                    >
                                      View Details
                                    </button>
                                  </div>
                                  <div className='text-end'></div>
                                  <p>
                                    <strong>Customer Name - </strong>{' '}
                                    {order.name}
                                  </p>
                                  <p>
                                    <strong>Order ID - </strong>{' '}
                                    {order.order_id}
                                  </p>
                                  <p>
                                    <strong>Placed on - </strong>{' '}
                                    {order.order_date},{' '}
                                    {order.order_time.substring(0, 4) +
                                      ' ' +
                                      order.order_time
                                        .substring(8, 12)
                                        .toUpperCase()}
                                  </p>
                                  <p>
                                    <strong>Order Status -</strong>{' '}
                                    {order.order_status}
                                  </p>
                                  <p>
                                    <strong>Delivery Status -</strong>{' '}
                                    {order.delivery_status}
                                  </p>
                                  <p>
                                    <strong>Delivery Partner -</strong>{' '}
                                    {deliveryPartners.map((partner, index) =>
                                      order.delivery_partner ===
                                        partner.userid ? (
                                        <span>
                                          {'  '}
                                          {partner.name}
                                        </span>
                                      ) : (
                                        <span> </span>
                                      )
                                    )}
                                  </p>
                                  <p>
                                    <strong>Cost Amount -</strong>{' '}
                                    <span>₹{order.costamount}</span>
                                  </p>
                                  <p>
                                    <strong>Payment Mode -</strong>{' '}
                                    {order.paymentmode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No orders found.</p>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetail;
