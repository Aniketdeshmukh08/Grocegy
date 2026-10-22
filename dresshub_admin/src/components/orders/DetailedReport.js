import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import SearchBar from '../brand/SearchBar';

const DetailedReport = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [editing, setEditing] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [totalSettleAmount, setTotalSettleAmount] = useState(0);
  const [totalSettleProfit, setTotalSettleProfit] = useState(0);
  const [settlementData, setSettlementData] = useState([]);
  const [isUnsettling, setIsUnsettling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const itemsPerPage = 100;
  const [totalvalue, settotal] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [currentSrNo, setCurrentSrNo] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchTotals = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/sumofallOrders`
      );
      settotal(response.data.totals);
    } catch (err) {
      console.error('Failed to fetch order totals', err);
    }
  };

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/paginated-orders`,
        {
          params: {
            page,
            limit: itemsPerPage,
          },
        }
      );
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setCount(response.data.totalOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Something went wrong while fetching the orders');
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("count", count)
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const getting_all_orders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/allOrders`
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSelectOrder = order => {
    const isAlreadySelected = selectedOrders.find(o => o.srno === order.srno);
    const isOrderSettled = order.final_settle === 1;

    if (isAlreadySelected) {
      setSelectedOrders(prev => prev.filter(o => o.srno !== order.srno));
      return;
    }

    setSelectedOrders(prev => [...prev, order]);
  };

  const handleRemarkChange = (srno, value) => {
    setRemarks(prev => ({ ...prev, [srno]: value }));
  };

  const toggleEdit = srno => {
    setEditing(prev => ({ ...prev, [srno]: !prev[srno] }));
  };

  const updateRemark = async (srno, order) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}orders/addremark`, {
        srno,
        remarks: remarks[srno] || '',
      });
      order.remarks = remarks[srno] || '';
      toast.success('Remark updated successfully!');
      // alert("Remark updated successfully!");
      toggleEdit(srno);
    } catch (error) {
      console.error('Error updating remark:', error);
      toast.error('Error updating remark:', error);
    }
  };

  const calculateSettleAmount = (unsettle = false) => {
    setIsUnsettling(unsettle);

    const data = selectedOrders.map(order => {
      const settle_online = order?.payment_online || 0;
      //const settle_cash = order?.payment_cash || 0;
      const settle_cash = (order?.payment_cash - order?.costamount) || 0;
      const total_settle_amount = settle_online + settle_cash;
      const profit = order?.paymentamount - order?.costamount;
      return {
        srno: order?.srno,
        settle_online,
        settle_cash,
        total_settle_amount,
        profit
      };
    });

    const total = data.reduce((sum, item) => sum + item?.settle_cash, 0);
    const profitTemp = data.reduce((sum, item) => sum + item.profit, 0);
    setTotalSettleAmount(total);
    setTotalSettleProfit(profitTemp)
    setSettlementData(data);
    setShowModal(true);
  };

  const confirmSettlement = async () => {
    try {
      setShowModal(false);
      await axios.put(`${process.env.REACT_APP_API_URL}orders/settleOrders`, {
        orders: settlementData,
        final_settle: 1,
      });

      toast.success('Orders settled successfully!');
      fetchOrders(currentPage);
      setSelectedOrders([]);
      setSettlementData([]);
    } catch (error) {
      console.error('Error settling orders:', error);
    }
  };

  const markAsUnsettled = async () => {
    try {
      setShowModal(false);
      const srnos = selectedOrders.map(order => ({
        srno: order.srno,
      }));

      await axios.put(`${process.env.REACT_APP_API_URL}orders/unsettleOrders`, {
        orders: srnos,
        final_settle: 0,
      });

      toast.success('Orders marked as unsettled!');
      await fetchOrders(currentPage);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Error unsetting orders:', error);
    }
  };

  const checkCalc = (
    paymentamount,
    costamount,
    payment_online,
    payment_cash
  ) => {
    return (
      paymentamount - costamount ===
      payment_online + (payment_cash - costamount)
    );
  };

  const handleApproveClick = srno => {
    setCurrentSrNo(srno);
    setShowApproveModal(true);
  };

  const confirmApproval = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}orders/approveOnlinePayment`,
        {
          srno: currentSrNo,
        }
      );
      toast.success('Online payment approved successfully!');
      setShowApproveModal(false);
      getting_all_orders();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment.');
    }
  };

  function handleSearchTextSubmission(value){
    setSearchText(value);
  }

  useEffect(()=>{
    if(searchText!==""){
      fetchFilteredData(searchText);
    }

    return ()=>{
      setSearchText("");
    }
  }, [searchText]);

  async function fetchFilteredData(value) {
    setIsLoading(true);
    try{
      let data = await axios.get(`${process.env.REACT_APP_API_URL}orders/searchItem/${value}`);
      if(data.status==200){ 
        let filteredBrands = data.data.filteredData || [];
        if(filteredBrands.length>0){
          setOrders(filteredBrands);
          setIsLoading(false);
        }else {
          setIsLoading(false);
          toast.warn(`No Matches were found for search text : ${value}`);
        }
      }else {
        setIsLoading(false);
        toast.error("Error occurred while filtering data");
      }
    }catch(err){
      setIsLoading(false);
      toast.error("Error occurred while fetching data");
    }
  }

  return (
    <>
      
      <div className='container mt-4'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div className='d-flex mb-3'>
            <h2 className='text-success fw-bold'>Report Settlement</h2>
            <SearchBar placeholder='Search ...' searchValueFn={handleSearchTextSubmission} />
          </div>

          <div className='d-flex'>
            <span
              className={`${count > 0 ? 'text-success' : 'text-danger'} fw-bold fs-4`}
            >
              Total Orders: {count}
            </span>
          </div>
          <div className='d-flex align-items-center'>
            <button
              className='btn btn-success btn-sm me-2'
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <span className='me-2'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className='btn btn-success btn-sm'
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </button>
          </div>
        </div>

        <div className='d-flex justify-content-end align-items-center mb-3'>
          <button
            className='btn btn-danger btn-sm me-2'
            onClick={() => calculateSettleAmount(true)}
            disabled={
              selectedOrders.length === 0 ||
              selectedOrders.some(o => o.final_settle === 0)
            }
          >
            Mark as UnSettled
          </button>
          <button
            className='btn btn-success btn-sm me-2'
            onClick={() => calculateSettleAmount(false)}
            disabled={
              selectedOrders.length === 0 ||
              selectedOrders.some(o => o.final_settle === 1)
            }
          >
            Settle Selected Orders
          </button>

          <button className='btn btn-success btn-sm me-2' onClick={fetchTotals}>
            Fetch Total Report
          </button>
          <button
            className='btn btn-success btn-sm'
            onClick={() => settotal(null)}
          >
            Hide Total Report
          </button>
        </div>
        {totalvalue && (
          <>
            <div className='mt-4 mb-4 bg-grey-100 p-4 rounded shadow d-flex justify-content-between align-items-center'>
              <span className='btn btn-success mx-4'>
                <strong>Total Sale Amount:</strong>
                <br></br> ₹{totalvalue.totalPaymentAmount}
              </span>
              <span className='btn btn-warning mx-4'>
                <strong>Total Cost Amount:</strong>
                <br></br> ₹{totalvalue.totalCostAmount}
              </span>
              <span className='btn btn-success mx-4'>
                <strong>Total Profit Amount:</strong>
                <br></br> ₹
                {totalvalue.totalPaymentAmount - totalvalue.totalCostAmount}
              </span>
              <span className='btn btn-secondary mx-4'>
                <strong>Total Online Payment:</strong>
                <br></br> ₹{totalvalue.totalPaymentOnline}
              </span>
              <span className='btn btn-secondary mx-4'>
                <strong>Total Cash Payment:</strong>
                <br></br> ₹{totalvalue.totalPaymentCash}
              </span>
            </div>
          </>
        )}

        <div className='table-responsive'>
          <table className='table table-bordered table-hover align-middle'>
            <thead className='table-success text-center'>
              <tr>
                <th>Select</th>
                <th>Order No</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Payment Online</th>
                <th>Payment Cash</th>
                <th>Cost Amount</th>
                <th>Cost Online</th>
                <th>Cost Cash</th>
                <th>Profit</th>
                <th>Settle Online</th>
                <th>Settle Cash</th>
                <th>Check</th>
                <th>Settled</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan='16' className='text-center p-3'>
                    <Spinner animation='border' variant='success' />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan='16'
                    className='text-center text-danger py-4 fw-semibold'
                  >
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan='16' className='text-center text-muted py-4'>
                    No Orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`text-center ${selectedOrders.includes(order) ? 'table-warning' : order.payment_online + order.payment_cash > 0 ? '' : 'table-danger'}`}
                  >
                    <td>
                      <input
                        type='checkbox'
                        checked={selectedOrders.includes(order)}
                        onChange={() => handleSelectOrder(order)}
                        disabled={
                          selectedOrders.length > 0 &&
                          selectedOrders[0].final_settle !== order.final_settle
                        }
                      />
                    </td>
                    <td>{order.srno}</td>
                    <td>{order.order_date}</td>
                    <td>{order.paymentamount}</td>
                    <td>
                      <td className='align-middle'>
                        {String(order.payment_online)
                          .toLowerCase()
                          .includes('temp') ? (
                          <div
                            className='d-flex align-items-center justify-content-between gap-2'
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <span>
                              ₹{' '}
                              {parseFloat(
                                order.payment_online
                                  .toString()
                                  .replace(/[^0-9.]/g, '')
                              )}
                            </span>
                            <button
                              className='btn btn-outline-success btn-md px-2 py-0'
                              style={{
                                fontSize: '0.75rem',
                                lineHeight: '1.5rem',
                              }}
                              onClick={() => handleApproveClick(order.srno)}
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <div style={{ marginLeft: '20px' }}>
                            ₹ {order.payment_online}
                          </div>
                        )}
                      </td>
                    </td>

                    <td>{order.payment_cash}</td>
                    <td>{order.costamount}</td>
                    <td>{order.cost_online || 0}</td>
                    <td>{order.cost_cash || 0}</td>
                    <td>{order.paymentamount - order.costamount || 0}</td>
                    <td>{order.payment_online || 0}</td>
                    <td>{order.payment_cash - order.costamount || 0}</td>
                    <td>
                      {checkCalc(
                        order.paymentamount,
                        order.costamount,
                        order.payment_online,
                        order.payment_cash
                      ) ? (
                        <span className='badge text-bg-light py-2'>True</span>
                      ) : (
                        <span className='badge text-bg-danger py-2'>False</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          order.final_settle === 0
                            ? 'badge text-bg-warning py-2'
                            : 'badge text-bg-success py-2'
                        }
                      >
                        {order.final_settle === 0 ? 'Not Settled' : 'Settled'}
                      </span>
                    </td>
                    <td>
                      {editing[order.srno] ? (
                        <input
                          type='text'
                          // value={remarks[order.srno] || order.remarks || ""}
                          value={
                            remarks.hasOwnProperty(order.srno)
                              ? remarks[order.srno]
                              : order.remarks || ''
                          }
                          onChange={e =>
                            handleRemarkChange(order.srno, e.target.value)
                          }
                        />
                      ) : (
                        <span>{remarks[order.srno] || order.remarks}</span>
                      )}
                    </td>
                    <td>
                      {editing[order.srno] ? (
                        <button
                          className='btn btn-sm btn-success'
                          onClick={() => updateRemark(order.srno, order)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className='btn btn-sm btn-outline-success '
                          onClick={() => toggleEdit(order.srno)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ConfirmationModal
          show={showModal}
          modalMessage={`Do you want to ${isUnsettling ? 'mark these orders as unsettled' : 'settle these orders'}?`}
          onHide={() => setShowModal(false)}
          confirmation={isUnsettling ? markAsUnsettled : confirmSettlement}
          operationType='Confirm'
          wantToAddData={true}
          modalAmmountMsg={`Total Settle Cash: ${totalSettleAmount}`}
        />

        <ConfirmationModal
          show={showApproveModal}
          modalMessage='Approve this payment?'
          onHide={() => setShowApproveModal(false)}
          confirmation={confirmApproval}
          operationType='Approve'
          wantToAddData={true}
          modalAmmountMsg={`Order #: ${currentSrNo}`}
          modalAmmountMsg2={totalSettleProfit}
        />
      </div>
    </>
  );
};

export default DetailedReport;