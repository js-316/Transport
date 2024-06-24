import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { faCheckCircle, faEye, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import logo from "../assets/soliton.png";
import { useApproveFuelMutation, useGetFuelByIdQuery, useGetFuelQuery, useRejectFuelMutation } from "../features/fuel/fuelApiSlice";


function FuelModal({ id, columns, title }) {
    const { data ,refetch} = useGetFuelQuery()
    const { data: fuel} = useGetFuelByIdQuery(id)
    

    const { data: vehichle } = useGetVehichlesQuery()

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
    

    return (
        <>
            <button
                onClick={handleShow}
                className="btn btn-sm rounded btn-blue mx-1"
            >
                <FontAwesomeIcon icon={faEye} title="View" icon-size="sm" />
            </button>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fuel && (
                        <table className="table striped bordered hover">
                            <thead className="table-dark">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th key={index}>{column}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{fuel.fuel_plate.number_plate}</td>
                                    <td>{fuel.user.username}</td>
                                    <td>{fuel.fuel_station}</td>
                                    <td>{fuel.fuel_type}</td>
                                    <td>{fuel.mileage}</td>
                                    <td>{fuel.amount}</td>
                                    <td>{fuel.date_of_fueling}</td>
                                    <td>{fuel.status}</td>
                                    <td>
                                        <button
                                            onClick={() => handleApprove(fuel.id)}
                                            className="btn btn-sm rounded btn-success mx-1"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                title="Approve"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleReject(fuel.id)}
                                            className="btn btn-sm rounded btn-danger"
                                        >
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                title="Reject"
                                            />
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