import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';

export default function CustomOrderCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    date: '',
    time: '',
    paymentmode: '',
    remarks: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('jwttoken');
      const userid = Number(localStorage.getItem('userid'));

      if (!userid) {
        toast.error('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      if (!formData.date || !formData.time) {
        toast.error('Date and Time are required');
        setLoading(false);
        return;
      }

      const formattedTime =
        formData.time.length === 5 ? `${formData.time}:00` : formData.time;

      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        contact: formData.contact.trim(),
        userid,
        date: formData.date,
        time: formattedTime,
        paymentmode: formData.paymentmode || null,
        remarks: formData.remarks?.trim() || null,
      };

      console.log('Sending payload:', payload);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}customorder/create-custom-order`,
        payload,
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Custom order created successfully');
     navigate(`/custom-orders/edit/${response.data.order_id}`);

    } catch (error) {
      console.error('API ERROR:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || 'Failed to create custom order'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <div className='card shadow-sm border-0'>
        <div className='card-header bg-success text-white text-center'>
          <h4 className='mb-0'>Create Custom Order</h4>
        </div>

        <div className='card-body p-4'>
          <form onSubmit={handleSubmit}>
            <div className='row mb-3 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Customer Name:
              </label>
              <div className='col-md-6'>
                <input
                  type='text'
                  name='name'
                  className='form-control'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='row mb-3 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Contact:
              </label>
              <div className='col-md-6'>
                <input
                  type='text'
                  name='contact'
                  className='form-control'
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='row mb-3 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Address:
              </label>
              <div className='col-md-6'>
                <textarea
                  name='address'
                  className='form-control'
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='row mb-3 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Order Date:
              </label>
              <div className='col-md-6'>
                <input
                  type='date'
                  name='date'
                  className='form-control'
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='row mb-3 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Order Time:
              </label>
              <div className='col-md-6'>
                <input
                  type='time'
                  name='time'
                  className='form-control'
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='row mb-3 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Payment Mode:
              </label>
              <div className='col-md-6'>
                <select
                  name='paymentmode'
                  className='form-select'
                  value={formData.paymentmode}
                  onChange={handleChange}
                >
                  <option value=''>Select payment mode</option>
                  <option value='cash'>Cash</option>
                  <option value='online'>Online</option>
                </select>
              </div>
            </div>

            <div className='row mb-4 align-items-center'>
              <label className='col-md-4 col-form-label text-end fw-semibold text-success'>
                Remarks:
              </label>
              <div className='col-md-6'>
                <textarea
                  name='remarks'
                  className='form-control'
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='text-center'>
              <button
                type='submit'
                className='btn btn-success px-4 me-3'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' animation='border' /> Creating...
                  </>
                ) : (
                  'Create Order'
                )}
              </button>

              <Link to='/custom-orders' className='btn btn-outline-danger'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
