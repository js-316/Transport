import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { faCheckCircle, faEye, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useApproveRepairMutation, useGetMaintenanceByIdQuery, useGetMaintenanceQuery, useRejectRepairMutation } from "../features/maintenance/maintenanceApiSlice";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import logo from "../assets/soliton.png";


function MaintenanceModal({ id, columns, title }) {
    const { data: maintenanceData, refetch} = useGetMaintenanceQuery()
    const { data: repair } = useGetMaintenanceByIdQuery(id)
    console.log("Repair data", repair)

    const { data: vehichle } = useGetVehichlesQuery()

    const [show, setShow] = useState(false);
    const [approveRepair, { isLoading: isApproving }] = useApproveRepairMutation();
    const [rejectRepair, { isLoading: isRejecting }] = useRejectRepairMutation();

    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleApprove = async (id) => {
        try {
            const result = await approveRepair(id).unwrap();
            refetch();
        } catch (error) {
            console.error("Error approving repair:", error);
        }
    };

    const handleReject = async (id) => {
        try {
            const result = await rejectRepair(id).unwrap();
            refetch();
        } catch (error) {
            console.error("Error rejecting repair:", error);
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
                    {repair && (
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
                                    <td>{repair.fleet.number_plate}</td>
                                    <td>{repair.driver}</td>
                                    <td>{repair.description}</td>
                                    <td>{repair.describe}</td>
                                    <td>{repair.date}</td>
                                    <td>{repair.status}</td>
                                    <td><img src={logo} alt="Logo" className="logo-image" /></td>
                                    <td>
                                        <button
                                            onClick={() => handleApprove(repair.id)}
                                            className="btn btn-sm rounded btn-success mx-1"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                title="Approve"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleReject(repair.id)}
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

export default MaintenanceModal;