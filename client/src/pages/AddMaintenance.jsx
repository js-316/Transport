import React, { useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { maintenanceSchema } from "../util/validations";
import { useAddMaintenanceMutation } from "../features/maintenance/maintenanceApiSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import errorParser from "../util/errorParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../features/auth/authSlice";


const AddMaintenance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser)
  const [appError, setAppError] = useState(null);
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(maintenanceSchema),
  });

  const [addMaintenance, { isLoading, isSuccess }] =
    useAddMaintenanceMutation();

  const { isLoading: loading, data } = useGetVehichlesQuery();

  const { ids, entities } = data || {};

  const vehichlesArray = ids?.map((id) => entities[id]);

  const handleAddMaintenance = async (data) => {
    setAppError(null);
    try {
      const res = await addMaintenance({
        service_task: data.service_task,
        date: data.date,
        cost: data.cost,
        vehichle: data.fleet,
      }).unwrap();
      if (res.maintenance) {
        navigate("/dashboard/maintenance");
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
                <Link to="/dashboard/maintenance">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Repair Requests
                </Link>
              </div>
              <h2 className="content-title">
                Add Repair Request</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Repair Request Information</h4>
            </div>
            <div className="card-body">
              {appError && (
                <div className="alert alert-danger" role="alert">
                  {appError}
                </div>
              )}
              <form
                id="driver_form"
                onSubmit={handleSubmit(handleAddMaintenance)}
              >
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Vehichle</label>
                      <div className="row gx-2">
                        <select
                          placeholder="Select Vehicle"
                          className={`form-control ${errors.fleet ? "is-invalid" : ""
                            }`}
                          {...register("fleet")}
                        >
                          <option>Select Vehicle</option>
                          {vehichlesArray?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.number_plate}
                            </option>
                          ))}
                        </select>
                        {errors.fleet && (
                          <div className="invalid-feedback">
                            {errors.fleet?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {
                    user?.is_staff ? (
                      <>
                        <div className="col-lg-6">
                          <div className="mb-4">
                            <label className="form-label">Driver</label>
                            <div className="row gx-2">
                              <select
                                placeholder="Select Driver"
                                className={`form-control ${errors.fleet ? "is-invalid" : ""
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
                    ) : null
                  }
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Repair Request</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Oil Leak"
                          type="text"
                          className={`form-control ${errors.repair_request ? "is-invalid" : ""
                            }`}
                          {...register("repair_request")}
                        />
                        {errors.repair_request && (
                          <div className="invalid-feedback">
                            {errors.repair_request?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Description</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Oil leaking under the engine"
                          type="text"
                          className={`form-control ${errors.description ? "is-invalid" : ""
                            }`}
                          {...register("description")}
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg">
                    <div className="mb-4">
                      <label className="form-label">Attach Photo</label>
                      <div className="row gx-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          {...register("photo")}
                        />
                        {errors.photo && (
                          <div className="invalid-feedback">
                            {errors.photo?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Request Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          className={`form-control ${errors.request_date ? "is-invalid" : ""
                            }`}
                          {...register("request_date")}
                        />
                        {errors.request_date && (
                          <div className="invalid-feedback">
                            {errors.request_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>



                </div>
                <button className="btn btn-primary" type="submit">
                  {isLoading ? "Requesting..." : "Request Repair"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddMaintenance;