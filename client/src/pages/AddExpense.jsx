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

const AddExpense = () => {
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
                <Link to="/dashboard/vehichles/expenses_history">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Expense Entries
                </Link>
              </div>
              <h2 className="content-title">
                New Expense Entry</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Expense Information</h4>
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
                      <label className="form-label">Expense</label>
                      <div className="row gx-2">
                        <input
                          placeholder="e.g fines, insurance,loan"
                          type="text"
                          className={`form-control ${
                            errors.expense ? "is-invalid" : ""
                          }`}
                          {...register("expense")}
                        />
                        {errors.expense && (
                          <div className="invalid-feedback">
                            {errors.expense?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Amount</label>
                      <div className="row gx-2">
                        <input
                          placeholder="40,000"
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
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          className={`form-control ${
                            errors.date ? "is-invalid" : ""
                          }`}
                          {...register("date")}
                        />
                        {errors.date && (
                          <div className="invalid-feedback">
                            {errors.date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-4">
                      <label className="form-label">Notes</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Service Task"
                          type="text"
                          className={`form-control ${
                            errors.notes ? "is-invalid" : ""
                          }`}
                          {...register("notes")}
                        />
                        {errors.notes && (
                          <div className="invalid-feedback">
                            {errors.notes?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="col-lg-6">
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
                <button className="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Add Expense"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddExpense;