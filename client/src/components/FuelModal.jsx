import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import {
  faCheckCircle,
  faEye,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import {
  useApproveFuelMutation,
  useGetFuelByIdQuery,
  useGetFuelQuery,
  useRejectFuelMutation,
} from "../features/fuel/fuelApiSlice";

function FuelModal({ id, columns, title }) {
  const { data, refetch } = useGetFuelQuery();
  const { data: fuel } = useGetFuelByIdQuery(id);
  const { data: vehichle } = useGetVehichlesQuery();

  const [show, setShow] = useState(false);
  const [approveFuel, { isLoading: isApproving }] = useApproveFuelMutation();
  const [rejectFuel, { isLoading: isRejecting }] = useRejectFuelMutation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleApprove = async (id) => {
    try {
      const result = await approveFuel(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Error approving fuel:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await rejectFuel(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Error rejecting fuel:", error);
    }
  };

  const getStatusStyle = (st) => {
    if (st === "pending") {
      return { color: "orange", fontWeight: "bold" };
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
    <>
      <button onClick={handleShow} className="btn btn-sm rounded btn-blue mx-1">
        <FontAwesomeIcon icon={faEye} title="View" size="sm" />
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fuel && (
            <table className="table table-striped table-bordered table-hover vertical-table">
              <tbody>
                <tr>
                  <th>Number Plate</th>
                  <td>{fuel.fuel_plate.number_plate}</td>
                </tr>
                <tr>
                  <th>Driver Requesting Fuel</th>
                  <td>{fuel.user.username}</td>
                </tr>
                <tr>
                  <th>Fuel Station</th>
                  {/* <td>{fuel.fuel_station.supplier_name} {fuel.fuel_station.loading_point}</td> */}
                  
                </tr>
                <tr>
                  <th>Fuel Type</th>
                  <td>{fuel.fuel_type}</td>
                </tr>
                <tr>
                  <th>Mileage</th>
                  <td>{fuel.mileage}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>{fuel.amount}</td>
                </tr>
                <tr>
                  <th>Date of Fueling</th>
                  <td>{fuel.date_of_fueling}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td style={getStatusStyle(fuel.status)}>{fuel.status}</td>
                </tr>
                <tr>
                  <th>Actions</th>
                  <td>
                    <button
                      onClick={() => handleApprove(fuel.id)}
                      className="btn btn-sm rounded btn-success mx-1"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} title="Approve" />
                    </button>
                    <button
                      onClick={() => handleReject(fuel.id)}
                      className="btn btn-sm rounded btn-danger"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} title="Reject" />
                    </button>
                  </td>
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

export default FuelModal;
