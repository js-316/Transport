import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
    useGetVehichleByIdQuery,
    useGetVehichlesQuery,
    useImportVehichlesMutation,
    useViewCostsQuery,
} from "../features/vehichle/vehicleApiSlice";
import { useGetMaintenanceQuery } from "../features/maintenance/maintenanceApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const ViewCosts = () => {
    const { id } = useParams();

    const { data: vehichleData } = useGetVehichleByIdQuery(id);
    const numberPlate = vehichleData?.number_plate;

    const { data: maintenanceData, isLoading } = useGetMaintenanceQuery(numberPlate)
    const { ids, entities } = maintenanceData || {};
    const maintenancesArray = ids?.map((id) => entities[id]);

    //const { data: maintenanceData } = useGetMaintenanceQuery(numberPlate);

    console.log('Number Plate', numberPlate)
    //console.log('Maintenance Data',maintenancesArray)

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!maintenanceData) {
        return <div>No data found</div>;
    }

    console.log("Maintenances array:", maintenancesArray)
    const costs = maintenancesArray?.filter((maintenance) => maintenance.fleet.number_plate === numberPlate);

    console.log("costs:", costs)

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


    const navigate = useNavigate();
    const [AppError, setAppError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');


    const filteredData = maintenancesArray?.filter((maintenance) => {
        const cost = maintenance.cost;
        const description = maintenance.description.toLowerCase();
        const date = maintenance.date.toLowerCase()
        const search = searchQuery.toLowerCase();


        if (search) {
            return (
                (cost && cost.toString().includes(search)) ||
                description.includes(search) ||
                date.includes(search)
            )
        } else {
            return maintenancesArray;
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
            head: [["Number Plate", "Driver", "Mileage", "Vehichle Type", "Manufacturer", "Total Maintenance", "Date of Purchase"]],
            body: tableData,
        });
        doc.save("vehicles.pdf");
    };


    return (
        <Layout>
            <div className="content-header">
                <h2 className="content-title">Total Costs For {numberPlate}  {costsPerVehicle[numberPlate]}
                </h2>
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

export default ViewCosts;


