import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../shared/ConfirmationModal"; // Assumed path
import Spinner from "react-bootstrap/Spinner";
import "react-toastify/dist/ReactToastify.css";

const DiscountList = () => {
  const [discount, setDiscount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwttoken'); 
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}discount/alldiscount`,
          { headers: { "x-access-token": token } }
        );
        setDiscount(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Could not fetch the list of discounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('jwttoken'); 
      await axios.put(
        `${process.env.REACT_APP_API_URL}discount/removediscount/${deletedId}`,
        {},
        { headers: { "x-access-token": token } }
      );
      setDiscount(discount.filter((discounts) => discounts.discountid !== deletedId));
      toast.success("Discount deleted successfully!");
    } catch (err) {
      console.log("Error deleting discount:", err);
      toast.error("Failed to delete the discount.");
    }
    setModalShow(false);
  };
  
  const showDeleteModal = (id) => {
    setDeletedId(id);
    setModalShow(true);
  };

  return (
    <>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Discount List</h2>
          <Link to="/adddiscount" className="btn btn-success">
            ➕ Add New Discount
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>Sr.</th>
                <th>Disc. ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>%</th>
                <th>Max Disc.</th>
                <th>Min Cart</th>
                <th>Max Cart</th>
                <th>Image</th>
                <th>Count</th>
                <th>Offer</th>
                <th>Hidden</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="16" className="text-center p-3"><Spinner animation="border" variant="success" /></td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="16" className="text-center text-danger py-4 fw-semibold">{error}</td>
                </tr>
              ) : discount.length === 0 ? (
                <tr>
                  <td colSpan="16" className="text-center text-muted py-4">No discounts found.</td>
                </tr>
              ) : (
                discount.map((discounts, index) => (
                  <tr key={discounts.discountid} className="text-center">
                    <td>{index + 1}</td>
                    <td>{discounts.discountid}</td>
                    <td className="fw-semibold text-success">{discounts.discountname}</td>
                    <td>{discounts.amount}</td>
                    <td>{discounts.percentage}</td>
                    <td>{discounts.maxdiscount}</td>
                    <td>{discounts.mincartvalue}</td>
                    <td>{discounts.maxcartvalue}</td>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}${discounts.image}`}
                        alt={discounts.discountname}
                        width="60"
                        style={{ borderRadius: '5px' }}
                      />
                    </td>
                    <td>{discounts.count}</td>
                    <td>{discounts.isoffer ? 'Yes' : 'No'}</td>
                    <td>{discounts.ishidden ? 'Yes' : 'No'}</td>
                    <td dangerouslySetInnerHTML={{ __html: discounts.description }}></td>
                    <td>{formatDate(discounts.startdate)}</td>
                    <td>{formatDate(discounts.enddate)}</td>
                    <td>
                      <Link
                        to={`/updatediscount/${discounts.discountid}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => showDeleteModal(discounts.discountid)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmationModal
        show={modalShow}
        modalMessage="Are you sure you want to delete this discount?"
        onHide={() => setModalShow(false)}
        confirmation={handleDelete}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default DiscountList;