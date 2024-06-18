import React, {useState} from "react";
import Layout from "../components/Layout";
import { useGetMaintenanceQuery, useDeleteMaintenanceMutation} from "../features/maintenance/maintenanceApiSlice";
import { Link, useNavigate } from "react-router-dom";
import TableLoader from "../components/TableLoader";
import Pagination from "../components/Pagination";
import errorParser from "../util/errorParser";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/soliton.png'
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";


const Maintenance = () => {

  const user = useSelector(selectUser)
  const { isLoading, data, refetch } = useGetMaintenanceQuery();
  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedStatus, setSelectedStatus] = useState('All')

  const [deleteMaintenance, { isLoading: isDeleting }] = useDeleteMaintenanceMutation();

  const [searchQuery, setSearchQuery] = useState('')

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)


  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const { ids, entities } = data || {};
  const maintenancesArray = ids?.map((id) => entities[id])

  const handleDeleteMaintenance = async (id) => {
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
        
        const res = await deleteMaintenance( id ).unwrap();
        

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

  const handleDateRange = (dateRange) => {
    if (dateRange) {
        setStartDate([dateRange(0)]);
        setEndDate([dateRange(1)]);
    } else {
        setStartDate(null);
        setEndDate(null);
    }
};

const handleFilterStatus = (status) => {
  setSelectedStatus(status);
};
const filteredData = maintenancesArray?.filter((maintenance) => {
  const fleet = maintenance.fleet.number_plate.toLowerCase();
  const cost = maintenance.cost;
  const description = maintenance.description.toLowerCase();
  const date = maintenance.date.toLowerCase()
  const status = maintenance.status.toLowerCase();
  const search = searchQuery.toLowerCase();

  if (selectedStatus !== 'All') {
    if (search) {
      return (
        (startDate === null || startDate <= date_of_date) &&
        (endDate === null || date_of_date <= endDate) &&
        (
          ( fleet.includes(search) ||
          (cost && cost.toString().includes(search)) ||
          description.includes(search) ||
          status.includes(search) ||
          (date && date.toString().includes(search)))
          
        ) &&
        status === selectedStatus
      );
    } else {
      return (
        (startDate === null || startDate <= date_of_date) &&
        (endDate === null || date_of_date <= endDate) &&
        status === selectedStatus
      );
    }
  } else {
    if (search) {
      return (
        (startDate === null || startDate <= date_of_date) &&
        (endDate === null || date_of_date <= endDate) &&
        (
          ( fleet.includes(search) ||
          (cost && cost.toString().includes(search)) ||
          description.includes(search) ||
          status.includes(search) ||
          (date && date.toString().includes(search)))
        )
      );
    } else {
      return (
        (startDate === null || startDate <= date_of_date) &&
        (endDate === null || date_of_date <= endDate)
      );
    }
  }
});


  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(indexOfFirstData, indexOfLastData);
  console.log('Filtered Maintenance Data:', maintenancesArray);

  
  
  const handleDataPerPage = (e) => {
    setDataPerPage(parseInt(e.target.value));
  };

  

  const exportToPDF = () => {
    const doc = new jsPDF();
    
     // Add logo
     doc.addImage(logo, 'PNG', 10, 10, 20, 20);
      
     // Add header text
     doc.text(`Soliton Telmec`, 40, 15);
     doc.text(`Address: Bugolobi Plot 10, Mizindalo Road`, 40, 20);
     doc.text(`Phone: +256 700 777 003`, 40, 25);
     doc.text(`Email: info@soliton.co.ug`, 40, 30);
   
     // Add a newline
     doc.text(`\n`, 10, 35);

    doc.text("Service History", 10, 40)
    const tableData = [];
    filteredData.forEach((record) => {
      tableData.push([
        record.fleet.number_plate,
        record.description,
        record.cost,
        record.date,
        record.driver,
        record.repair_priority_class,
        record.meter,
        record.meter_unit,
        record.work_order_number,
        record.labels,
        

      ]);
    });
    doc.autoTable({
      head: [["Vehicle", "Description", "Cost", "Date","Driver","Repair Priority Class","Meter","Meter Unit","Work Order Number","Labels"]],
      body: tableData,
      startY: 50,
    });
    
    doc.save("maintenance.pdf");
  };
  
  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Repair Requests</h2>
        <div>
          {user?.is_staff || user?.is_driver ? (
            <>
              <div>
                <Link to="add" className="btn btn-primary">
                  <i className="material-icons md-plus"></i> Request Repair
                </Link>

                {user?.is_staff ? (
                  <>
                    <button
                      onClick={exportToPDF}
                      className="btn btn-success mx-2"
                    >
                      Export to PDF
                    </button>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
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
          <div className="col-lg-4 md-6">
            <div
              className="row gx-2 justify-content-between mt-1 mb-0 "
              style={{ height: 14 }}
            >
              <div className="col-lg-1 col-md-1 col-1 ">
                <button
                  onClick={() => handleFilterStatus("All")}
                  className="btn btn-sm rounded btn-gray btn-all d-flex justify-content-between"
                  style={{ marginBottom: 0 }}
                >
                  <span style={{ marginRight: "10px" }}>All</span>
                  <span className={`badge bg-white text-black`}>4</span>
                </button>
              </div>
              <div className="col-lg-1 col-md-1 col-1">
                <button
                  onClick={() => handleFilterStatus("pending")}
                  className="btn btn-sm rounded btn-blues  btn-all d-flex justify-content-between"
                  style={{ marginBottom: 0 }}
                >
                  <span style={{ marginRight: "10px" }}>Pending</span>
                  <span className={`badge bg-white text-black`}>4</span>
                </button>
              </div>

              <div className="col-lg-1 col-md-1 col-1 ">
                <button
                  onClick={() => handleFilterStatus("approved")}
                  className="btn btn-sm rounded btn-success mx-0  d-flex justify-content-between"
                  style={{ marginBottom: 0 }}
                >
                  <span style={{ marginRight: "10px" }}>Approved</span>
                  <span className="badge bg-white text-black">4</span>
                </button>
              </div>

              <div className="col-lg-1 col-md-1 col-1">
                <button
                  onClick={() => handleFilterStatus("rejected")}
                  className="btn btn-sm rounded btn-danger d-flex justify-content-between"
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
          <div className="table-responsive-lg">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Vehichle</th>
                  <th>Repair Request</th>
                  {/* <th>Total Cost</th> */}
                  <th>Request Date</th>
                  <th>Driver</th>
                  {/* <th>Repair Priority Class</th> */}
                  <th>Mileage</th>
                  <th>Status</th>
                  {/* <th>Meter Unit</th> */}
                  {/* <th>Description</th> */}
                  {/* <th>Issues</th> */}
                  {/* <th>Work Order Number</th> */}
                  {user?.is_staff ? (
                    <>
                      <th className="text-center"> Action </th>
                    </>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? [...Array(5)]?.map((_, i) => (
                      <TableLoader key={i} count={5} />
                    ))
                  : currentData?.map((d, index) => (
                      <tr key={index}>
                        <td>{d.fleet.number_plate}</td>
                        <td>{d.description}</td>
                        {/* <td>{d.cost}</td> */}
                        <td>{new Date(d.date).toDateString()}</td>
                        <td>Driver</td>
                        {/* <td>Priority Class</td> */}
                        <td>{d.cost}</td>
                        <td>{d.status}</td>
                        {/* <td>Meter Unit</td> */}
                        {/* <td>Description</td> */}
                        {/* <td>Issues</td> */}
                        {/* <td>Work Order Number</td> */}
                        {user?.is_staff ? (
                          <>
                            <td className="text-center action-column">
                              <Link
                                to={`view/${d.id}`}
                                className="btn btn-sm font-sm rounded btn-blue mx-1"
                              >
                                <FontAwesomeIcon icon={faEye} title="View" />
                              </Link>
                              <Link
                                to={`edit/${d.id}`}
                                className="btn btn-sm font-sm rounded btn-brand mx-1"
                              >
                                <FontAwesomeIcon icon={faPencil} title="Edit" />
                              </Link>
                              <button
                                onClick={() => handleDeleteMaintenance(d.id)}
                                className="btn btn-sm font-sm rounded btn-danger"
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

export default Maintenance;