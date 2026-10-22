import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import SearchBox from '../shared/SearchBox';
import useFetch from "../../hooks/useFetch";

const Settingslist = () => {
  //const [settings, setSettings] = useState([]);
  const [limit] = useState(10);
  // const [loading, setLoading] = useState(true);
  //const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false);
  //const [originalSettings, setOriginalSettings] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const url = `settings/allsettings?page=${page}&limit=${limit}&search=${search}`;
  const { data, loading, error, refetch } = useFetch(url, {
    enabled: true,
    retries: 2,
  });

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}settings/allsettings`,
          {
            headers: {
              'x-access-token': token
            }
          }
        );
        setSettings(response.data);
        setOriginalSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Something went wrong while fetching settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);*/

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };


  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (deleteId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}settings/removesetting/${deleteId}`,
          {},
          {
            headers: {
              'x-access-token': token
            }
          }
        );
        //setSettings((prevSettings) => prevSettings.filter((item) => item.setting_id !== deleteId));
        refetch();
        toast.success('Setting Deleted Successfully');
      }
      closeModal();
    } catch (err) {
      console.error('Error deleting setting:', err);
      toast.error('Failed to delete setting');
    }
  };

  const handleSearch = useCallback((value) => {
    setPage(1);
    setSearch(value);
  }, []);

  const settings = Array.isArray(data) ? data : data?.data || [];
const totalPages = data?.totalPages || 1;

const displaySettings = isSortedAlphabetically
  ? [...settings].sort((a, b) =>
      a.setting_name.localeCompare(b.setting_name)
    )
  : settings;


  return (
    <>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Settings List</h2>

          {/* Search */}
          <SearchBox
            placeholder="Search Settings..."
            onSearch={handleSearch}
            delay={500}
            className="mb-3"
          />
          <div className='d-flex gap-2'>
            <Link to="/settingCreate" className="btn btn-success">
              ➕ Add New Setting
            </Link>
            <button
              onClick={() => {
                setIsSortedAlphabetically(!isSortedAlphabetically);

              }}
              className='btn btn-success'>
              {isSortedAlphabetically ? 'Remove Sort' : 'Sort by Name'}
            </button>
          </div>
        </div>


        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>SR NO</th>
                <th>Setting ID</th>
                <th>Setting Name</th>
                <th>Setting Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    <Spinner animation="border" variant="success" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-danger py-4 fw-semibold">
                    {error}
                  </td>
                </tr>
              ) : displaySettings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No settings found.
                  </td>

                </tr>
              ) : (
                displaySettings.map((setting, index) => (
                  <tr key={setting.setting_id} className="text-center">
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{setting.setting_id}</td>
                    <td className="fw-semibold text-success">{setting.setting_name}</td>
                    <td>{setting.setting_value}</td>
                    <td>
                      <Link
                        to={`/settingUpdate/${setting.setting_id}`}
                        className="btn btn-outline-success btn-sm me-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => openModal(setting.setting_id)}
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

        <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">

          <button
            className="btn btn-success btn-sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ⬅ Prev
          </button>

          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">Page</span>
            <select
              className="form-select form-select-sm w-auto"
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="fw-semibold">of {totalPages}</span>
          </div>

          <button
            className="btn btn-success btn-sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next ➡
          </button>

        </div>

      </div>

      <ConfirmationModal
        show={showModal}
        modalMessage="Do you really want to remove this setting?"
        onHide={closeModal}
        confirmation={handleDelete}
        operationType="Delete"
        wantToAddData={true}
      />
    </>
  );
};

export default Settingslist;
