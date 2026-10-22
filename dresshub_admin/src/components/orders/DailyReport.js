import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import SearchBar from '../brand/SearchBar';

let today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
today = `${year}-${month}-${day}`;

const DailyReport = () => {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState("");

  const fetchOrders = async (start, end) => {
    const values = {
      startDate: start,
      endDate: end,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}orders/ordersbyDate`,
        values
      );
      setOrders(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Something went wrong while fetching Orders.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    const formattedDate = `${parseInt(day)}/${parseInt(month)}/${year}`;
    return formattedDate;
  };

  const handleStartDateChange = e => {
    const date = e.target.value;

    if (date > today) {
      toast.warning('Start date cannot be in the future');
      return;
    }

    if (date > endDate) {
      toast.warning('Start date cannot be after end date');
      return;
    }

    setStartDate(date);
    setLoading(true);
    fetchOrders(formatDate(date), formatDate(endDate));
  };

  const handleEndDateChange = e => {
    const date = e.target.value;

    if (date > today) {
      toast.warning('End date cannot be in the future');
      return;
    }

    if (date < startDate) {
      toast.warning('End date cannot be before start date');
      return;
    }

    setEndDate(date);
    setLoading(true);
    fetchOrders(formatDate(startDate), formatDate(date));
  };

  useEffect(() => {
    fetchOrders(formatDate(today), formatDate(today));
  }, []);

  function handleSearchTextSubmission(value) {
    setSearchText(value);
  }

  useEffect(() => {
    if (searchText !== "") {
      filterDailyReport(setSearchText);
    }

    return () => {
      setSearchText("");
    }
  }, [searchText]);

  async function filterDailyReport(value) {
    setLoading(true);
    try {
      let data = await axios.get(`${process.env.REACT_APP_API_URL}orders/searchDailyReportItem/${formatDate(startDate)}/${formatDate(endDate)}/${value}`);
      if (data.status == 200) {
        let filteredBrands = data.data.filteredData || [];
        if (filteredBrands.length > 0) {
          setOrders(filteredBrands);
          setLoading(false);
        } else {
          setLoading(false);
          toast.warn(`No Matches were found for search text : ${value}`);
        }
      } else {
        setLoading(false);
        toast.error("Error occurred while filtering data");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Error occurred while fetching data");
    }
  }

  const dailyData = orders;
  return (
    <>

      <div className='container mt-4'>
        <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3'>
          <div className='d-flex align-items-center'>
            <h2 className='text-success fw-bold mb-0'>Daily Report</h2>
            <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          </div>

          <div className='d-flex align-items-center gap-3'>
            <div className='d-flex align-items-center'>
              <label className='me-2 text-success fw-semibold'>
                Start Date
              </label>
              <input
                type='date'
                value={startDate}
                max={endDate > today ? today : endDate}
                className='form-control border-success'
                onChange={handleStartDateChange}
              />
            </div>
            <div className='d-flex align-items-center'>
              <label className='me-2 text-success fw-semibold'>
                End Date
              </label>
              <input
                type='date'
                value={endDate}
                min={startDate}
                max={today}
                className='form-control border-success'
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </div>

        <div className='table-responsive'>
          <table className='table table-bordered table-hover align-middle'>
            <thead className='table-success text-center'>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>No. of Orders</th>
                <th>Total Price</th>
                <th>Total Cost</th>
                <th>Total Profit</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='8' className='text-center p-3'>
                    <Spinner animation='border' variant='success' />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan='8'
                    className='text-center text-danger py-4 fw-semibold'
                  >
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan='8' className='text-center text-muted py-4'>
                    No Orders found.
                  </td>
                </tr>
              ) : (
                dailyData.length > 0 &&
                dailyData.map((order, index) => (
                  <tr key={index} className='text-center'>
                    <td>{order.userid}</td>
                    <td>{order.name}</td>
                    <td>
                      <a
                        href={`https://wa.me/${order.mobile}?text=Hello%20${encodeURIComponent(
                          order.name
                        )},%20we%20noticed%20your%20order%20activity!`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {order.mobile}
                      </a>
                    </td>
                    <td>{order.total_orders}</td>
                    <td>{order.total_price}</td>
                    <td>{order.total_cost}</td>
                    <td>{order.total_profit}</td>
                    <td>{order.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DailyReport;