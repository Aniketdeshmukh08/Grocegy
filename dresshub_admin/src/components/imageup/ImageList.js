import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    if (!apiUrl) {
      toast.error('API URL is not defined in environment variables.');
      setLoading(false);
      setErrorMsg('API URL is not defined.');
      return;
    }
    fetchImages();
  }, []);

  const showError = (msg, fallback = 'Something went wrong.') => {
    toast.error(msg || fallback);
  };

  const fetchImages = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(`${apiUrl}images`);
      if (Array.isArray(response.data)) {
        setImages(response.data);
      } else {
        showError('Invalid data received from server.');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showError('Failed to fetch images. Please try again.');
      setErrorMsg('Failed to fetch images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!apiUrl) return showError('API URL is missing. Cannot upload.');
    if (!file) return toast.warning('Please select a file to upload.');

    const selectedName = file.name.toLowerCase();
    const alreadyExists = images.some(img => img.toLowerCase().includes(selectedName));

    if (alreadyExists) {
      return toast.warning('This file name already exists. Choose another.');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post(`${apiUrl}images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Image uploaded successfully');
      fetchImages();
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      showError(error?.response?.data?.message, 'Upload failed.');
    }
  };

  const handleRemove = async (filename) => {
    if (!apiUrl) return showError('API URL is missing. Cannot delete.');
    try {
      await axios.delete(`${apiUrl}images/${encodeURIComponent(filename)}`);
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      if (error.response?.status === 404) {
        toast.warn('Image not found on server');
      } else {
        console.error('Error removing image:', error);
        showError('Error removing image. Please try again.');
      }
    }
  };

  const getSortedImages = () => {
    const placeholders = images.filter(
      img => img.startsWith('icon-') || img.includes('placeholder')
    );

    const priorityImages = images.filter(
      img => img.includes('image-1721029476689') || img.includes('image-1721031406193')
    );

    const others = images.filter(
      img => !placeholders.includes(img) && !priorityImages.includes(img)
    );

    const result = [...placeholders, ...others];
    if (priorityImages[1]) {
      result.splice(1, 0, priorityImages[0]);
      result.splice(2, 0, priorityImages[1]);
    } else if (priorityImages[0]) {
      result.splice(1, 0, priorityImages[0]);
    }

    return result;
  };

  return (
    <>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <h2 className="fw-bold text-success mb-0" style={{ marginLeft: '10px' }}>
            Image List
          </h2>
          <div className="d-flex align-items-center">
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              className="form-control me-2"
              style={{ maxWidth: '300px' }}
            />
            <button className="btn btn-success" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body px-3 pt-3 pb-4">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-success text-center">
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        <Spinner animation="border" variant="success" />
                      </td>
                    </tr>
                  ) : errorMsg ? (
                    <tr>
                      <td colSpan="4" className="text-center text-danger py-4">
                        {errorMsg}
                      </td>
                    </tr>
                  ) : images.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No images found.
                      </td>
                    </tr>
                  ) : (
                    getSortedImages().map((image, index) => (
                      <tr
                        key={index}
                        className={`text-center ${
                          image.startsWith('icon-') || image.includes('placeholder')
                            ? 'table-warning'
                            : ''
                        }`}
                      >
                        <td>{index + 1}</td>
                        <td>{image}</td>
                        <td>
                          <img
                            src={`${apiUrl}uploads/${image}`}
                            alt={image}
                            width="150"
                            className="img-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              if (e.target.src !== window.location.origin + '/default-placeholder.png') {
                              e.target.src = '/default-placeholder.png';
                              }
                            }}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemove(image)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            🗑️ Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageList;

