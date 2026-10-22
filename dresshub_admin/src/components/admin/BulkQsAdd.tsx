import React, { FC, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as xlsx from 'xlsx';

const sampleSheetUrl = '/Sample_ProductList.xlsx';

const downloadSampleSheet = () => {
  const link =  document.createElement("a");
  link.href = sampleSheetUrl;
  link.download = "Sample_ProductList.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Sample sheet downloaded successfully!", notifydata);
};

const notifydata: any = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};
const notify = () => toast.success('Product Added Successfully!', notifydata);

const notifyremove = () =>
  toast.success('Product Removed from Incoming list!', notifydata);

const BulkProductAdd: FC = () => {
  const [loader, setLoader] = useState(false);
  const [uploadedproducts, setuploadedproducts] = useState([] as any);
  const [excelData, setExcelData] = useState([] as any);
  const [excelFilterData, setExcelFilterData] = useState([] as any);

  const callApiQsAdd = async (values: any) => {
    const url = process.env.REACT_APP_API_URL + 'products/addProduct';

    values.prod_desc = values.prod_desc || "No description available";

    try {
      console.log("Sending Data:", values);
      await axios.post(url, values);
      setLoader(false);
      setuploadedproducts([...uploadedproducts, values.products]);
      notify();
      setExcelFilterData((prevData: any) =>
        prevData.filter((item: any) => item.prod_name !== values.prod_name)
      );
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };


  const readExcel = async (e: any) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer(file);
    const excelfile = xlsx.read(data);
    const excelsheet = excelfile.Sheets[excelfile.SheetNames[0]];
    const exceljson = xlsx.utils.sheet_to_json(excelsheet);
    setExcelData(exceljson);
  };

  useEffect(() => {
    setExcelFilterData(excelData);
  }, [excelData]);

  const removeproducts = async (values: any) => {
    let temp = [...uploadedproducts, values.products];
    setuploadedproducts(temp);
    notifyremove();
    setExcelFilterData((prevData: any) =>
      prevData.filter((item: any) => item.prod_name !== values.prod_name)
    );
  };

  const generateproductid = () => {
    return Math.floor(Math.random() * 10000000000);
  };

  const uploadAllProducts = async () => {
    for (let i = 0; i < excelFilterData.length; i++) {
      const product = excelFilterData[i];

      await callApiQsAdd({
        productid: generateproductid(),
        prod_name: product.prod_name,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        stock_quantity: product.stock_quantity,
        brand: product.brand,
        discount: product.discount,
        prod_desc: product.prod_desc || "No description provided",
      });
    }
  };


  return (
    <React.Fragment>
      <Container className='content'>
        <div className='row fthight'>
          <div className="col-md-12">
            <h3 className="mt-3">Import Products</h3>

            <label className="form-label">File</label>

            <div className="d-flex align-items-center gap-2">
              <input
                type="file"
                className="form-control"
                style={{flex:"1"}}
                onChange={e => readExcel(e)}
              />
              <button onClick={downloadSampleSheet} className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                Download Product List
              </button>
              {excelFilterData.length > 0 && (
              <button
                onClick={uploadAllProducts}
                className='btn btn-primary ms-5'
              >
                Upload All Products
              </button>
            )}
            </div>
          </div>


          <div className='col-md-12 mt-3'>
            {excelFilterData.length > 0 && (
              <table className='table'>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Brand</th>
                    <th>Discount</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {excelFilterData.map((getdata: any, index: any) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{getdata.prod_name} </td>
                      <td>{getdata.category} </td>
                      <td>{getdata.subcategory} </td>
                      <td>{getdata.price} </td>
                      <td>{getdata.stock_quantity} </td>
                      <td>{getdata.brand} </td>
                      <td>{getdata.discount}</td>
                      <td>{getdata.prod_desc}</td>
                      <td>
                        <button
                          onClick={() =>
                            callApiQsAdd({
                              productid: generateproductid(),
                              prod_name: getdata.prod_name,
                              category: getdata.category,
                              subcategory: getdata.subcategory,
                              price: getdata.price,
                              stock_quantity: getdata.stock_quantity,
                              brand: getdata.brand,
                              discount: getdata.discount,
                              prod_desc: getdata.prod_desc,
                            })
                          }
                          type='button'
                          className='btn btn-success'
                        >
                          Add
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() =>
                            removeproducts({
                              productid: generateproductid(),
                              prod_name: getdata.prod_name,
                            })
                          }
                          type='button'
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default BulkProductAdd;
