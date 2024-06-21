import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
  useGetFuelQuery,
  useImportFuelMutation,
  useDeleteFuelMutation,
  useApproveFuelMutation,
  useRejectFuelMutation,
} from "../features/fuel/fuelApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faPencil,
  faSearch,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import FuelModal from "../components/FuelModal";


const Fuel = () => {
  const user = useSelector(selectUser);

  const [importError, setImportError] = useState(null);
  const [AppError, setAppError] = useState(null);

  const { isLoading, data, refetch } = useGetFuelQuery();
  const [importFuel, { isLoading: isImporting }] = useImportFuelMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const uploadRef = useRef(null);

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleDataPerPage = (e) => setDataPerPage(parseInt(e.target.value));

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { ids, entities } = data || {};
  const fuelArray = ids
    ?.map((id) => entities[id])
    .reverse()
    

  const [approveFuel, { isLoading: isApproving }] = useApproveFuelMutation();
  const [rejectFuel, { isLoading: isRejecting }] = useRejectFuelMutation();

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

  const handleFilterStatus = (status) => {
    setSelectedStatus(status);
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

  const handleDateRange = (dateRange) => {
    if (dateRange) {
      setStartDate(dateRange[0]);
      setEndDate(dateRange[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const filteredData = fuelArray?.filter((fuel) => {
    const fuel_type = fuel.fuel_type.toLowerCase();
    const fuel_plate = fuel.fuel_plate.number_plate.toLowerCase();
    const mileage = fuel.mileage;
    const amount = fuel.amount;
    const date_of_fueling = fuel.date_of_fueling.toLowerCase();
    const status = fuel.status.toLowerCase();
    const search = searchQuery.toLowerCase();

    if (selectedStatus !== "All") {
      if (search) {
        return (
          (startDate === null || startDate <= date_of_fueling) &&
          (endDate === null || date_of_fueling <= endDate) &&
          (fuel_type.includes(search) ||
            fuel_plate.includes(search) ||
            (mileage && mileage.toString().includes(search)) ||
            (amount && amount.toString().includes(search)) ||
            (date_of_fueling && date_of_fueling.toString().includes(search)) ||
            status.includes(search)) &&
          status === selectedStatus
        );
      } else {
        return (
          (startDate === null || startDate <= date_of_fueling) &&
          (endDate === null || date_of_fueling <= endDate) &&
          status === selectedStatus
        );
      }
    } else {
      if (search) {
        return (
          (startDate === null || startDate <= date_of_fueling) &&
          (endDate === null || date_of_fueling <= endDate) &&
          (fuel_type.includes(search) ||
            fuel_plate.includes(search) ||
            (mileage && mileage.toString().includes(search)) ||
            (amount && amount.toString().includes(search)) ||
            (date_of_fueling && date_of_fueling.toString().includes(search)) ||
            status.includes(search))
        );
      } else {
        return (
          (startDate === null || startDate <= date_of_fueling) &&
          (endDate === null || date_of_fueling <= endDate)
        );
      }
    }
  });

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(
    indexOfFirstData,
    indexOfFirstData + dataPerPage
  );

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
      head: [
        ["Fuel Type", "Number Plate", "Mileage", "Amount", "Date of Fueling"],
      ],
      body: tableData,
    });
    doc.save("fuel_records.pdf");
  };

  
  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Fuel Requests</h2>
        <div>
          {user?.is_staff || user?.is_driver ? (
            <>
              <div>
                <Link to="add" className="btn btn-primary  ">
                  <i className="material-icons md-plus"></i> Request Fuel
                </Link>

                {user?.is_staff ? (
                  <>
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
                      </>
                    ) : null
                  }


                </div>

              </>
            ) : null

          }

        </div>
      </div>
      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3 mb-3 mt-1">
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
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6">
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
          <div className="row gx-4  mb-7 mt-6 me-3">
            <div
              className="row gx-4 justify-content-between mb-2"
              style={{ height: 14 }}
            >
              <div className="col-lg-0 col-md-1 col-2">
                <button
                  onClick={() => handleFilterStatus("All")}
                  className="btn btn-sm rounded btn-gray btn-all d-flex"
                  style={{ marginRight: "5px" }}
                >
                  <span style={{ marginRight: "10px" }}>All</span>
                  <span className={`badge bg-white text-black`}>4</span>
                </button>
              </div>
              <div className="col-lg-0 col-md-2  col-sm-3 col-4">
                <button
                  onClick={() => handleFilterStatus("pending")}
                  className="btn btn-sm rounded btn-blues  d-flex"
                  style={{ marginBottom: 0 }}
                >
                  <span style={{ marginRight: "10px" }}>Pending</span>
                  <span className={`badge bg-white text-black`}>4</span>
                </button>
              </div>

              <div className="col-lg-0 col-md-2  col-4 ">
                <button
                  onClick={() => handleFilterStatus("approved")}
                  className="btn btn-sm rounded btn-success mx-0  d-flex"
                  style={{ marginBottom: 0 }}
                >
                  <span style={{ marginRight: "10px" }}>Approved</span>
                  <span className="badge bg-white text-black">4</span>
                </button>
              </div>

              <div className="col-lg-0 col-md-2 col-4">
                <button
                  onClick={() => handleFilterStatus("Rejected")}
                  className="btn btn-sm rounded btn-danger d-flex"
                  style={{ marginRight: "10px" }}
                >
                  <span style={{ marginRight: "10px" }}>Rejected</span>
                  <span className="badge bg-white text-black">4</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  {/* <th>Fuel Station</th> */}
                  {/* <th>Fuel Type</th> */}
                  <th>Vehicle</th>
                  <th>Mileage</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  {/* <th>Usage</th> */}
                  {/* <th>Volume Unit</th> */}
                  {/* <th>Fuel Capacity Alert</th> */}
                  {user?.is_staff ? (
                    <>
                      <th className="text-center"> Action </th>
                    </>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <TableLoader key={i} count={6} />
                    ))
                  : currentData?.map((d, index) => (
                      <tr key={index}>
                        {/* <th>Shell Moyo</th> */}
                        {/* <td>{d.fuel_type}</td> */}
                        <td>{d.fuel_plate.number_plate}</td>
                        <td>{d.mileage}</td>
                        <td>{d.amount}</td>
                        <td>{new Date(d.date_of_fueling).toDateString()}</td>
                        <td>{d.status}</td>
                        {/* <td>Usage</td>
                      <td>Volume Unit</td>
                      <td>Fuel Capacity Alert</td> */}
                        {user?.is_staff ? (
                          <>
                            <td className="text-center action-column">
                            <FuelModal id={d.id} columns={["Vehicle","Driver","Fuel Station","Fuel Type","Mileage","Amount","Date","Status","Action"]} title="Fuel Details"/>
                              <Link
                                to={`edit/${d.id}`}
                                className="btn btn-sm rounded btn-brand mx-1"
                              >
                                <FontAwesomeIcon icon={faPencil} title="Edit" />
                              </Link>
                              <button
                                onClick={() => handleDeleteFuel(d.id)}
                                className="btn btn-sm  rounded btn-danger"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  title="Delete"
                                />
                              </button>
                             

                            </td>
                          </>
                        ) : null}
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

export default Fuel;
