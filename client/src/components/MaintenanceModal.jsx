import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
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


function MaintenanceModal({ id, title }) {
  const { data: maintenanceData, refetch } = useGetMaintenanceQuery();
  const { data: repair } = useGetMaintenanceByIdQuery(id);
  //console.log("Repair data", repair);


  const { data: users } = useGetUsersQuery()
  //console.log("Users", users)
  const { ids, entities } = users || {};
  const usersArray = ids?.map((id) => entities[id]).filter((user) => user.is_engineer);

  const { data: vehichle } = useGetVehichlesQuery();


  const [show, setShow] = useState(false);
  // const [approveRepair, { isLoading: isApproving }] = useApproveRepairMutation();
  // const [CompleteRepair, { isLoading: isCompleteing }] = useCompletedRepairMutation();

  const [assignRepair, { isLoading: isAssigning }] = useAssignRepairMutation();

  const [assignedEngineer, setAssignedEngineer] = useState("")
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
      const result = await CompleteRepair(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Error Completed repair:", error);
    }
  };


  const handleAssign = async () => {
    try {
      console.log("Assigning repair to engineer:", assignedEngineer);
      const result = await assignRepair({ id, engineerId: assignedEngineer }).unwrap();
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
                  <th>Number Plate</th>
                  <td>{repair.fleet.number_plate}</td>
                </tr>
                <tr>
                  <th>Driver</th>
                  <td>{repair.driver}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{repair.description}</td>
                </tr>
                <tr>
                  <th>Describe</th>
                  <td>{repair.describe}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{repair.date}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{repair.status}</td>
                </tr>
                <tr>
                  <th>Logo</th>
                  <td>
                    <img src={logo} alt="Logo" className="logo-image" />
                  </td>
                </tr>
                <tr>
                  <th>Assign Engineer</th>
                  <td>
                    <select
                      value={assignedEngineer}
                      onChange={(e) => {
                        setAssignedEngineer(e.target.value)
                        const selectedEngineer = usersArray.find((user) => user.id === e.target.value);
                        setAssignedEngineer(selectedEngineer.id);
                      }}
                    >

                      <option value="">Select Engineer</option>
                      {usersArray.map((user) => (
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
                <tr>
                  <th>Actions</th>
                  <td>
                    {/* <button
                      onClick={() => handleApprove(repair.id)}
                      className="btn btn-sm rounded btn-gray mx-1"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} title="Approve" />
                    </button>
                    <button
                      onClick={() => handleComplete(repair.id)}
                      className="btn btn-sm rounded btn-success mx-1"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} title="Complete" />
                    </button> */}
                    <button
                      onClick={() => handleAssign(repair.id, assignedEngineer)}
                      className="btn btn-sm rounded btn-primary mx-1"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} title="Assign To" />
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
