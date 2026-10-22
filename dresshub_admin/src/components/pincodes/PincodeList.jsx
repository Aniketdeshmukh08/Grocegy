import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import SearchBox from '../shared/SearchBox';

const PincodeList = () => {
    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pincodeToDelete, setPincodeToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // Fetch all pincodes
    const fetchAllPincodes = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}pincodes/all`,
                {
                    headers: {
                        'x-access-token': localStorage.getItem('jwttoken')
                    }
                }
            );
            setData(res.data);
        } catch (err) {
            console.log(err);
            setError('Something went wrong while fetching pincodes.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPincodes();
    }, []);

    // Handle Enable/Disable Toggle
    const handleEnableDisable = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            const url = `${process.env.REACT_APP_API_URL}pincodes/updatestatus/${id}`;
            await axios.put(url, {
                stat: newStatus,
            }, {
                headers: {
                    'x-access-token': localStorage.getItem('jwttoken')
                }
            });
            toast.success(`Pincode ${newStatus === 1 ? 'Enabled' : 'Disabled'} successfully!`);
            await fetchAllPincodes();
        } catch (err) {
            console.error('Error updating pincode status:', err);
            toast.error('Error updating pincode status!');
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}pincodes/remove/${id}`;
            await axios.delete(
                url,
                {
                    headers: {
                        'x-access-token': localStorage.getItem('jwttoken')
                    }
                }
            );
            toast.success('Pincode deleted successfully!');
            setData(prev => prev.filter(pincode => pincode.pincode_id !== id));
            setIsDeleteModalOpen(false);
            setPincodeToDelete(null);
        } catch (err) {
            console.log(err);
            toast.error('Error deleting pincode!');
        }
    };

    // Search Logic (Frontend filtering)
    const handleSearchTextSubmission = React.useCallback((value) => {
        setSearchText(value);
        setPage(1);
    }, []);

    const filteredData = data.filter(p =>
        p.pincode.toLowerCase().includes(searchText.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(searchText.toLowerCase())) ||
        (p.state && p.state.toLowerCase().includes(searchText.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / limit) || 1;
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);


    return (
        <>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center mb-3">
                        <h2 className="text-success fw-bold m-0 me-4">Pincode Details</h2>
                        <SearchBox
                            placeholder='Search Pincode or City...'
                            onSearch={handleSearchTextSubmission}
                            delay={300}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/pincodes/add" className="btn btn-success">
                            ➕ Add New Pincode
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className='table table-bordered table-hover align-middle'>
                        <thead className="table-success text-center">
                            <tr>
                                <th scope="col">Sr No.</th>
                                <th scope="col">Pincode</th>
                                <th scope="col">City</th>
                                <th scope="col">State</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-3">
                                        <Spinner animation="border" variant="success" />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-danger fw-bold py-4">
                                        {error}
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No pincodes found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, i) => (
                                    <tr key={item.pincode_id} className="text-center">
                                        <td>{(page - 1) * limit + i + 1}</td>
                                        <td className="fw-semibold text-success">{item.pincode}</td>
                                        <td>{item.city} {item.area_name ? `(${item.area_name})` : ''}</td>
                                        <td>{item.state}</td>
                                        <td>
                                            <span className={`badge ${item.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                {item.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <Link
                                                to={`/pincodes/edit/${item.pincode_id}`}
                                                className='btn btn-outline-success btn-sm me-2'
                                            >
                                                ✏️ Edit
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    setIsDeleteModalOpen(true);
                                                    setPincodeToDelete(item.pincode_id);
                                                }}
                                                className='btn btn-outline-danger btn-sm me-2'
                                            >
                                                🗑️ Delete
                                            </button>

                                            <button
                                                className='btn btn-sm btn-outline-primary'
                                                onClick={() => handleEnableDisable(item.pincode_id, item.is_active)}
                                            >
                                                {item.is_active === 1 ? 'Disable' : 'Enable'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
                    {/* Prev Button */}
                    <button
                        className="btn btn-success btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                        ⬅ Prev
                    </button>

                    {/* Page Selector */}
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

                    {/* Next Button */}
                    <button
                        className="btn btn-success btn-sm"
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        Next ➡
                    </button>
                </div>
            </div>

            <ConfirmationModal
                show={isDeleteModalOpen}
                modalMessage="Are you sure you want to delete this pincode?"
                onHide={() => setIsDeleteModalOpen(false)}
                confirmation={() => handleDelete(pincodeToDelete)}
                operationType="Delete"
                wantToAddData={true}
            />
        </>
    );
};

export default PincodeList;
