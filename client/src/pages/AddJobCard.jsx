import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fuelSchema } from "../util/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { useAddFuelMutation } from "../features/fuel/fuelApiSlice";
import errorParser from "../util/errorParser";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import DynamicTable from "../components/DynamicTable";

const AddJobCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appError, setAppError] = useState(null);
  const [addedVehicles, setAddedVehicles] = useState([]);
  // Initialize the current date
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(fuelSchema),
  });

  const { isLoading: loading, data } = useGetVehichlesQuery();

  const [addFuel, { isLoading, isSuccess }] = useAddFuelMutation();

  const { ids, entities } = data || {};

  const vehichlesArray = ids?.map((id) => entities[id]);

  const handleAddFuel = async (data) => {
    setAppError(null);
    try {
      const res = await addFuel({
        vehichle: data.fuel_plate,
        amount: data.amount,
        date_of_fueling: data.date_of_fueling,
        fuel_type: data.fuel_type,
        mileage: data.mileage,
      }).unwrap();
      if (res.fuel) {
        navigate("/dashboard/fuel");
      }
    } catch (err) {
      if (parseInt(err.status) !== err.status) {
        setAppError("Network Error");
      } else {
        const parsedError = errorParser(err?.data);
        setAppError(err?.data?.message || parsedError);
      }
    }
  };

  const { errors } = formState;

  const { watch } = useForm();

  const handleAddPart = () => {
    // const vehicleId = watch('vehicle_id');
    // console.log('vehicleId:', vehicleId);
    // const quantity = watch('quantity');
    // const vehicle = vehichlesArray.find((vehicle) => vehicle.id === vehicleId);
    // console.log('Vehicles',vehicle)
    // if (vehicle) {
    //   const newVehicle = { name: vehicle.number_plate, quantity: parseInt(quantity) };
    //   setAddedVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    // } else {
    //   console.error(`Vehicle with ID ${vehicleId} not found`);
    // }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-9">
          <div className="content-header">
            <div>
              <div>
                <Link to="/dashboard/maintenance/work_order">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />
                  Job Cards
                </Link>
              </div>
              <h2 className="content-title">New Job Card</h2>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Job Card Information</h4>
            </div>
            <div className="card-body">
              {appError && (
                <div className="alert alert-danger" role="alert">
                  {appError}
                </div>
              )}

              <form id="fuel_form" onSubmit={handleSubmit(handleAddFuel)}>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Vehicle</label>
                      <div className="row gx-2">
                        <select
                          placeholder="Select Vehichle"
                          className={`form-control ${
                            errors.fuel_plate ? "is-invalid" : ""
                          }`}
                          {...register("fuel_plate")}
                        >
                          <option>Select Vehicle</option>
                          {vehichlesArray?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.number_plate}
                            </option>
                          ))}
                        </select>
                        {errors.fuel_plate && (
                          <div className="invalid-feedback">
                            {errors.fuel_plate?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Work To Be Done</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Repair Request"
                          type="text"
                          className={`form-control ${
                            errors.work_to_be_done ? "is-invalid" : ""
                          }`}
                          {...register("work_to_be_done")}
                        />
                        {errors.work_to_be_done && (
                          <div className="invalid-feedback">
                            {errors.work_to_be_done?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Mileage</label>
                      <div className="row gx-2">
                        <input
                          placeholder="30,000"
                          type="number"
                          className={`form-control ${
                            errors.mileage ? "is-invalid" : ""
                          }`}
                          {...register("mileage")}
                        />
                        {errors.mileage && (
                          <div className="invalid-feedback">
                            {errors.mileage?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Machine Name</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Machine Name"
                          type="text"
                          className={`form-control ${
                            errors.machine_name ? "is-invalid" : ""
                          }`}
                          {...register("machine_name")}
                        />
                        {errors.machine_name && (
                          <div className="invalid-feedback">
                            {errors.machine_name?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.date ? "is-invalid" : ""
                          }`}
                          {...register("date")}
                          defaultValue={currentDate}
                        />
                        {errors.date && (
                          <div className="invalid-feedback">
                            {errors.date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Requester Signature</label>
                      <input
                        type="text"
                        placeholder="Sign with name e.g dean"
                        className="form-control"
                        {...register("requester_signature")}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Comments</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Add Optional comment here"
                          type="text"
                          className={`form-control ${
                            errors.comments ? "is-invalid" : ""
                          }`}
                          {...register("comments")}
                        />
                        {errors.comments && (
                          <div className="invalid-feedback">
                            {errors.comments?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Parts</label>
                      <DynamicTable />
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Save Job Card"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddJobCard;
