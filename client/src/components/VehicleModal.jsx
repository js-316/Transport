import { useState } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useGetVehichleByIdQuery } from "../features/vehichle/vehicleApiSlice";
import { useGetDriversQuery } from "../features/driver/driverApiSlice";
import { useGetFuelQuery } from "../features/fuel/fuelApiSlice";
import { useGetMaintenanceQuery } from "../features/maintenance/maintenanceApiSlice";
import logo from "../assets/soliton.png";

function VehicleModal({ id, title }) {
  const [show, setShow] = useState(false);

  console.log("vehicle id", id);
  const { data: vehicle, isLoading: vehicleLoading } =
    useGetVehichleByIdQuery(id);
  console.log("vehicle data", vehicle);
  const { data: driver } = useGetDriversQuery();
  const { data: maintenanceData } = useGetMaintenanceQuery();
  const { data: fuelData } = useGetFuelQuery();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const costsPerVehicle = {};
  if (maintenanceData) {
    Object.values(maintenanceData.entities).forEach((entity) => {
      const numberPlate = entity.fleet.number_plate;
      if (!costsPerVehicle[numberPlate]) {
        costsPerVehicle[numberPlate] = 0;
      }
      costsPerVehicle[numberPlate] += entity.cost;
      console.log(`Costs For ${numberPlate} :`, costsPerVehicle[numberPlate]);
    });
  } else {
    console.log("maintenanceData is undefined");
  }

  const fuelPerVehicle = {};
  if (fuelData) {
    Object.values(fuelData.entities).forEach((entity) => {
      const numberPlate = entity.fuel_plate.number_plate;
      if (!fuelPerVehicle[numberPlate]) {
        fuelPerVehicle[numberPlate] = 0;
      }
      fuelPerVehicle[numberPlate] += entity.amount;
      console.log(`Fuel For ${numberPlate} :`, fuelPerVehicle[numberPlate]);
    });
  } else {
    console.log("fuelData is undefined");
  }

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
          {vehicle && (
            <table className="table table-striped table-bordered table-hover">
              <tbody>
                <tr>
                  <th>Number Plate</th>
                  <td>{vehicle.number_plate}</td>
                </tr>
                <tr>
                  <th>Driver</th>
                  <td>{vehicle.driver.name}</td>
                </tr>
                <tr>
                  <th>Manufacturer</th>
                  <td>{vehicle.manufacturer}</td>
                </tr>
                <tr>
                  <th>Vehicle Type</th>
                  <td>{vehicle.vehichle_type}</td>
                </tr>
                <tr>
                  <th>Fuel Type</th>
                  <td>{vehicle.fuel_type}</td>
                </tr>
                <tr>
                  <th>Date of Purchase</th>
                  <td>{vehicle.date_of_purchase}</td>
                </tr>
                <tr>
                  <th>Maintenance Costs</th>
                  <td>
                    <Link to={`costs_view/${vehicle.id}`}>
                      {costsPerVehicle[vehicle.number_plate] || 0}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>Fuel Amount</th>
                  <td>
                    <Link to={`fuel_view/${vehicle.id}`}>
                      {fuelPerVehicle[vehicle.number_plate] || 0}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>Logo</th>
                  <td>
                    <img src={logo} alt="Logo" className="logo-image" />
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

export default VehicleModal;
