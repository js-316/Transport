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


const AddWorkOrder = () => {
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

   const assigneesArray = [
     { id: 1, name: "John Doe" },
     { id: 2, name: "Jane Smith" },
     // Add more assignees here
   ];

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

  return (
    <Layout>
      <div className="row">
        <div className="col-9">
        <div className="content-header">
            <div>
              <div>
                <Link to="/dashboard/maintenance/work_order">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Job Cards
                </Link>
              </div>
              <h2 className="content-title">
                New Job Card</h2>
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
                      <label className="form-label">Status</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Open"
                          type="text"
                          className={`form-control ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          {...register("status")}
                        />
                        {errors.status && (
                          <div className="invalid-feedback">
                            {errors.status?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Issue Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.issue_date ? "is-invalid" : ""
                          }`}
                          {...register("issue_date")}
                        />
                        {errors.issue_date && (
                          <div className="invalid-feedback">
                            {errors.issue_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Scheduled Start Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.Scheduled_start_date ? "is-invalid" : ""
                          }`}
                          {...register("sccheduled_start_date")}
                        />
                        {errors.scheduled_start_date && (
                          <div className="invalid-feedback">
                            {errors.scheduled_start_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Expected Completion Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.expected_completion_date ? "is-invalid" : ""
                          }`}
                          {...register("expected_completion_date")}
                        />
                        {errors.expected_completion_date && (
                          <div className="invalid-feedback">
                            {errors.expected_completion_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Assigned To</label>
                      <div className="row gx-2">
                        <select
                          className={`form-control ${
                            errors.assigned_to ? "is-invalid" : ""
                          }`}
                          {...register("assigned_to")}
                        >
                          <option>Select Assignee</option>
                          {assigneesArray?.map((assignee) => (
                            <option key={assignee.id} value={assignee.id}>
                              {assignee.name}
                            </option>
                          ))};
                          </select>
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
                          className={`form-control ${errors.comments ? "is-invalid" : ""
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

export default AddWorkOrder;

