import { Formik, Field, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import JoditEditor from 'jodit-react';
import { toast } from "react-toastify";
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const AddDiscount = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [users, setUsers] = useState([]);
  const [userid, setUserid] = useState('');
  const [currentMonthSpendings, setCurrentMonthSpendings] = useState(0);
  const [spendingFilter, setSpendingFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  const formValues = {
    discountname: "", amount: "", percentage: "", maxdiscount: "", mincartvalue: "",
    maxcartvalue: "", image: "", count: "", isoffer: "0", ishidden: "0",
    description: "", startdate: "", enddate: "",
  };

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        if (spendingFilter === ">5000") {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/highSpendingUsers`);
          setUsers(response.data);
        } else if (spendingFilter === "<5000") {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/lessSpendingUsers`);
          setUsers(response.data);
        }
        setCurrentMonthSpendings('');
        setUserid('');
      } catch (error) {
        console.error("Error fetching filtered users:", error);
      }
    };

    if (spendingFilter) {
      fetchFilteredUsers();
    }
  }, [spendingFilter]);

  useEffect(() => {
    const fetchCurrentMonthSpendings = async () => {
      if (userid) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/getCurrentMonthExpenseByUserId/${userid}`);
          setCurrentMonthSpendings(response.data.currentMonthSpendings);
        } catch (error) {
          console.error("Error fetching spendings:", error);
        }
      } else {
        setCurrentMonthSpendings('');
      }
    };
    fetchCurrentMonthSpendings();
  }, [userid]);

  const submitDiscount = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("discountname", values.discountname);
      formData.append("amount", values.amount);
      formData.append("percentage", values.percentage);
      formData.append("maxdiscount", values.maxdiscount);
      formData.append("mincartvalue", values.mincartvalue);
      formData.append("maxcartvalue", values.maxcartvalue);
      formData.append("image", image);
      formData.append("count", values.count);
      formData.append("isoffer", values.isoffer);
      formData.append("ishidden", values.ishidden);
      formData.append("description", desc);
      formData.append("startdate", values.startdate);
      formData.append("enddate", values.enddate);

      const token = localStorage.getItem('jwttoken'); 
      await axios.post(
        `${process.env.REACT_APP_API_URL}discount/adddiscount`,
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            "x-access-token": token
          } 
        }
      );
      toast.success("Discount added successfully!");
      navigate("/discountlist");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add the discount.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Discount</h4>
          </div>
          <div className="card-body p-4">
            <Formik initialValues={formValues} onSubmit={submitDiscount}>
              {({ setFieldValue }) => (
                <Form>
                  <h5 className="text-success mb-3">Customer Spending Filter (Optional)</h5>
                  <div className="row mb-3 align-items-center p-3 bg-light rounded">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Filter by Spending:</label>
                      <div className="d-flex gap-3">
                         <div className="form-check">
                          <input className="form-check-input" type="radio" name="spendingFilter" id="gt5000" value=">5000" onChange={() => setSpendingFilter(">5000")} checked={spendingFilter === ">5000"} />
                          <label className="form-check-label" htmlFor="gt5000">&gt; 5000</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="spendingFilter" id="lt5000" value="<5000" onChange={() => setSpendingFilter("<5000")} checked={spendingFilter === "<5000"} />
                          <label className="form-check-label" htmlFor="lt5000">&lt; 5000</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="userSelect" className="form-label fw-semibold">Select User:</label>
                      <Field as="select" name="userid" id="userSelect" className="form-select" onChange={(e) => {
                          const selectedUserId = e.target.value;
                          setFieldValue("userid", selectedUserId);
                          setUserid(selectedUserId);
                        }}>
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user.userid} value={user.userid}>{user.name}</option>
                        ))}
                      </Field>
                    </div>
                     <div className="col-md-4">
                        <label className="form-label fw-semibold">Current Month's Spending:</label>
                        <input type="text" className="form-control" value={currentMonthSpendings} readOnly />
                     </div>
                  </div>

                  <hr className="my-4" />
                  <h5 className="text-success mb-3">Discount Details</h5>
                   <div className="row">
                    <div className="col-md-6">
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Name:</label>
                        <div className="col-md-8"><Field name="discountname" type="text" className="form-control" required /></div>
                      </div>
                       <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Amount:</label>
                        <div className="col-md-8"><Field name="amount" type="number" className="form-control" /></div>
                      </div>
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Percentage:</label>
                        <div className="col-md-8"><Field name="percentage" type="number" className="form-control" /></div>
                      </div>
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Max Discount:</label>
                        <div className="col-md-8"><Field name="maxdiscount" type="number" className="form-control" /></div>
                      </div>
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Usage Count:</label>
                        <div className="col-md-8"><Field name="count" type="number" className="form-control" required /></div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Min Cart Value:</label>
                        <div className="col-md-8"><Field name="mincartvalue" type="number" className="form-control" /></div>
                      </div>
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Max Cart Value:</label>
                        <div className="col-md-8"><Field name="maxcartvalue" type="number" className="form-control" /></div>
                      </div>
                      <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Start Date:</label>
                        <div className="col-md-8"><Field name="startdate" type="date" className="form-control" required /></div>
                      </div>
                       <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">End Date:</label>
                        <div className="col-md-8"><Field name="enddate" type="date" className="form-control" required /></div>
                      </div>
                       <div className="row mb-3 align-items-center">
                        <label className="col-md-4 col-form-label text-end fw-semibold text-success">Image:</label>
                        <div className="col-md-8">
                          <input name="image" type="file" className="form-control" onChange={(event) => { setImage(event.target.files[0]) }}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-2 col-form-label text-end fw-semibold text-success">Description:</label>
                    <div className="col-md-10"><JoditEditor value={desc} onChange={(newContent) => setDesc(newContent)}/></div>
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-success px-4 me-3" disabled={loading}>
                      {loading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> Adding...</>) : 'Submit Now'}
                    </button>
                    <Link to="/discountlist" className="btn btn-outline-danger px-4">Back</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDiscount;