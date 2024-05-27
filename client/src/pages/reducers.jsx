import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
  useGetFuelQuery,
  useImportFuelMutation,
  useDeleteFuelMutation,
} from "../features/fuel/fuelApiSlice";
import TableLoader from "../components/TableLoader";
import errorParser from "../util/errorParser";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";


const Fuel = () => {
  const [importError, setImportError] = useState(null);
  const [AppError, setAppError] = useState(null);
  const { isLoading, data, refetch } = useGetFuelQuery();
  const [importFuel, { isLoading: isImporting }] =
    useImportFuelMutation();

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    //track the number of items to display per page (dataPerPage) 
    //another to track the currently active page 
  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  //extract ids and entities from data object with an empty fallback if data is falsy
  const { ids, entities } = data || {};

  //It constructs an array of fuel(fuelArray) based on the IDs
  // and their corresponding details.
  const fuelArray = ids?.map((id) => entities[id]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  
  //slices the vehichlesArray to extract the subset of data to be displayed on the current page.
  const currentData = fuelArray?.slice(indexOfFirstData, indexOfLastData);

  // handle pagination navigation, allowing users to switch between different pages of data.
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDataPerPage = (e) => {
    e.target.value < 10 ? setDataPerPage(10) : setDataPerPage(e.target.value);
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
            // handle error message overflow
            minWidth: "300px",
            height: "auto",
          },
        });
      }
    }
  };

  const [deleteFuel, {isLoading: isDeleting}] = useDeleteFuelMutation();
  const handleDeleteFuel = async(id) => {
    setAppError(null);
    try{
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this",
        icon: 'warning',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        confirmButtonText: "Yes I'm sure",
      });
      if(result.isConfirmed){
        const res = await deleteFuel(id).unwrap();
        refetch();
      }
    }catch (err) {
      console.error("Error deleting Fuel:", err);
      if (parseInt(err.status) !== err.status) {
        setAppError("Network Error");
      } else {
        const parsedError = errorParser(err?.data);
        setAppError(err?.data?.message || parsedError);
      }
    }

  };

  return (
    <Layout>
      <div className="content-header">
        <h2 className="content-title">Fuel List</h2>
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
            <i className="material-icons md-plus"></i> Add Fuel Record
          </Link>
          <input
            type="file"
            accept=".csv"
            ref={uploadRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>
      </div>
      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
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
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Fuel Type</th>
                <th>Number Plate</th>
                <th>Mileage</th>
                <th>Amount</th>
                <th>Date of Fueling</th>
                <th className="text-end"> Action </th>
              </tr>
            </thead>
            
            {/* //If isLoading is true, it renders a loading indicator 
            //(in this case, a TableLoader component repeated five times).
            //If isLoading is false, meaning the data has been loaded, 
            //this line maps over the currentData */}
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <TableLoader key={i} count={6} />)
                : currentData?.map((d, index) => (
                    <tr key={index}>
                      <td>{d.fuel_type}</td>
                      <td>{d.fuel_plate.number_plate}</td>
                      <td>{d.mileage}</td>
                      <td>{d.amount}</td>
                      <td>{d.date_of_fueling}</td>
                      <td className="text-end">
                      {/* //dynamically inserting the fuel ID (f.id) into the URL. */}
                        <Link
                          to={`edit/${d.id}`}
                          className="btn btn-sm font-sm rounded btn-brand mx-4"
                        >
                          <i className="material-icons md-edit"></i>
                          Edit
                        </Link>
                        <button 
                        onClick={() => handleDeleteFuel(d.id)}
                        className="btn btn-sm font-sm rounded btn-danger">
                          <i className="material-icons md-delete"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination-area mt-30 mb-50">
        <nav aria-label="Page navigation example">
          <Pagination
            totalData={fuelArray?.length}
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
