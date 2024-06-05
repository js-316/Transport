import React, { useState } from "react";
import { useDispatch } from "react-redux";
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


const AddServiceReminder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appError, setAppError] = useState(null);

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
      if (parseInt(err.priority) !== err.priority) {
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
                <Link to="/dashboard/service_reminders">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Service Reminders
                </Link>
              </div>
              <h2 className="content-title">
                New Service Reminder</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Service Reminder Information</h4>
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
                      <label className="form-label">Service Task</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Please select"
                          type="text"
                          className={`form-control ${
                            errors.service_task ? "is-invalid" : ""
                          }`}
                          {...register("service_task")}
                        />
                        {errors.service_task && (
                          <div className="invalid-feedback">
                            {errors.service_task?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Time Interval</label>
                      <div className="row gx-2">
                        <div className="col-3">
                          <input
                            type="text"
                            value="Every"
                            disabled
                            className="form-control"
                          />
                        </div>
                        <div className="col-4">
                          <input
                            type="number"
                            min="1"
                            className="form-control"
                            {...register("time_interval")}
                          />
                        </div>
                        <div className="col-5">
                          <select className="form-select" {...register("time_interval")}>
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Time Due Soon</label>
                      <div className="row gx-2">
                        <div className="col-4">
                          <input
                            type="number"
                            min="1"
                            className="form-control"
                            {...register("time_due_soon")}
                          />
                        </div>
                        <div className="col-8">
                          <select className="form-select" {...register("time_due_soon")}>
                            <option value="days">Day(s)</option>
                            <option value="months">Month(s)</option>
                            <option value="years">Year(s)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Watcher To be Notified</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Select Watcher"
                          type="text"
                          className={`form-control ${
                            errors.watcher ? "is-invalid" : ""
                          }`}
                          {...register("watcher")}
                        />
                        {errors.watcher && (
                          <div className="invalid-feedback">
                            {errors.watcher?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                  
                  
                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Save Service Reminder"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddServiceReminder;

