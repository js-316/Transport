import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useGetVehichleByIdQuery } from "../features/vehichle/vehicleApiSlice";
function VehicleModal({ id ,title, columns }) {
  const [vehicleDetails, setVehicleDetails] = useState({});

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const { id: vehicleId } = useParams(); // Extract vehicle ID from URL params
  const [vehicleList, setVehicleList] = useState([]);
  const {
    data: vehicle,
    error,
    isLoading,
  } = useGetVehichleByIdQuery(vehicleId);

  const Fetchdata = async () => {
    try {
      if (vehicle) {
        setVehicleList((prevList) => [...prevList,vehicleId]);
      }
    } catch (error) {
      const parsedError = errorParser(error?.data);
      setAppError(
        parsedError || "An error occurred while updating the vehichle."
      );
    }
  };

  if (isLoading) {
    return <div>Loading....</div>;
  }
  if (!vehicle) {
    return <div>No vehicle</div>;
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching vehicle data</p>}

      <button
        onClick={() => {
          Fetchdata();
          handleShow();
        }}
        className="btn btn-sm rounded btn-blue mx-1"
      >
        <FontAwesomeIcon icon={faEye} title="View" icon-size="sm" />
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table striped bordered hover">
            <thead className="table-dark">
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicleList.map((row, id) => (
                <tr key={id}>
                  {columns.map((column, id) => (
                    <td key={id}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

export default VehicleModal;
