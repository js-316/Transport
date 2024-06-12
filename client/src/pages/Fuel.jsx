import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
  useGetFuelQuery,
  useImportFuelMutation,
  useDeleteFuelMutation,
} from "../features/fuel/fuelApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

const Fuel = () => {

  const user = useSelector(selectUser);

  

  const [importError, setImportError] = useState(null);
  const [AppError, setAppError] = useState(null);
  const { isLoading, data, refetch } = useGetFuelQuery();
  const [importFuel, { isLoading: isImporting }] = useImportFuelMutation();
  const { ids, entities } = data || {};
  const fuelArray = ids?.map((id) => entities[id]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNumberPlate, setSelectedNumberPlate] = useState('All');
  const uploadRef = useRef(null);

  const handleFileUpload = async (e) => {
    setImportError(null);
    const file = e.target.files[0];
    if (file.type !== "text/csv") {
      toast.error("Please upload a csv file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await importFuel(formData).unwrap();
      if (result) {
        toast.success("Fuel records imported successfully");
      }
    } catch (error) {
      if (parseInt(error.status) !== error.status) {
        setImportError("Something went wrong, please try again");
      } else {
        const parsedError = errorParser(error?.data);
        setImportError(error?.data?.message || parsedError);
        toast.error(importError, {
          style: {
            minWidth: "300px",
            height: "auto",
          },
        });
      }
    }
  };

  const [deleteFuel, { isLoading: isDeleting }] = useDeleteFuelMutation();
  const handleDeleteFuel = async (id) => {
    setAppError(null);
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this",
        icon: "warning",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        confirmButtonText: "Yes I'm sure",
      });
      if (result.isConfirmed) {
        const res = await deleteFuel(id).unwrap();
        refetch();
      }
    } catch (err) {
      console.error("Error deleting Fuel:", err);
      if (parseInt(err.status) !== err.status) {
        setAppError("Network Error");
      } else {
        const parsedError = errorParser(err?.data);
        setAppError(err?.data?.message || parsedError);
      }
    }
  };

  const filteredData = fuelArray?.filter((fuel) => {
    const fuel_type = fuel.fuel_type.toLowerCase();
    const fuel_plate = fuel.fuel_plate.number_plate.toLowerCase();
    const mileage = fuel.mileage;
    const amount = fuel.amount;
    const date_of_fueling = fuel.date_of_fueling.toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearchQuery =
      fuel_type.includes(search) ||
      fuel_plate.includes(search) ||
      (mileage && mileage.toString().includes(search)) ||
      (amount && amount.toString().includes(search)) ||
      date_of_fueling.includes(search);

    const matchesNumberPlate =
      selectedNumberPlate === 'All' || fuel.fuel_plate.number_plate === selectedNumberPlate;

    return matchesSearchQuery && matchesNumberPlate;
  });

  const uniqueNumberPlates = [
    'All',
    ...new Set(fuelArray?.map((fuel) => fuel.fuel_plate.number_plate)),
  ];

  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(indexOfFirstData, indexOfFirstData + dataPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleDataPerPage = (e) => setDataPerPage(parseInt(e.target.value));

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Fuel Records", 10, 10);
    const tableData = [];
    filteredData.forEach((record) => {
      tableData.push([
        record.fuel_type,
        record.fuel_plate.number_plate,
        record.mileage,
        record.amount,
        record.date_of_fueling,
      ]);
    });
    doc.autoTable({
      head: [["Fuel Type", "Number Plate", "Mileage", "Amount", "Date of Fueling"]],
      body: tableData,
    });
    doc.save("fuel_records.pdf");
  };

  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Fuel History</h2>
        <div className="flex">
          <Link
            onClick={() => uploadRef.current.click()}
            to="#"
            className={
              isImporting
                ? "btn btn-light rounded mx-2 disabled"
                : "btn btn-light rounded mx-2"
            }
          >
            <i className="material-icons md-import_export" ></i>
            Import
          </Link>
          <Link to="add" className="btn btn-primary">
            <i className="material-icons md-plus"></i> Add Fuel
          </Link>
          <input
            type="file"
            accept=".csv"
            ref={uploadRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button onClick={exportToPDF} className="btn btn-success mx-2">
            Export to PDF
          </button>
        </div>
      </div>
      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6">
              <select
                onChange={handleDataPerPage}
                value={dataPerPage}
                className="form-select"
              >
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
                <option value="30">Show 30</option>
                <option value="40">Show 40</option>
              </select>
            </div>
            <div className="col-lg-2 col-md-3 col-6">
              <select
                onChange={(e) => setSelectedNumberPlate(e.target.value)}
                value={selectedNumberPlate}
                className="form-select"
              >
                {uniqueNumberPlates.map((plate) => (
                  <option key={plate} value={plate}>
                    {plate}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Fuel Type</th>
                <th>Number Plate</th>
                <th>Date</th>
                <th>Mileage</th>
                <th>Amount</th>
                <th>Usage</th>
                <th>Volume Unit</th>
                <th>Fuel Capacity Alert</th>
                <th className="text-end"> Action </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <TableLoader key={i} count={6} />)
                : currentData?.map((d, index) => (
                    <tr key={index}>
                      <td>{d.fuel_type}</td>
                      <td>{d.fuel_plate.number_plate}</td>
                      <td>{new Date(d.date_of_fueling).toDateString()}</td>
                      <td>{d.mileage}</td>
                      <td>{d.amount}</td>
                      <td>Usage</td>
                      <td>Volume Unit</td>
                      <td>Costs Per Meter</td>
                      <td>Fuel Capacity Alert</td>
                      <td className="text-end">
                        <Link
                          to={`edit/${d.id}`}
                          className="btn btn-sm font-sm rounded btn-brand mx-4"
                        >
                          <i className="material-icons md-edit"></i>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteFuel(d.id)}
                          className="btn btn-sm font-sm rounded btn-danger"
                        >
                          <i className="material-icons md-delete"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination-area mt-30 mb-50">
        <nav aria-label="Page navigation example">
          <Pagination
            totalData={filteredData?.length}
            dataPerPage={dataPerPage}
            paginate={paginate}
            currentPage={currentPage}
          />
        </nav>
      </div>
    </Layout>
  );
};

export default Fuel;
