// src/pages/testimonials/EditTestimonial.jsx
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import {  toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import "react-toastify/dist/ReactToastify.css";

const API_URL = (process.env.REACT_APP_API_URL.replace(/\/$/, "") + "/testimonials");

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    name: "",
    designation: "",
    message: "",
    rating: "",
  });
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formValuesChanged, setFormValuesChanged] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({});
  const [authorImage, setAuthorImage] = useState(null);

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

  useEffect(() => {
    const fetchTestimonial = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/${id}`, {
  headers: { "x-access-token": localStorage.getItem("jwttoken") },
});
        const data = res.data;
        setInitialValues({
          name: data.author_name || "",
          designation: data.author_designation || "",
          message: data.testimonial_text || "",
          rating: data.rating || "",
        });
      } catch (err) {
        console.error("Error fetching testimonial:", err.response || err);
        toast.error("Failed to fetch testimonial data");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonial();
  }, [id]);

  const handleSubmit = (values) => {
    const isUnchanged = Object.keys(initialValues).every(
      (key) => initialValues[key] === values[key]
    );

    if (isUnchanged && !authorImage) {
      setModalMessage("No changes were made. Nothing to update.");
      setFormValuesChanged(false);
    } else {
      setModalMessage("Do you really want to update this testimonial?");
      setFormValuesChanged(true);
      setUpdatedValues({
        author_name: values.name,
        author_designation: values.designation,
        testimonial_text: values.message,
        rating: values.rating,
      });
    }
    setModalShow(true);
  };

  const confirmUpdate = async () => {
  if (!formValuesChanged && !authorImage) {
    toast.info("No changes to update");
    setModalShow(false);
    return;
  }

  try {
    const formData = new FormData();

    formData.append("author_name", updatedValues.author_name || initialValues.name);
    formData.append("author_designation", updatedValues.author_designation || initialValues.designation);
    formData.append("testimonial_text", updatedValues.testimonial_text || initialValues.message);
    formData.append("rating", updatedValues.rating || initialValues.rating);

    if (authorImage) formData.append("author_image", authorImage);

    await axios.put(`${API_URL}/${id}`, formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": localStorage.getItem("jwttoken"),
      },
    });

    toast.success("Testimonial updated successfully!");
    navigate("/testimonials");
  } catch (err) {
    console.error("Error updating testimonial:", err.response || err);
    toast.error(err.response?.data?.message || "Failed to update testimonial");
  } finally {
    setModalShow(false);
  }
};


  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-success">Loading...</p>
      </div>
    );
  }

  return (
    <>
      
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Edit Testimonial</h4>
          </div>
          <div className="card-body p-4">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validate={validate}
              onSubmit={handleSubmit}
            >
              {({ errors }) => (
                <Form>
                  {/* Name */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Name:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter author name"
                        required
                      />
                      {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Designation:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="text"
                        name="designation"
                        className="form-control"
                        placeholder="Enter designation"
                        required
                      />
                      {errors.designation && <div className="text-danger small mt-1">{errors.designation}</div>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Message:
                    </label>
                    <div className="col-md-6">
                      <Field
                        as="textarea"
                        name="message"
                        className="form-control"
                        rows="3"
                        placeholder="Enter testimonial message"
                        required
                      />
                      {errors.message && <div className="text-danger small mt-1">{errors.message}</div>}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Rating:
                    </label>
                    <div className="col-md-6">
                      <Field
                        type="number"
                        name="rating"
                        className="form-control"
                        placeholder="Enter rating (1-5)"
                        required
                      />
                      {errors.rating && <div className="text-danger small mt-1">{errors.rating}</div>}
                    </div>
                  </div>

                  {/* Author Image */}
                  <div className="row mb-4 align-items-center">
                    <label className="col-md-4 col-form-label text-end fw-semibold text-success">
                      Author Image:
                    </label>
                    <div className="col-md-6">
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setAuthorImage(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-success px-4 me-3">
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger px-4"
                      onClick={() => navigate("/testimonials")}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={modalShow}
        modalMessage={modalMessage}
        onHide={() => setModalShow(false)}
        confirmation={confirmUpdate}
        operationType="Update"
        wantToAddData={formValuesChanged}
      />
    </>
  );
};

export default EditTestimonial;
