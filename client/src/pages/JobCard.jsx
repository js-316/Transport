import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  useGetMaintenanceQuery,
  useDeleteMaintenanceMutation,
} from "../features/maintenance/maintenanceApiSlice";
import { Link, useNavigate } from "react-router-dom";
import TableLoader from "../components/TableLoader";
import Pagination from "../components/Pagination";
import errorParser from "../util/errorParser";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ButtonBudges from "../components/ButtonBudges";
import { statuses } from "../data/chartData";
import { useGetJobcardQuery } from "../features/jobcard/jobcardApiSlice";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import JobcardModal from "../components/JobcardModal";


const JobCard = () => {
  //const { isLoading, data, refetch } = useGetMaintenanceQuery();
  const {loading:vehicleLoading, data:Vehichle} = useGetVehichlesQuery()

  const { isLoading: Loading, data: jobcardData, refetch } = useGetJobcardQuery();

  //const { ids, entities } = data || {};
  const { ids, entities } = jobcardData || {}
  //const maintenancesArray = ids?.map((id) => entities[id]);
  const jobcardArray = ids?.map((id) => entities[id])
  console.log("Jobcard", jobcardArray)

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("All");
  
  const [AppError, setAppError] = useState(null);

  const [deleteMaintenance, { isLoading: isDeleting }] =
    useDeleteMaintenanceMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteMaintenance = async (id) => {
    setAppError(null);
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const res = await deleteMaintenance(id).unwrap();

        refetch();
      }
    } catch (err) {
      console.error("Error deleting Maintenance:", err);
      if (parseInt(err.status) !== err.status) {
        setAppError("Network Error");
      } else {
        const parsedError = errorParser(err?.data);
        setAppError(err?.data?.message || parsedError);
      }
    }
  };


  const filteredData = jobcardArray?.filter((jobcard) => {
    const jobcard_plate = jobcard.jobcard_plate.number_plate.toLowerCase();
    const machine_name = jobcard.machine_name;
    const date_of_jobcard = jobcard.date_of_jobcard;
    const repair = jobcard.repair.description
    const parts_needed = jobcard.parts_needed.toLowerCase();
    const status = jobcard.status.toLowerCase()
    const search = searchQuery.toLowerCase();

    if (selectedStatus !== "All") {
      if (search) {
        return (
          (startDate === null || startDate <= date_of_jobcard) &&
          (endDate === null || date_of_jobcard <= endDate) &&
          (machine_name.includes(search) ||
            jobcard_plate.includes(search) ||
            (parts_needed && parts_needed.toString().includes(search)) ||
            (repair && repair.toString().includes(search)) ||
            (date_of_jobcard && date_of_jobcard.toString().includes(search)) ||
            status.includes(search)) &&
          status === selectedStatus
        );
      } else {
        return (
          (startDate === null || startDate <= date_of_jobcard) &&
          (endDate === null || date_of_jobcard <= endDate) &&
          status === selectedStatus
        );
      }
    } else {
      if (search) {
        return (
          (startDate === null || startDate <= date_of_jobcard) &&
          (endDate === null || date_of_jobcard <= endDate) &&
          (machine_name.includes(search) ||
            jobcard_plate.includes(search) ||
            (parts_needed && parts_needed.toString().includes(search)) ||
            (repair && repair.toString().includes(search)) ||
            (date_of_jobcard && date_of_jobcard.toString().includes(search)) ||
            status.includes(search))
        );
      } else {
        return (
          (startDate === null || startDate <= date_of_jobcard) &&
          (endDate === null || date_of_jobcard <= endDate)
        );
      }
    }
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

  
  const handleFilterStatus = (status) => {
    setSelectedStatus(status);
  };
  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Maintenance", 10, 10);
  //   const tableData = [];
  //   filteredData.forEach((record) => {
  //     tableData.push([
  //       record.fleet.number_plate,
  //       record.description,
  //       record.cost,
  //       record.date,
  //     ]);
  //   });
  //   doc.autoTable({
  //     head: [["Fleet", "Description", "Cost", "Date"]],
  //     body: tableData,
  //   });
  //   doc.save("maintenance.pdf");
  // };

  // const costsExportToPDF = (fleetNumberPlate) => {
  //   console.log("Selected Fleet Number Plate:", fleetNumberPlate);
  //   console.log("All Maintenance Records:", maintenancesArray);

  //   // Filter maintenance records for the selected fleet number plate
  //   const vehicleMaintenances = maintenancesArray.filter((maintenance) => {
  //     const maintenanceFleetNumberPlate = maintenance.fleet.number_plate;
  //     console.log(
  //       "Maintenance Fleet Number Plate:",
  //       maintenanceFleetNumberPlate
  //     );
  //     console.log(
  //       "Comparison:",
  //       maintenanceFleetNumberPlate === fleetNumberPlate
  //     );
  //     return maintenanceFleetNumberPlate === fleetNumberPlate;
  //   });

  //   console.log("Maintenance Records for Selected Fleet:", vehicleMaintenances);

  //   // Check if there are any maintenance records for the selected fleet
  //   if (vehicleMaintenances.length === 0) {
  //     console.error("No maintenance records found for the selected fleet.");
  //     return;
  //   }

  //   // Calculate the total cost
  //   const totalCost = vehicleMaintenances.reduce(
  //     (acc, maintenance) => acc + maintenance.cost,
  //     0
  //   );

  //   // Create and configure the PDF
  //   const doc = new jsPDF();
  //   doc.text(
  //     `Vehicle Maintenance Report For- ${vehicleMaintenances[0].fleet.number_plate}`,
  //     10,
  //     10
  //   );
  //   doc.text(`Total Cost: ${totalCost}`, 10, 20);

  //   // Prepare table data
  //   const tableData = vehicleMaintenances?.map((record) => [
  //     record.date,
  //     record.description,
  //     record.cost,
  //   ]);

  //   // Generate the table in the PDF
  //   doc.autoTable({
  //     head: [["Date", "Description", "Cost"]],
  //     body: tableData,
  //     startY: 30,
  //   });

  //   // Save the PDF
  //   doc.save("vehicle_maintenance_report.pdf");
  // };

  const getStatusStyle = (st) => {
    if (st === "pending") {
      return { color: "gray", fontWeight: "bold" };
    } else if (st === "Ongoing") {
      return { color: "blue", fontWeight: "bold" };
    } else if (st === "Completed") {
      return { color: "green", fontWeight: "bold" };
    } else if (st === "Approved") {
      return { color: "#176B87", fontWeight: "bold" };
    } else if (st === "Pending") {
        return { color: "#FFA500", fontWeight: "bold" };
    } else {
      return { color: "red", fontWeight: "bold" };
    }
  };
  

  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Job Cards</h2>
        <div>
          

          {/* <button onClick={exportToPDF} className="btn btn-success mx-2">
            Export to PDF
          </button> */}
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
          <div className="row gx-4  mb-7 mt-3 me-3">
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
                  className="btn btn-sm rounded btn-orange d-flex"
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
                  onClick={() => handleFilterStatus("procured")}
                  className="btn btn-sm rounded btn-blues d-flex"
                  style={{ marginRight: "10px" }}
                >
                  <span style={{ marginRight: "10px" }}>Procured</span>
                  <span className="badge bg-white text-black">4</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive-lg">
            <table className="table table-hover">
              <thead>
                {/* <tr>
                  <th>Vehicle</th>
                  <th>Mileage</th>
                  <th>Work To Be Done</th>
                  <th>Date</th>
                  {/* <th>Machine Name</th> */}
                {/* <th>Next Service</th> 
                  <th>Quantity</th>
                  <th>Part</th>
                </tr> */}
                <tr>
                  <th>Vehicle</th>
                  <th>Machine Name</th>
                  <th>Repair Request</th>
                  <th>Date</th>
                  <th>Parts Needed</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* {isLoading
                  ? [...Array(5)]?.map((_, i) => (
                    <TableLoader key={i} count={5} />
                  ))
                  : currentData?.map((d, index) => (
                    <tr key={index}>
                      <td>{d.fleet.number_plate}</td>
                      <td>{d.cost}</td>
                      <td>{d.description}</td>
                      <td>{new Date(d.date).toDateString()}</td>
                      {/* <td>Machine</td> 
                      {/* <td>{new Date(d.date).toDateString()}</td> 
                      <td>4</td>
                      <td>Part</td>
                    </tr>
                  ))} */}
                {Loading
                  ? [...Array(5)]?.map((_, i) => (
                      <TableLoader key={i} count={5} />
                    ))
                  : currentData?.map((d, index) => (
                      <tr key={index}>
                        <td>{d.jobcard_plate.number_plate}</td>
                        <td>{d.machine_name}</td>
                        <td>{d.repair.description}</td>
                        <td>{new Date(d.date_of_jobcard).toDateString()}</td>
                        <td>{d.parts_needed}</td>
                        <td style={getStatusStyle(d.status)}>{d.status}</td>
                        <td>
                          <JobcardModal id={d.id}/>
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

export default JobCard;



