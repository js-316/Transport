import React, { useState } from "react";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { useNavigate, Link} from "react-router-dom";
import { maintenanceSchema } from "../util/validations";
import { useAddMaintenanceMutation } from "../features/maintenance/maintenanceApiSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import errorParser from "../util/errorParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
Link

const AddMaintenance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Maintenance
                </Link>
              </div>
              <h2 className="content-title">
                Add Maintenance</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Maintenance Information</h4>
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
                          placeholder="Select Driver"
                          className={`form-control ${
                            errors.fleet ? "is-invalid" : ""
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
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Completion Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          className={`form-control ${
                            errors.completion_date ? "is-invalid" : ""
                          }`}
                          {...register("completion_date")}
                        />
                        {errors.completion_date && (
                          <div className="invalid-feedback">
                            {errors.completion_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Service tasks</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Service Task"
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
                  
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Cost</label>
                      <div className="row gx-2">
                        <input
                          placeholder="40,000"
                          type="number"
                          className={`form-control ${
                            errors.cost ? "is-invalid" : ""
                          }`}
                          {...register("cost")}
                        />
                        {errors.cost && (
                          <div className="invalid-feedback">
                            {errors.cost?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                        <label className="form-label">Photos</label>
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
                        <div className="col-lg-4">
                            <div className="mb-4">
                        <label className="form-label">Document</label>
                        <div className="row gx-2">
                            <input
                             type="file"
                            accept=".pdf, .doc, .docx, .txt"
                            className="form-control"
                            {...register("document")}
                            />
                                {errors.document && (
                                <div className="invalid-feedback">
                                {errors.document?.message}
                                </div>
                                     )}
                                </div>
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

                </div>
                <button className="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Add Maintenance"}
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