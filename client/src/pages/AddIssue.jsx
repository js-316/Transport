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


const AddIssue = () => {
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
                <Link to="/dashboard/issues">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Issues
                </Link>
              </div>
              <h2 className="content-title">
                New Issue</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Issue Information</h4>
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
                      <label className="form-label">Priority</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Select Priority"
                          type="text"
                          className={`form-control ${
                            errors.priority ? "is-invalid" : ""
                          }`}
                          {...register("priority")}
                        />
                        {errors.priority && (
                          <div className="invalid-feedback">
                            {errors.priority?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Reported Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.reported_date ? "is-invalid" : ""
                          }`}
                          {...register("reported_date")}
                        />
                        {errors.reported_date && (
                          <div className="invalid-feedback">
                            {errors.reported_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Summary</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Summary"
                          type="text"
                          className={`form-control ${
                            errors.summary ? "is-invalid" : ""
                          }`}
                          {...register("summary")}
                        />
                        {errors.summary && (
                          <div className="invalid-feedback">
                            {errors.summary?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Description</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Description"
                          type="text"
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
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
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Reported By</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Select Reported By"
                          type="text"
                          className={`form-control ${
                            errors.reported_by ? "is-invalid" : ""
                          }`}
                          {...register("reported_by")}
                        />
                        {errors.reported_by && (
                          <div className="invalid-feedback">
                            {errors.reported_by?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Assigned To</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Select Assigned to"
                          type="text"
                          className={`form-control ${
                            errors.assigned_to ? "is-invalid" : ""
                          }`}
                          {...register("assigned_to")}
                        />
                        {errors.assigned_to && (
                          <div className="invalid-feedback">
                            {errors.assigned_to?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Due Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.due_date ? "is-invalid" : ""
                          }`}
                          {...register("due_date")}
                        />
                        {errors.due_date && (
                          <div className="invalid-feedback">
                            {errors.due_date?.message}
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
                        <label className="form-label">Documents</label>
                        <div className="row gx-2">
                            <input
                             type="file"
                            accept=".pdf, .doc, .docx, .txt"
                            className="form-control"
                            {...register("documents")}
                            />
                                {errors.documents && (
                                <div className="invalid-feedback">
                                {errors.documents?.message}
                                </div>
                                     )}
                                </div>
                            </div>
                        </div>
                        
                </div>
                  
                  
                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Save Issue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddIssue;

