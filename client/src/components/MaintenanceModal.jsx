import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  useApproveRepairMutation,
  useGetMaintenanceByIdQuery,
  useGetMaintenanceQuery,
  useCompletedRepairMutation,
  useAssignRepairMutation,
} from "../features/maintenance/maintenanceApiSlice";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import logo from "../assets/soliton.png";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { useGetUsersQuery } from "../features/user/userApiSlice";
import { Link } from "react-router-dom";

function MaintenanceModal({ id, title }) {
  const { data: maintenanceData, refetch } = useGetMaintenanceQuery();
  const { data: repair } = useGetMaintenanceByIdQuery(id);

  const user = useSelector(selectUser);

  const { data: users } = useGetUsersQuery();
  console.log(users);
  const { ids, entities } = users || {};
  const usersArray = ids
    ?.map((id) => entities[id])
    .filter((user) => user.is_engineer);

  const { data: vehichle } = useGetVehichlesQuery();

  const [show, setShow] = useState(false);
  // const [approveRepair, { isLoading: isApproving }] = useApproveRepairMutation();
  // const [CompleteRepair, { isLoading: isCompleteing }] = useCompletedRepairMutation();

  const [assignRepair, { isLoading: isAssigning }] = useAssignRepairMutation();
  const [completeRepair, { isLoading: isCompleteing }] =
    useCompletedRepairMutation();

  const [assignedEngineer, setAssignedEngineer] = useState(null);
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

  const handleComplete = async (id) => {
    try {
      const result = await completeRepair(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Error Completed repair:", error);
    }
  };

  const handleAssign = async () => {
    try {
      console.log("Assigning repair to engineer:", assignedEngineer);
      const result = await assignRepair({
        id,
        engineerId: assignedEngineer,
      }).unwrap();
      console.log("Assign result:", result);
    } catch (error) {
      console.error("Error assigning repair:", error);
    }
  };

  return (
    <>
      <button onClick={handleShow} className="btn btn-sm rounded btn-blue mx-1">
        <FontAwesomeIcon icon={faEye} title="View" iconSize="sm" />
      </button>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {repair && (
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Number Plate</th>
                  <td>{repair.fleet.number_plate}</td>
                </tr>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Driver</th>
                  <td>{repair.driver}</td>
                </tr>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Description</th>
                  <td>{repair.description}</td>
                </tr>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Describe</th>
                  <td>{repair.describe}</td>
                </tr>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Date</th>
                  <td>{repair.date}</td>
                </tr>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Status</th>
                  <td>{repair.status}</td>
                </tr>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Logo</th>
                  <td>
                    <img src={logo} alt="Logo" className="logo-image" />
                  </td>
                </tr>
                {user?.is_staff ? (
                  <>
                    <tr>
                      <th>Assign Engineer</th>
                      <td>
                        <select
                          value={assignedEngineer?.id}
                          onChange={(e) => {
                            setAssignedEngineer(e.target.value);
                            const selectedEngineer = usersArray.find(
                              (user) => user.id === e.target.value
                            );
                            setAssignedEngineer(selectedEngineer.id);
                          }}
                        >
                          <option value="">Select Engineer</option>
                          {usersArray?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th>Assigned Engineer</th>
                      <td>
                        {assignedEngineer ? (
                          <span>{assignedEngineer}</span>
                        ) : (
                          <span>No engineer assigned</span>
                        )}
                      </td>
                    </tr>
                  </>
                ) : null}
                {user?.is_staff || user?.is_engineer ? (
                  <>
                    <tr
                      style={{
                        backgroundColor: "#333",
                        textAlign: "center",
                      }}
                    >
                      <td
                        colSpan="2"
                        style={{ padding: "10px", color: "#fff" }}
                      >
                        ACTIONS
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <div className="d-flex justify-content-between">
                          {user?.is_staff ? (
                            <>
                              <button
                                onClick={() => handleAssign(repair.id)}
                                className="btn btn-sm rounded btn-primary mx-1"
                              >
                                <FontAwesomeIcon
                                  icon={faThumbsUp}
                                  title="Assign To"
                                />

                                {isCompleteing
                                  ? "Assigning To..."
                                  : "Assign To"}
                              </button>
                            </>
                          ) : null}
                          {user?.is_engineer ? (
                            <>
                              <Link
                                to="/dashboard/maintenance/job_card/add"
                                className="btn btn-primary"
                              >
                                <i className="material-icons md-plus"></i>{" "}
                                Create Job Card
                              </Link>

                              <button
                                onClick={() =>
                                  handleComplete(repair.id, assignedEngineer)
                                }
                                className="btn btn-sm rounded btn-primary mx-1"
                              >
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  title="Mark Completed"
                                />

                                {isCompleteing
                                  ? "Completing..."
                                  : "Repair Done"}
                              </button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
         
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MaintenanceModal;
