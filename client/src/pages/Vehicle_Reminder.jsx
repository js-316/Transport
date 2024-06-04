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
import { Service_statuses } from "../data/chartData";

const Vehicle_Reminders = () => {
  const { isLoading, data, refetch } = useGetMaintenanceQuery();

  const { ids, entities } = data || {};
  const maintenancesArray = ids?.map((id) => entities[id]);
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

  const filteredData = maintenancesArray?.filter((maintenance) => {
    const fleet = maintenance.fleet.number_plate.toLowerCase();
    const cost = maintenance.cost;
    const description = maintenance.description.toLowerCase();
    const date = maintenance.date.toLowerCase();
    const search = searchQuery.toLowerCase();

    if (search) {
      return (
        fleet.includes(search) ||
        (cost && cost.toString().includes(search)) ||
        description.includes(search) ||
        date.includes(search)
      );
    } else {
      return maintenancesArray;
    }
  });

  console.log("Filtered Maintenance Data:", maintenancesArray);

  const uniqueVehicles = [
    ...new Set(maintenancesArray?.map((m) => m.fleet.number_plate)),
  ];

  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDataPerPage = (e) => {
    setDataPerPage(parseInt(e.target.value));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Maintenance", 10, 10);
    const tableData = [];
    filteredData.forEach((record) => {
      tableData.push([
        record.fleet.number_plate,
        record.description,
        record.cost,
        record.date,
      ]);
    });
    doc.autoTable({
      head: [["Fleet", "Description", "Cost", "Date"]],
      body: tableData,
    });
    doc.save("maintenance.pdf");
  };

  const costsExportToPDF = (fleetNumberPlate) => {
    console.log("Selected Fleet Number Plate:", fleetNumberPlate);
    console.log("All Maintenance Records:", maintenancesArray);

    // Filter maintenance records for the selected fleet number plate
    const vehicleMaintenances = maintenancesArray.filter((maintenance) => {
      const maintenanceFleetNumberPlate = maintenance.fleet.number_plate;
      console.log(
        "Maintenance Fleet Number Plate:",
        maintenanceFleetNumberPlate
      );
      console.log(
        "Comparison:",
        maintenanceFleetNumberPlate === fleetNumberPlate
      );
      return maintenanceFleetNumberPlate === fleetNumberPlate;
    });

    console.log("Maintenance Records for Selected Fleet:", vehicleMaintenances);

    // Check if there are any maintenance records for the selected fleet
    if (vehicleMaintenances.length === 0) {
      console.error("No maintenance records found for the selected fleet.");
      return;
    }

    // Calculate the total cost
    const totalCost = vehicleMaintenances.reduce(
      (acc, maintenance) => acc + maintenance.cost,
      0
    );

    // Create and configure the PDF
    const doc = new jsPDF();
    doc.text(
      `Vehicle Maintenance Report For- ${vehicleMaintenances[0].fleet.number_plate}`,
      10,
      10
    );
    doc.text(`Total Cost: ${totalCost}`, 10, 20);

    // Prepare table data
    const tableData = vehicleMaintenances.map((record) => [
      record.date,
      record.description,
      record.cost,
    ]);

    // Generate the table in the PDF
    doc.autoTable({
      head: [["Date", "Description", "Cost"]],
      body: tableData,
      startY: 30,
    });

    // Save the PDF
    doc.save("vehicle_maintenance_report.pdf");
  };

  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Vehicle Renewal Reminders</h2>
        <div>
          <Link to="add" className="btn btn-primary">
            <i className="material-icons md-plus"></i> Add Vehicle Renewal
            Reminder
          </Link>

          <button onClick={exportToPDF} className="btn btn-success mx-2">
            Export to PDF
          </button>
        </div>
      </div>
      <ButtonBudges title="Satus" buttons={Service_statuses} />
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
                id="vehicle-select"
                className="form-select"
                onChange={(e) => costsExportToPDF(e.target.value)}
              >
                <option>Calculate Cost</option>
                {uniqueVehicles.map((number_plate, index) => (
                  <option key={index} value={number_plate}>
                    {number_plate}
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
                <th>Vehicle</th>
                <th>Renewal Type</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Watcher</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <TableLoader key={i} count={5} />)
                : currentData.map((d, index) => (
                    <tr key={index}>
                      <td>{d.fleet.number_plate}</td>
                      <td>{d.description}</td>
                      <td>{d.cost}</td>
                      <td>{new Date(d.date).toDateString()}</td>
                      <td>Watcher</td>
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

export default Vehicle_Reminders;
