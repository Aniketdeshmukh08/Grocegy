import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ConfirmationModal } from "../shared/ConfirmationModal";


export default function CustomOrderDetails() {
  const { id } = useParams();
  const order_id = Number(id);

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const location = useLocation();

  const isView = location.pathname.includes("/view/");
  const isEdit = location.pathname.includes("/edit/");
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}customorder/get-custom-order/${order_id}`
      );
      setOrder(res.data.orderDetails);
      setItems(res.data.itemDetails);
    } catch (err) {
      toast.error('Failed to load order details');
    }
  };

  useEffect(() => {
    if (order_id) fetchOrderDetails();
  }, [order_id]);

  const handleAddItem = async () => {
    if (!itemName || !price || !quantity || !finalPrice) {
      toast.error('All fields required');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}customorder/add-item-custom-order-details`,
        {
          order_id,
          item_name: itemName,
          price: Number(price),
          quantity: Number(quantity),
          final_price: Number(finalPrice),
        }
      );

      toast.success('Item added');
      setItemName('');
      setPrice('');
      setFinalPrice('');
      setQuantity('');
      fetchOrderDetails();
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  const handleGeneratePDF = () => {
    if (items.length === 0) {
      toast.error("No items to generate invoice");
      return;
    }

    const doc = new jsPDF();


    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("GROCJI", 105, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "www.grocji.com | 8757499345, 8757499344",
      105,
      26,
      { align: "center" }
    );


    doc.setFontSize(11);
    doc.text(`Order No: ${order?.order_id || "-"}`, 14, 40);

    const formatDate = order?.order_date
      ? new Date(order.order_date).toLocaleDateString("en-IN") : "-";
    doc.text(`Date: ${formatDate}`, 130, 40);

    doc.text(`Customer Name: ${order?.name || "-"}`, 14, 52);
    doc.text(`Address: ${order?.address || "-"}`, 14, 64);


    const tableColumn = [
      "S No",
      "Item Name",
      "Rate",
      "Quantity",
      "Final Price",
    ];

    const tableRows = items.map((item, index) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const total = price * qty;
      return [
        index + 1,
        item.item_name,
        `Rs. ${price}`,
        qty,
        `Rs. ${total}`,
      ];
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const totalDiscount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const finalPrice = item.final_price != null ? Number(item.final_price) : price;
      return sum + (price - finalPrice) * item.quantity;
    }, 0);

    const payableAmount = Math.max(totalAmount - totalDiscount, 0);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 72,
      theme: "grid",
      styles: {
        fontSize: 10,
        halign: "center",
        valign: "middle",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    const finalY = doc.lastAutoTable.finalY + 14;


    doc.setFontSize(11);
    doc.text("Total  –", 14, finalY);
    doc.text(`Rs. ${totalAmount}`, 160, finalY);

    doc.text("Final Discount  –", 14, finalY + 10);
    doc.text(`Rs. ${totalDiscount}`, 160, finalY + 10);

    doc.text("Payable Amount  –", 14, finalY + 20);
    doc.text(`Rs. ${payableAmount}`, 160, finalY + 20);

    doc.text("Signature", 14, finalY + 45);
    doc.line(14, finalY + 47, 70, finalY + 47);


    doc.save(`GROCJI_Order_${order_id}.pdf`);
  };

  const handleDeleteClick = (order_details_id) => {
    setDeleteId(order_details_id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}customorder/remove-item/${deleteId}`
      );
      toast.success("Item removed");
      setShowModal(false);
      fetchOrderDetails();
    } catch (error) {
      toast.error("Failed to delete item");
      setShowModal(false);
    }
  };

  return (
    <div className='container'>
      <div className='card'>
        <div className='card-header bg-success text-white'>
          Custom Order Details – #{order_id}
        </div>

        <div className='card-body'>
          <div className='row mb-3'>
            <div className='col'>
              <input
                className='form-control'
                placeholder='Item Name'
                disabled={isView}
                value={itemName}
                onChange={e => setItemName(e.target.value)}
              />
            </div>
            <div className='col'>
              <input
                type='number'
                className='form-control'
                disabled={isView}
                placeholder='Price'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className='col'>
              <input
                type='number'
                className='form-control'
                disabled={isView}
                placeholder='Final Price'
                value={finalPrice}
                onChange={e => setFinalPrice(e.target.value)}
              />
            </div>
            <div className='col'>
              <input
                type='number'
                className='form-control'
                disabled={isView}
                placeholder='Qty'
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
            <div className='col'>
              <button
                className='btn btn-primary'
                onClick={handleAddItem}
                disabled={isView}
              >
                Add Item
              </button>
            </div>
          </div>

          <table className='table table-bordered'>
            <thead className='table-light'>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Final Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan='6' className='text-center'>
                    No items added
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.order_details_id}>
                    <td>{item.item_name}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.final_price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.final_price * item.quantity}</td>
                    <td>
                      <button
                        className='btn btn-danger btn-sm'
                        disabled={isView}
                        onClick={() => handleDeleteClick(item.order_details_id)}
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h5 className='text-end'>
            Total Amount: ₹{order?.paymentamount || 0}
          </h5>
          <button
            className="btn btn-success mt-3"
            onClick={handleGeneratePDF}
          >
            Download Invoice PDF
          </button>
          &nbsp;&nbsp;
          <Link to='/custom-orders' className='btn btn-secondary mt-3'>
            Back to Order List
          </Link>
        </div>
      </div>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmation={confirmDelete}
        operationType="Delete"
        modalMessage="Are you sure you want to remove this item from the order?"
        wantToAddData={true}
      />
    </div>
  );
}
