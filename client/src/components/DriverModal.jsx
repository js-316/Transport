import { useState } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { useGetDriverByIdQuery, useGetDriversQuery } from "../features/driver/driverApiSlice";
import { useGetFuelQuery } from "../features/fuel/fuelApiSlice";
import { useGetMaintenanceQuery } from "../features/maintenance/maintenanceApiSlice";
import logo from "../assets/soliton.png";
function DriverModal({ id, title }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //console.log("driver id", id);
  const { data: driver, isLoading: DriverLoading } =
    useGetDriverByIdQuery(id);
  console.log("Driver data", driver);

  return (
    <>
      <button onClick={handleShow} className="btn btn-sm rounded btn-blue mx-1">
        <FontAwesomeIcon icon={faEye} title="View" icon-size="sm" />
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           {driver && (
            <table className="table table-striped table-bordered table-hover">
              <tbody>
                <tr>
                  <th>Driver Name</th>
                  <td>{driver.name}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>{driver.phone_number}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>{driver.age}</td>
                </tr>
                <tr>
                  <th>Date Hired</th>
                  <td>{driver.date_hired}</td>
                </tr>
                <tr>
                  <th>License Number</th>
                  <td>#Permit</td>
                </tr>
                <tr>
                  <th>License Issue Date</th>
                  <td>MD</td>
                </tr>
                <tr>
                  <th>License Expire Date</th>
                  <td>EXP</td>
                </tr>
              </tbody>
            </table> 
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DriverModal;
