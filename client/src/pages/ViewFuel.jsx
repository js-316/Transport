import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
  useGetVehichleByIdQuery,
  useGetVehichlesQuery,
} from "../features/vehichle/vehicleApiSlice";
import { useGetFuelQuery } from "../features/fuel/fuelApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/soliton.png";
import { number } from "yup";

const ViewFuel = () => {
  const { id } = useParams();
  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();
  const [AppError, setAppError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehichleData } = useGetVehichleByIdQuery(id);
  const numberPlate = vehichleData?.number_plate;

  const { data: fuelData, isLoading } = useGetFuelQuery(numberPlate);
  const { ids, entities } = fuelData || {};
  const fuelArray = ids?.map((id) => entities[id]);

  console.log("Number Plate", numberPlate);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!fuelData) {
    return <div>No data found</div>;
  }

  console.log("Fuel array:", fuelArray);
  const fuelList = fuelArray?.filter(
    (fuel) => fuel.fuel_plate.number_plate === numberPlate
  );

  console.log("Fuel List:", fuelList);

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

  const filteredData = fuelArray?.filter((fuel) => {
    const fuel_type = fuel.fuel_type.toLowerCase();
    const fuel_plate = fuel.fuel_plate.number_plate.toLowerCase();
    const mileage = fuel.mileage;
    const amount = fuel.amount;
    const date_of_fueling = fuel.date_of_fueling.toLowerCase();
    const search = searchQuery.toLowerCase();

    if (search) {
      return (
        fuel_type.includes(search) ||
        fuel_plate.includes(search) ||
        (mileage && mileage.toString().includes(search)) ||
        (amount && amount.toString().includes(search)) ||
        date_of_fueling.includes(search)
      );
    } else {
      return fuelArray;
    }
  });

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
    doc.addImage(logo, "PNG", 10, 10, 20, 20);

    // Add header text
    doc.text(`Soliton Telmec`, 40, 15);
    doc.text(`Address: Bugolobi Plot 10, Mizindalo Road`, 40, 20);
    doc.text(`Phone: +256 700 777 003`, 40, 25);
    doc.text(`Email: info@soliton.co.ug`, 40, 30);

    // Add a newline
    doc.text(`\n`, 10, 35);

    // Add the table
    doc.text(`${numberPlate} Fuel Costs`, 10, 40);
    const tableData = [];
    let totalCost = 0;
    fuelList.forEach((fuel) => {
      tableData.push([
        fuel.fuel_type,
        fuel.mileage,
        fuel.amount,
        fuel.date_of_fueling,
        fuel.usage,
        fuel.volume_unit,
        fuel.costs_per_meter,
        fuel.fuel_capacity_alert,
      ]);
      totalCost += fuel.amount;
    });
    doc.autoTable({
      head: [
        [
          "Fuel Type",
          "Mileage",
          "Amount",
          "Date",
          "Usage",
          "Volume Unit",
          "Costs Per Meter",
          "Fuel Capacity Alert",
        ],
      ],
      body: tableData,
      startY: 50,
    });
    doc.text(`Total: UGX ${totalCost}`, 15, doc.autoTable.previous.finalY + 10);
    doc.save(`Fuel Costs for ${numberPlate}.pdf`);
  };

  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">
          Total Fuel For {numberPlate} {fuelPerVehicle[numberPlate]}
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
                <th>Fuel Type</th>
                <th>Mileage</th>
                <th>Amount</th>
                <th>Date </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <TableLoader key={i} count={6} />)
                : fuelList?.map((fuel, index) => (
                    <tr key={index}>
                      <td>{fuel.fuel_type}</td>
                      <td>{fuel.mileage}</td>
                      <td>{fuel.amount}</td>
                      <td>{new Date(fuel.date_of_fueling).toDateString()}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination-area mt-30 mb-50">
        <nav aria-label="Page navigation example">
          <Pagination
            totalData={currentData?.length}
            dataPerPage={dataPerPage}
            paginate={paginate}
            currentPage={currentPage}
          />
        </nav>
      </div>
    </Layout>
  );
};

export default ViewFuel;
