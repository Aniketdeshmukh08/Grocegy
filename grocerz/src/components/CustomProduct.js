import React, { useState } from 'react';
import axios from 'axios';

const CustomProduct = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_desc: '',
    quantity: '',
  });
  const [messages, setMessages] = useState({
    success: '',
    error: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const { product_name, product_desc, quantity } = formData;
    if (!product_name || !product_desc || !quantity) {
      setMessages({ success: '', error: 'All fields are required.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        requestid: 'req_' + Math.random().toString(36).substr(2, 6),
        userid: 'user123',
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}customProduct/add`,
        requestData
      );

      setMessages({
        success: 'Product request submitted successfully!',
        error: '',
      });
      setFormData({ product_name: '', product_desc: '', quantity: '' });
    } catch (error) {
      setMessages({
        success: '',
        error: 'Failed to submit the request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Request Product</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.cell}>
                <label style={styles.label}>Name of Product</label>
                <FormField
                  id='product_name'
                  type='text'
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </td>
              <td style={styles.cell}>
                <label style={styles.label}>Description</label>
                <FormField
                  id='product_desc'
                  type='text'
                  value={formData.product_desc}
                  onChange={handleChange}
                  required
                />
              </td>
              <td style={styles.cell}>
                <label style={styles.label}>Quantity</label>
                <FormField
                  id='quantity'
                  type='number'
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan='3' style={styles.submitCell}>
                <button
                  type='submit'
                  disabled={loading}
                  style={styles.submitButton}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {messages.success && (
        <p style={styles.successMessage}>{messages.success}</p>
      )}
      {messages.error && <p style={styles.errorMessage}>{messages.error}</p>}
    </div>
  );
};

const FormField = ({ id, type, value, onChange, required }) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    style={styles.input}
  />
);

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    color: '#333',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  cell: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    verticalAlign: 'top',
  },
  submitCell: {
    padding: '10px',
    textAlign: 'center',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
    color: '#333',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  successMessage: {
    marginTop: '20px',
    color: 'green',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: '20px',
    color: 'red',
    textAlign: 'center',
  },
};

export default CustomProduct;
