import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
  useGetVehichlesQuery,
  useImportVehichlesMutation,
  useDeleteVehichleMutation,
} from "../features/vehichle/vehicleApiSlice";
import { useGetMaintenanceQuery } from "../features/maintenance/maintenanceApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useGetFuelQuery } from "../features/fuel/fuelApiSlice";

const Vehichles = () => {
  const [importError, setImportError] = useState(null);

  const { isLoading, data, refetch } = useGetVehichlesQuery();
  const { ids, entities } = data || {};
  const vehichlesArray = ids?.map((id) => entities[id]);

  const [importVehichles, { isLoading: isImporting }] =
    useImportVehichlesMutation();

  const { data: maintenanceData } = useGetMaintenanceQuery()
  const { data: fuelData } = useGetFuelQuery()

  const navigate = useNavigate();
  const [AppError, setAppError] = useState(null);

  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uploadRef = useRef(null);

  const [deleteVehichle, { isLoading: isDeleting }] = useDeleteVehichleMutation();

  const handleDeleteVehichle = async (id) => {
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
        console.log("Deleting Vehichle with ID:", id);
        const res = await deleteVehichle(id).unwrap();

        refetch();

      }
    } catch (err) {
      console.error("Error deleting Vehichle:", err);
      if (parseInt(err.status) !== err.status) {
        setAppError("Network Error");
      } else {
        const parsedError = errorParser(err?.data);
        setAppError(err?.data?.message || parsedError);
      }
    }
  };

  const handleDateRange = (dateRange) => {
    if (dateRange) {
        setStartDate([dateRange(0)]);
        setEndDate([dateRange(1)]);
    } else {
        setStartDate(null);
        setEndDate(null);
    }
};

  const filteredData = vehichlesArray?.filter((vehichle) => {
    const number_plate = vehichle.number_plate.toLowerCase();
    const driver = vehichle.driver.name.toLowerCase();
    const mileage = vehichle.mileage
    const vehichle_type = vehichle.vehichle_type.toLowerCase()
    const manufacturer = vehichle.manufacturer.toLowerCase()
    const date = vehichle.date_of_purchase.toLowerCase()
    const search = searchQuery.toLowerCase();

    if (search) {
      return (
        (startDate === null || startDate <= date) &&
        (endDate === null || date <= endDate) &&
        ((number_plate.includes(search) ||
          driver.includes(search) ||
          (mileage && mileage.toString().includes(search)) || 
          vehichle_type.includes(search) ||
          (date && date.toString().includes(search)) ||
          manufacturer.includes(search)))
      );
    } else {
      return (
        (startDate === null || startDate <= date) &&
        (endDate === null || date <= endDate)
      );
    }

    
  });

  
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(indexOfFirstData, indexOfLastData);

  const handleDataPerPage = (e) => {
    setDataPerPage(parseInt(e.target.value));
  };


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
      const result = await importVehichles(formData).unwrap();
      if (result) {
        toast.success("Vehichles imported successfully");
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
    doc.text("Vehichles", 10, 10);
    const tableData = [];
    filteredData.forEach((record) => {
      tableData.push([
        record.number_plate,
        record.driver.name,
        record.mileage,
        record.vehichle_type,
        record.manufacturer,
        record.date_of_purchase,
      ]);
    });
    doc.autoTable({
      head: [["Number Plate", "Driver", "Mileage", "Vehichle Type", "Manufacturer", "Total Maintenance", "Date of Purchase"]],
      body: tableData,
    });
    doc.save("vehicles.pdf");
  };


  console.log(maintenanceData);



  const costsPerVehicle = {};
  if (maintenanceData) {
    Object.values(maintenanceData.entities).forEach((entity) => {
      const numberPlate = entity.fleet.number_plate;
      if (!costsPerVehicle[numberPlate]) {
        costsPerVehicle[numberPlate] = 0;
      }
      costsPerVehicle[numberPlate] += entity.cost;
      console.log(`Costs For ${numberPlate} :`, costsPerVehicle[numberPlate]);
    });
  } else {
    console.log("maintenanceData is undefined");
  }

  const fuelPerVehicle = {};
  if (fuelData) {
    Object.values(fuelData.entities).forEach((entity) => {
      const numberPlate = entity.fuel_plate.number_plate;
      if (!fuelPerVehicle[numberPlate]) {
        fuelPerVehicle[numberPlate] = 0;
      }
      fuelPerVehicle[numberPlate] += entity.amount;
      console.log(`Fuel For ${numberPlate} :`, fuelPerVehicle[numberPlate]);
    });
  } else {
    console.log("fuelData is undefined");
  }


  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Vehicles</h2>
        <div>
          <Link
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
            <i className="material-icons md-plus"></i> Add Vehicle
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
                <input
                  type="date"
                  value={startDate}
                  className="form-control"
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
              </div>
              <div className="col-lg-2 col-md-3 col-6">
                <input
                  type="date"
                  value={endDate}
                  className="form-control"
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
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
        <div className=" table-responsive-lg">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Mileage</th>
                  <th>Year</th>
                  <th>Type</th>
                  <th>Manufacturer</th>
                  <th>Total Service</th>
                  <th>Total Fuel</th>
                  {/* <th>Status</th>
                  <th>Group</th>
                  <th>Watchers</th> */}
                  <th className="text-center"> Action </th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <TableLoader key={i} count={6} />
                    ))
                  : currentData?.map((d, index) => (
                      <tr key={index}>
                        <td>{d.number_plate}</td>
                        <td>{d.driver.name}</td>
                        <td>{d.mileage}</td>
                        <td>{new Date(d.date_of_purchase).toDateString()}</td>
                        <td>{d.vehichle_type}</td>
                        <td>{d.manufacturer}</td>
                        <td>
                          <Link to={`costs_view/${d.id}`}>
                            {costsPerVehicle[d.number_plate] || 0}
                          </Link>
                        </td>
                        <td>
                          <Link to={`fuel_view/${d.id}`}>
                            {fuelPerVehicle[d.number_plate] || 0}
                          </Link>
                        </td>
                        {/* <td>Status</td>
                        <td>Group</td>
                        <td>Watchers</td> */}
                        <td
                          className="action-column text-center"
                          
                      >
                        <Link to={`view/${d.id}`} className="btn btn-sm rounded btn-blue mx-1">
                          <FontAwesomeIcon icon={faEye} title="View" icon-size="sm" />
                        </Link>
                          <Link
                            to={`edit/${d.id}`}
                            className="btn btn-sm rounded btn-brand mx-1"
                          >
                            <FontAwesomeIcon icon={faPencil} title="Edit" icon-size="sm"  />
                            {/* <i className="material-icons md-edit"></i>
                            Edit */}
                          </Link>
                          <button
                            onClick={() => handleDeleteVehichle(d.id)}
                            className="btn btn-sm rounded btn-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} title="Delete" icon-size="sm"  />
                            {/* <i className="material-icons md-delete"></i> */}
                           
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
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

export default Vehichles;

