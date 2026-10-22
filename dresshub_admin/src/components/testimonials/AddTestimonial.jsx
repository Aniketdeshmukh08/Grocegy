import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";

const AddTestimonial = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [authorImage, setAuthorImage] = useState(null);

  const initialValues = { name: "", designation: "", message: "", rating: "" };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "*Name is required";
    if (!values.designation) errors.designation = "*Designation is required";
    if (!values.message) errors.message = "*Message is required";
    if (!values.rating) errors.rating = "*Rating is required";
    else if (values.rating < 1) errors.rating = "*Minimum rating is 1";
    else if (values.rating > 5) errors.rating = "*Maximum rating is 5";
    return errors;
  };

  const handleSubmit = (values) => {
    setFormValues(values);
    setModalShow(true);
  };

  const confirmSubmit = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("author_name", formValues.name);
    formData.append("author_designation", formValues.designation);
    formData.append("testimonial_text", formValues.message);
    formData.append("rating", formValues.rating);
    if (authorImage) formData.append("author_image", authorImage);

    await axiosInstance.post(`testimonials/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Testimonial added successfully!");
    navigate("/testimonials");
  } catch (err) {
    console.error("Add testimonial error:", err.response || err);
    toast.error(err.response?.data?.message || "Failed to add testimonial");
  } finally {
    setLoading(false);
    setModalShow(false);
  }
};

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Add New Testimonial</h4>
          </div>
          <div className="card-body p-4">
            <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
              {({ errors }) => (
                <Form>
                  {/* Name */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">Name:</label>
                    <div className="col-md-6">
                      <Field type="text" name="name" className="form-control" />
                      {errors.name && <div className="text-danger small">{errors.name}</div>}
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">Designation:</label>
                    <div className="col-md-6">
                      <Field type="text" name="designation" className="form-control" />
                      {errors.designation && <div className="text-danger small">{errors.designation}</div>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">Message:</label>
                    <div className="col-md-6">
                      <Field as="textarea" name="message" rows="3" className="form-control" />
                      {errors.message && <div className="text-danger small">{errors.message}</div>}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">Rating:</label>
                    <div className="col-md-6">
                      <Field type="number" name="rating" className="form-control" />
                      {errors.rating && <div className="text-danger small">{errors.rating}</div>}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="row mb-4 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">Author Image:</label>
                    <div className="col-md-6">
                      <input type="file" accept="image/*" className="form-control" onChange={(e) => setAuthorImage(e.target.files[0])} />
                    </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-success me-3" disabled={loading}>
                      {loading ? <> <Spinner as="span" animation="border" size="sm" /> Adding...</> : "Add Testimonial"}
                    </button>
                    <Link to="/testimonials" className="btn btn-outline-danger">Cancel</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage="Are you sure you want to add this testimonial?"
        onHide={() => setModalShow(false)}
        confirmation={confirmSubmit}
        operationType="Add"
        wantToAddData={true}
      />
    </>
  );
};

export default AddTestimonial;
