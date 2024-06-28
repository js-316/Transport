import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useGetJobcardByIdQuery } from "../features/jobcard/jobcardApiSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../assets/soliton.png";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

function JobcardModal({ id }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user = useSelector(selectUser);

  const { data: jobcard, isLoading: JobcardLoading } =
    useGetJobcardByIdQuery(id);
  console.log(jobcard);

  const exportToPDF = () => {
    const input = document.getElementById("jobcard-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("jobcard.pdf");
    });
  };

  const isDisabledProcurement =
    user?.is_chief_executive_officer ||
    user?.is_driver ||
    user?.is_engineer ||
    user?.is_human_resource_manager ||
    user?.is_chief_transport_officer;

    const isDisabledHumanResourceApproval =
      user?.is_chief_executive_officer ||
      user?.is_driver ||
      user?.is_engineer ||
      user?.is_procurement_manager ||
      user?.is_chief_transport_officer;

      const isDisabledCTOApproval =
        user?.is_chief_executive_officer ||
        user?.is_driver ||
        user?.is_engineer ||
        user?.is_procurement_manager ||
        user?.is_human_resource_manager;

  return (
    <>
      <button onClick={handleShow} className="btn btn-sm rounded btn-blue mx-1">
        <FontAwesomeIcon icon={faEye} title="View" icon-size="sm" />
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Job Card</Modal.Title>
          <button
            className="btn btn-success mx-2 ml-4 print"
            onClick={exportToPDF}
          >
            Export to PDF
          </button>
        </Modal.Header>
        <Modal.Body>
          {jobcard && (
            <div
              id="jobcard-content"
              style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                border: "1px solid #000",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <img src={logo} alt="Logo" style={{ height: "50px" }} />
                </div>
                <div>
                  <div>RECORD NAME: WORKSHOP - JOB CARD</div>
                  <div>RECORD REF: LOG/FM/041</div>
                  <div>ISSUE/REV: 1/0</div>
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      REG. NO:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {jobcard.jobcard_plate.number_plate}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      DATE:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {jobcard.date_of_jobcard}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      MILEAGE:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {jobcard.jobcard_plate.mileage}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      MACHINE NAME:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {jobcard.machine_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      NEXT SERVICE:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      N/A
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      SERVICE DONE:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      N/A
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid #000", padding: "5px" }}
                    >
                      <div>WORK TO BE DONE:</div>
                      <div>{jobcard.repair.description || "N/A"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid #000", padding: "5px" }}
                    >
                      <div>PARTS NEEDED:</div>
                      <div>{jobcard.parts_needed || "N/A"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid #000", padding: "5px" }}
                    >
                      <div>REMARKS:</div>
                      <div>{jobcard.remarks || "N/A"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid #000", padding: "5px" }}
                    >
                      <div>REQUESTED BY (MECHANIC):</div>
                      <div>
                        Name:{" "}
                        {jobcard.repair.assigned_engineer.username || "N/A"}{" "}
                      </div>
                    </td>
                  </tr>

                  <tr
                    className="approval-row"
                    style={{
                      backgroundColor: "#333",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    <td colSpan="4" style={{ padding: "10px" }}>
                      APPROVALS
                    </td>
                  </tr>
                  <tr className="checkbox-row">
                    <td colSpan="4" style={{ padding: "10px" }}>
                      <div className="d-flex justify-content-between">
                        <label>
                          <input
                            type="checkbox"
                            id="cto"
                            disabled={isDisabledCTOApproval}
                          />
                          C.T.O
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            id="hr"
                            disabled={isDisabledHumanResourceApproval}
                          />{" "}
                          H.R
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            id="PartlyProcured"
                            disabled={isDisabledProcurement}
                          />
                          Partially Procured
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            id="FullyProcured"
                            disabled={isDisabledProcurement}
                          />
                          Fully Procured
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
