import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useGetJobcardByIdQuery } from "../features/jobcard/jobcardApiSlice";

function JobcardModal({ id }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { data: jobcard, isLoading: JobcardLoading } =
    useGetJobcardByIdQuery(id);

  return (
    <>
      <button onClick={handleShow} className="btn btn-sm rounded btn-blue mx-1">
        <FontAwesomeIcon icon={faEye} title="View" icon-size="sm" />
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Job Card</Modal.Title>
          <button className="btn btn-success mx-2 ml-4">Export to PDF</button>
        </Modal.Header>
        <Modal.Body>
          {jobcard && (
            <table className="table table-striped table-bordered table-hover">
              <tbody>
                <tr>
                  <th>Machine Name</th>
                  <td>{jobcard.machine_name}</td>
                </tr>
                <tr>
                  <th>Operator</th>
                  <td>{jobcard.jobcard_plate.driver.name}</td>
                </tr>
                <tr>
                  <th>Issued By</th>
                  <td>{jobcard.repair.assigned_engineer.username}</td>
                </tr>
                <tr>
                  <th>Number Plate</th>
                  <td>{jobcard.jobcard_plate.number_plate}</td>
                </tr>
                <tr>
                  <th>Mileage</th>
                  <td>{jobcard.jobcard_plate.mileage}</td>
                </tr>
                <tr>
                  <th>Date Created</th>
                  <td>{jobcard.date_of_jobcard}</td>
                </tr>
                <tr>
                  <th>Needed Parts</th>
                  <td>{}</td>
                </tr>
                <tr>
                  <th>Remarks</th>
                  <td>Urgent</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div className="d-flex justify-content-between ">
                      <div>
                        <input type="checkbox" className="mb-2" />
                        <label htmlFor="check1" className="mr-4">
                          C.T.O
                        </label>
                      </div>
                      <div>
                        <input type="checkbox" className="mb-2" />
                        <label htmlFor="check1" className="mr-4">
                          H.R
                        </label>
                      </div>
                      <div>
                        <input type="checkbox" id="" className="mb-2" />
                        <label htmlFor="check1" className="mr-4"></label>
                      </div>
                      <div>
                        <input type="checkbox" className="mb-2" />
                        <label htmlFor="check1" className="mr-4">
                          Label 1
                        </label>
                        <div></div>
                        <input type="checkbox" className="mb-2" />
                        <label htmlFor="check1" className="mr-4">
                          Label 1
                        </label>
                      </div>
                    </div>
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

export default JobcardModal;
