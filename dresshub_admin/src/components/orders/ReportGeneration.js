import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
import SearchBar from "../brand/SearchBar";
import { toast } from "react-toastify";

const ReportGeneration = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/Orders`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError('Something went wrong while fetching report.')
      }
      finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      fetchFilteredReport(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function fetchFilteredReport(value){
    setLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}orders/searchReportItem/${value}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setOrders(filteredBrands);
          setLoading(false);
        }else {
          setLoading(false);
          toast.warn(`No Matches were found for search text : ${value}`);
        }
      }else {
        setLoading(false);
        toast.error("Error occurred while filtering data");
      }
    }catch(err){
      setLoading(false);
      toast.error("Error occurred while fetching data");
    }
  }

  return (
    <>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex mb-3">
              <h2 className="text-success fw-bold">Report</h2>
              <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
            </div>
            <div className="d-flex gap-2">
            <Link to='/dailyreport' className="btn btn-success">Daily Report</Link>
            <Link to='/detailedreport' className="btn btn-success"> Settlement Report</Link>
            </div>
        </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle ">
              <thead className="table-success text-center">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Total Orders</th>
                  <th>Total Price</th>
                  <th>Average Price</th>
                  <th>Last Order Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-3">
                      <Spinner animation="border" variant="success" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center text-danger py-4 fw-semibold">
                      {error}
                    </td>
                  </tr>
                ) : orders.map((order, index) => (
                  <tr key={index} className="text-center">
                    <td>{order.userid}</td>
                    <td className="fw-semibold text-success">{order.name}</td>
                    <td>
                      <a
                        href={`https://wa.me/${order.mobile}?text=Hello%20${encodeURIComponent(
                          order.name
                        )},%20we%20noticed%20your%20order%20activity!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        {order.mobile}
                      </a>
                    </td>
                    <td>{order.total_orders}</td>
                    <td>{order.total_price}</td>
                    <td>{order.average_price}</td>
                    <td>{order.last_order_date}</td>
                  </tr>
                ))
              }
                {}
              </tbody>
            </table>
          </div>
      </div>
    </>
  );
};

export default ReportGeneration;
