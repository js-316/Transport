import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link} from "react-router-dom";
import { fuelSchema } from "../util/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { useAddFuelMutation } from "../features/fuel/fuelApiSlice";
import errorParser from "../util/errorParser";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../features/auth/authSlice";


const AddFuel = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appError, setAppError] = useState(null);
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
        project: data.project,
        // user: data.user,
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

  return (
    <Layout>
      <div className="row">
        <div className="col-9">
          <div className="content-header">
            <div>
              <div>
                <Link to="/dashboard/fuel">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />
                  Fuel Requests
                </Link>
              </div>
              <h2 className="content-title">Add Fuel Request</h2>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Fuel Request Information</h4>
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
                      <label className="form-label">Vehichle</label>
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
                  {user?.is_staff ? (
                    <>
                      <div className="col-lg-4">
                        <div className="mb-4">
                          <label className="form-label">Select Driver</label>
                          <div className="row gx-2">
                            <select
                              placeholder="Select Driver"
                              className={`form-control ${
                                errors.driver ? "is-invalid" : ""
                              }`}
                              {...register("driver")}
                            >
                              <option>Select Driver</option>
                              {vehichlesArray?.map((d, index) => (
                                <option key={index} value={d.id}>
                                  {d.number_plate}
                                </option>
                              ))}
                            </select>
                            {errors.driver && (
                              <div className="invalid-feedback">
                                {errors.driver?.message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Fuel Station</label>
                      <div className="row gx-2">
                        <select
                          placeholder="Fuel Station"
                          className={`form-control ${
                            errors.fuel_station ? "is-invalid" : ""
                          }`}
                          {...register("fuel_station")}
                        >
                          <option>Select Fuel Station</option>
                          {vehichlesArray?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.number_plate}
                            </option>
                          ))}
                        </select>
                        {errors.fuel_station && (
                          <div className="invalid-feedback">
                            {errors.fuel_plate?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Project Name</label>
                      <div className="row gx-2">
                      <input
                          placeholder="CSQUARED"
                          type="text"
                          className={`form-control ${
                            errors.project ? "is-invalid" : ""
                          }`}
                          {...register("project")}
                        />
                        {errors.project && (
                          <div className="invalid-feedback">
                            {errors.project?.message}
                          </div>
                        )}
                        {/* <select
                          placeholder="Project"
                          className={`form-control ${
                            errors.project ? "is-invalid" : ""
                          }`}
                          {...register("project")}
                        >
                          <option>Select Project</option>
                          {vehichlesArray?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.number_plate}
                            </option>
                          ))}
                        </select>
                        {errors.project && (
                          <div className="invalid-feedback">
                            {errors.project?.message}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Mileage</label>
                      <div className="row gx-2">
                        <input
                          placeholder="50,000"
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
                      <label className="form-label">Fuel Type</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Petrol"
                          type="text"
                          className={`form-control ${
                            errors.fuel_type ? "is-invalid" : ""
                          }`}
                          {...register("fuel_type")}
                        />
                        {errors.fuel_type && (
                          <div className="invalid-feedback">
                            {errors.fuel_type?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Amount</label>
                      <div className="row gx-2">
                        <input
                          placeholder="50,000"
                          type="number"
                          className={`form-control ${
                            errors.amount ? "is-invalid" : ""
                          }`}
                          {...register("amount")}
                        />
                        {errors.amount && (
                          <div className="invalid-feedback">
                            {errors.amount?.message}
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
                            errors.date_of_fueling ? "is-invalid" : ""
                          }`}
                          {...register("date_of_fueling")}
                          defaultValue={currentDate}
                        />
                        {errors.date_of_fueling && (
                          <div className="invalid-feedback">
                            {errors.date_of_fueling?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Add Fuel"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddFuel;

