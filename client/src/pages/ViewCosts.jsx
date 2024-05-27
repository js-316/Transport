import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
useGetVehichlesQuery,
useImportVehichlesMutation,
useDeleteVehichleMutation,
} from "../features/vehichle/vehicleApiSlice";
import { useGetMaintenanceQuery} from "../features/maintenance/maintenanceApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const ViewCosts = () => {
    const { numberPlate } = useParams();
    const { data: maintenanceData } = useGetMaintenanceQuery(numberPlate);

    const costs = Array.isArray(maintenanceData) ? maintenanceData.filter((maintenance) => maintenance.fleet.number_plate === numberPlate) : [];
    
    const [importError, setImportError] = useState(null);

    const { isLoading, data, refetch } = useGetVehichlesQuery();
    const { ids, entities } = data || {};
    const vehichlesArray = ids?.map((id) => entities[id]);

    const [importVehichles, { isLoading: isImporting }] =
    useImportVehichlesMutation();



    console.log("Vehicles data:", data);
    //console.log("Maintenance data:", maintenanceData);

    const navigate = useNavigate();
    const [AppError, setAppError] = useState(null);

    const[searchQuery, setSearchQuery] = useState('');

    

    const filteredData = vehichlesArray?.filter((vehichle) =>{
        const number_plate = vehichle.number_plate.toLowerCase();
        const driver = vehichle.driver.name.toLowerCase();
        const mileage = vehichle.mileage
        const vehichle_type = vehichle.vehichle_type.toLowerCase()
        const manufacturer = vehichle.manufacturer.toLowerCase()
        const search = searchQuery.toLowerCase();

        if (search) {
            return (
            number_plate.includes(search) ||
            driver.includes(search) ||
            (mileage && mileage.toString().includes(search)) || // convert mileage to string
            vehichle_type.includes(search) ||
            manufacturer.includes(search)
            );
        } else {
            return vehichlesArray; // return all vehicles if search query is empty
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
        head: [["Number Plate", "Driver", "Mileage", "Vehichle Type","Manufacturer","Total Maintenance","Date of Purchase"]],
        body: tableData,
    });
    doc.save("vehicles.pdf");
    };


    console.log(maintenanceData);


    return (
    <Layout>
        <div className="content-header">
            <h2 className="content-title">Costs for {numberPlate}</h2>
            <div>
        
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
        </div>
        </header>
        <div className="card-body">
        <table className="table table-hover">
        <thead>
        <tr>
            <th>Vehicle</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Date </th>
        </tr>
        </thead>
        <tbody>
    {isLoading
    ? [...Array(5)].map((_, i) => <TableLoader key={i} count={6} />)
    : costs?.map((cost, index) => (

    <tr key={index}>
        <td>{cost.description}</td>
        <td>{cost.cost}</td>
        <td>{new Date(cost.date).toDateString()}</td>
    </tr>
    ))};
    </tbody>
    </table>
    </div>
    </div>
    <div className="pagination-area mt-30 mb-50">
    <nav aria-label="Page navigation example">
    <Pagination
    totalData={costs?.length}
    dataPerPage={dataPerPage}
    paginate={paginate}
    currentPage={currentPage}
    />
    </nav>
    </div>
    </Layout>
    );
    };

export default ViewCosts;


