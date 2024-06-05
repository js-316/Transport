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


const AddPart = () => {
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
        vehichle: data.name,
        amount: data.amount,
        date_of_fueling: data.date_of_fueling,
        fuel_type: data.fuel_type,
        mileage: data.mileage,
      }).unwrap();
      if (res.fuel) {
        navigate("/dashboard/fuel");
      }
    } catch (err) {
      if (parseInt(err.type) !== err.type) {
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
                <Link to="/dashboard/parts">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Parts
                </Link>
              </div>
              <h2 className="content-title">
                New Part</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Part Information</h4>
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
                      <label className="form-label">Part Number</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Part identifier"
                          type="number"
                          className={`form-control ${
                            errors.part_number ? "is-invalid" : ""
                          }`}
                          {...register("part_number")}
                        />
                        {errors.part_number && (
                          <div className="invalid-feedback">
                            {errors.part_number?.message}
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
                        <label className="form-label">Photo</label>
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
                        
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Category</label>
                      <div className="row gx-2">
                        <input
                          placeholder="e.g Belts,Tires,Fluids"
                          type="text"
                          className={`form-control ${
                            errors.category ? "is-invalid" : ""
                          }`}
                          {...register("category")}
                        />
                        {errors.category && (
                          <div className="invalid-feedback">
                            {errors.category?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Manufacturer Part #</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Manufacturer Identifier"
                          type="number"
                          className={`form-control ${
                            errors.manufacturer_part_number ? "is-invalid" : ""
                          }`}
                          {...register("manufacturer_part_number")}
                        />
                        {errors.manufacturer_part_number && (
                          <div className="invalid-feedback">
                            {errors.manufacturer_part_number?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Unit Cost</label>
                      <div className="row gx-2">
                        <input
                          placeholder="100,000"
                          type="number"
                          className={`form-control ${
                            errors.unit_cost ? "is-invalid" : ""
                          }`}
                          {...register("unit_cost")}
                        />
                        {errors.unit_cost && (
                          <div className="invalid-feedback">
                            {errors.unit_cost?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
                  
                  
                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Add Part"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPart;

