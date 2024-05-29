import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate} from "react-router-dom";
import {
  useGetDriversQuery,
  useDeleteDriverMutation, useImportDriversMutation
} from "../features/driver/driverApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



const Drivers = () => {
  const [importError, setImportError] = useState(null);
  const { isLoading, data ,refetch} = useGetDriversQuery();
  const [importDrivers, { isLoading: isImporting }] =
    useImportDriversMutation();
  const navigate = useNavigate();
  const [AppError, setAppError] = useState(null);
  const { ids, entities } = data || {};
  const driversArray = ids?.map((id) => entities[id]);
  

  const [searchQuery, setSearchQuery] = useState('');

  // New hook deleteDriver to handle deleting drivers
  const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

  const handleDeleteDriver = async (id) => {
    setAppError(null);
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      if (result.isConfirmed) {
        console.log("Deleting driver with ID:", id);
        const res = await deleteDriver( id ).unwrap();
    
        refetch();
        
      }
    } catch (err) {
      console.error("Error deleting driver:", err);
      if (parseInt(err.status) !== err.status) {
        setAppError("Network Error");
      } else {
        const parsedError = errorParser(err?.data);
        setAppError(err?.data?.message || parsedError);
      }
    }
  };
  
  const filteredData = driversArray?.filter((driver) => {
    const name = driver.name.toLowerCase();
    const phoneNumber = driver.phone_number.toLowerCase();
    const search = searchQuery.toLowerCase();
  
    return name.includes(search) || phoneNumber.includes(search);
  });

  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDataPerPage = (e) => {
    setDataPerPage(parseInt(e.target.value));
  };
  
  const uploadRef = useRef(null);
  // listen to click on uploadRef and the open file upload for only csv files
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
      const result = await importDrivers(formData).unwrap();
      if (result) {
        toast.success("Driver imported successfully");
      }
    } catch (error) {
      if (parseInt(error.status) !== error.status) {
        setImportError("Something went wrong, please try again");
      } else {
        const parsedError = errorParser(error?.data);
        setImportError(error?.data?.message || parsedError);
        toast.error(importError, {
          style: {
            // handle error message overflow
            minWidth: "300px",
            height: "auto",
          },
        });
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Drivers", 10, 10);
    const tableData = [];
    filteredData.forEach((record) => {
      tableData.push([
        record.name,
        record.phone_number,
        record.age,
        record.date_hired,
      ]);
    });
    doc.autoTable({
      head: [["Name", "Phone Number", "Age", "Date Hired"]],
      body: tableData,
    });
    doc.save("drivers.pdf");
  };


  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Contacts</h2>
        <div>
        <Link
            // while uploading a file, disable the import button
            onClick={() => uploadRef.current.click()}
            to="#"
            className={
              isImporting
                ? "btn btn-light rounded mx-2 disabled"
                : "btn btn-light rounded mx-2"
            }
          >
            <i className="material-icons md-import_export"></i>
            Import
          </Link>
          <Link to="add" className="btn btn-primary">
            <i className="material-icons md-plus"></i> Add Contact
          </Link>
          <input
            type="file"
            accept=".csv"
            ref={uploadRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button onClick={exportToPDF} className="btn btn-success mx-2 rounded-full">
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
          </div>
        </header>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>User Status</th>
                <th>User Role</th>
                <th> Assigned Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <TableLoader key={i} count={5} />)
                : currentData?.map((d, index) => (
                  <tr key={index}>
                    <td>{d.name}</td>
                    <td>{d.phone_number}</td>
                    <td>{d.age}</td>
                    <td>{new Date(d.date_hired).toDateString()}</td>
                    
                    
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

export default Drivers;
