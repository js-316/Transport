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
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/soliton.png'
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";


const Maintenance = () => {
    const user = useSelector(selectUser)
    const { isLoading, data,refetch } = useGetMaintenanceQuery();
    const [dataPerPage, setDataPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const { ids, entities} = data || {};
    const maintenancesArray = ids?.map((id) => entities[id])
    

    const [deleteMaintenance, {isLoading: isDeleting}] = useDeleteMaintenanceMutation();

  const[searchQuery, setSearchQuery] = useState('')

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

  const filteredData = maintenancesArray?.filter((maintenance) => {
    const fleet = maintenance.fleet.number_plate.toLowerCase();
    const cost = maintenance.cost;
    const description = maintenance.description.toLowerCase();
    const date = maintenance.date.toLowerCase()
    const search = searchQuery.toLowerCase();
    

    if(search){
      return(
        fleet.includes(search) ||
        (cost && cost.toString().includes(search)) ||
        description.includes(search) ||
        date.includes(search)
      )
    }else{
    return maintenancesArray;
    }
  });

  console.log('Filtered Maintenance Data:', maintenancesArray);

  const uniqueVehicles = [...new Set(maintenancesArray?.map(m => m.fleet.number_plate))];

  
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData?.slice(indexOfFirstData, indexOfLastData);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const costsExportToPDF = (fleetNumberPlate) => {
    console.log('Selected Fleet Number Plate:', fleetNumberPlate);
    console.log('All Maintenance Records:', maintenancesArray);

    // Filter maintenance records for the selected fleet number plate
    const vehicleMaintenances = maintenancesArray.filter((maintenance) => {
        const maintenanceFleetNumberPlate = maintenance.fleet.number_plate;
        console.log('Maintenance Fleet Number Plate:', maintenanceFleetNumberPlate);
        console.log('Comparison:', maintenanceFleetNumberPlate === fleetNumberPlate);
        return maintenanceFleetNumberPlate === fleetNumberPlate;
    });

    console.log('Maintenance Records for Selected Fleet:', vehicleMaintenances);

    // Check if there are any maintenance records for the selected fleet
    if (vehicleMaintenances.length === 0) {
        console.error('No maintenance records found for the selected fleet.');
        return;
    }

    // Calculate the total cost
    const totalCost = vehicleMaintenances.reduce((acc, maintenance) => acc + maintenance.cost, 0);

    // Create and configure the PDF
    const doc = new jsPDF();
    doc.text(`Vehicle Maintenance Report For- ${vehicleMaintenances[0].fleet.number_plate}`, 10, 10);
    doc.text(`Total Cost: ${totalCost}`, 10, 20);

    // Prepare table data
    const tableData = vehicleMaintenances?.map((record) => [
        record.date,
        record.description,
        record.cost,
       
    ]);

    // Generate the table in the PDF
    doc.autoTable({
        head: [["Date","Description", "Cost" ]],
        body: tableData,
        startY: 30,
    });

    // Save the PDF
    doc.save("vehicle_maintenance_report.pdf");
};


  
    
  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Repair Requests</h2>
        <div>
        {
          user?.is_staff || user?.is_driver ? (
            <>
              <div >
                  <Link to="add" className="btn btn-primary">
                    <i className="material-icons md-plus"></i> Request Repair
                  </Link>


                  {
                    user?.is_staff ? (
                      <>
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
                  {/* <th>Meter Unit</th> */}
                  <th>Description</th>
                  {/* <th>Issues</th> */}
                  {/* <th>Work Order Number</th> */}
                  {
                    user?.is_staff ? (
                      <>
                        <th className="text-center"> Action </th>
                      </>

                    ):null
                  }

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
                        {/* <td>Meter Unit</td> */}
                        <td>Description</td>
                        {/* <td>Issues</td> */}
                        {/* <td>Work Order Number</td> */}
                        {
                          user?.is_staff ? (
                            <>
                              <td className="text-center" style={{whiteSpace:"noWrap"}}>
                          <Link
                            to={`edit/${d.id}`}
                            className="btn btn-sm font-sm rounded btn-brand mx-4"
                          >
                            <i className="material-icons md-edit"></i>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteMaintenance(d.id)}
                            className="btn btn-sm font-sm rounded btn-danger"
                          >
                            <i className="material-icons md-delete"></i>
                            Delete
                          </button>
                        </td>
                            </>
                          ):null
                        }
                        
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