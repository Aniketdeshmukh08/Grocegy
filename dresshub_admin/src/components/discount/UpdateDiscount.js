import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import JoditEditor from 'jodit-react';
import { toast } from "react-toastify";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import Spinner from "react-bootstrap/Spinner";
import 'react-toastify/dist/ReactToastify.css';

const UpdateDiscount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [desc, setDesc] = useState('');
  const [formValues, setFormValues] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null); // To compare changes
  const [image, setImage] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [loadingOnModal, setLoadingOnModal] = useState(false);
  const [updatedValues, setUpdatedValues] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('jwttoken');
    axios
      .get(`${process.env.REACT_APP_API_URL}discount/discountbyid/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        const data = res.data[0];
        let obj = {
          discountname: data.discountname, amount: data.amount, percentage: data.percentage,
          maxdiscount: data.maxdiscount, mincartvalue: data.mincartvalue, maxcartvalue: data.maxcartvalue,
          image: data.image, count: data.count, isoffer: data.isoffer, ishidden: data.ishidden,
          description: data.description, startdate: formatDate(data.startdate), enddate: formatDate(data.enddate),
        };
        setFormValues(obj);
        setInitialFormValues(obj); // Store initial state
        setDesc(obj.description);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch discount data.");
      });
  }, [id]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };
  
  const triggerUpdateConfirmation = (values) => {
      const isUnchanged =
        JSON.stringify(initialFormValues) === JSON.stringify(values) && !image && desc === initialFormValues.description;

      if(isUnchanged) {
          toast.info("No changes were made. Nothing to update.");
          return;
      }
      setUpdatedValues(values);
      setModalShow(true);
  };
  
  const handleUpdate = async () => {
    setLoadingOnModal(true);
    try {
      const formData = new FormData();
      Object.keys(updatedValues).forEach((key) => {
        formData.append(key, updatedValues[key]);
      });
      formData.set("description", desc);
      if (image) {
        formData.append("image", image);
      }
      const token = localStorage.getItem('jwttoken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}discount/updatediscount/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        }
      );
      toast.success("Discount updated successfully!");
      navigate("/discountlist");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update the discount.");
    } finally {
        setModalShow(false);
        setLoadingOnModal(false);
    }
  };

  if (!formValues) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Update Discount</h4>
          </div>
          <div className="card-body p-4">
            <Formik enableReinitialize={true} initialValues={formValues} onSubmit={triggerUpdateConfirmation}>
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Name:</label>
                      <div className="col-md-8"><Field name="discountname" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Amount:</label>
                      <div className="col-md-8"><Field name="amount" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Percentage:</label>
                      <div className="col-md-8"><Field name="percentage" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Max Discount:</label>
                      <div className="col-md-8"><Field name="maxdiscount" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Min Cart Value:</label>
                      <div className="col-md-8"><Field name="mincartvalue" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Max Cart Value:</label>
                      <div className="col-md-8"><Field name="maxcartvalue" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Count:</label>
                      <div className="col-md-8"><Field name="count" type="text" className="form-control"/></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Is Offer:</label>
                      <div className="col-md-8"><Field name="isoffer" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Is Hidden:</label>
                      <div className="col-md-8"><Field name="ishidden" type="text" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Start Date:</label>
                      <div className="col-md-8"><Field name="startdate" type="date" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">End Date:</label>
                      <div className="col-md-8"><Field name="enddate" type="date" className="form-control"/></div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">Current Image:</label>
                      <div className="col-md-8">
                        <img src={`${process.env.REACT_APP_API_URL}${formValues.image}`} alt={formValues.discountname} className="img-fluid" style={{ maxHeight: "100px", borderRadius: '5px' }}/>
                      </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <label className="col-md-4 col-form-label text-end fw-semibold text-success">New Image:</label>
                      <div className="col-md-8"><input name="image" type="file" className="form-control" onChange={handleFileChange}/></div>
                    </div>
                  </div>
                </div>
                 <div className="row mb-3 align-items-center">
                    <label className="col-md-2 col-form-label text-end fw-semibold text-success">Description:</label>
                    <div className="col-md-10"><JoditEditor value={desc} onChange={(newContent) => setDesc(newContent)}/></div>
                 </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-success px-4 me-3">Submit</button>
                  <Link to="/discountlist" className="btn btn-outline-danger px-4">Back</Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Are you sure you want to update this discount?"
        onHide={() => setModalShow(false)}
        confirmation={handleUpdate}
        operationType="Update"
        wantToAddData={true}
        loading={loadingOnModal}
      />
    </>
  );
};

export default UpdateDiscount;