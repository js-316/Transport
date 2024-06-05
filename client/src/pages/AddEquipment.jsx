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


const AddEquipment = () => {
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
                <Link to="/dashboard/equipment">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Equipment
                </Link>
              </div>
              <h2 className="content-title">
                New Equipment</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Equipment Information</h4>
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
                      <label className="form-label">Name</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Equipment Name"
                          type="text"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          {...register("name")}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Type</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Type"
                          type="text"
                          className={`form-control ${
                            errors.type ? "is-invalid" : ""
                          }`}
                          {...register("type")}
                        />
                        {errors.type && (
                          <div className="invalid-feedback">
                            {errors.type?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Brand</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Brand"
                          type="text"
                          className={`form-control ${
                            errors.brand ? "is-invalid" : ""
                          }`}
                          {...register("brand")}
                        />
                        {errors.brand && (
                          <div className="invalid-feedback">
                            {errors.brand?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Group</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Open"
                          type="text"
                          className={`form-control ${
                            errors.group ? "is-invalid" : ""
                          }`}
                          {...register("group")}
                        />
                        {errors.group && (
                          <div className="invalid-feedback">
                            {errors.group?.message}
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
                    <label className="form-label">Linked Vehichle</label>
                      <div className="row gx-2">
                      <select
                          placeholder="Select Vehichle"
                          className={`form-control ${
                            errors.linked_vehichle ? "is-invalid" : ""
                          }`}
                          {...register("linked_vehichle")}
                        >
                          <option>Select Vehicle</option>
                          {vehichlesArray?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.number_plate}
                            </option>
                          ))}
                        </select>
                        {errors.linked_vehichle && (
                          <div className="invalid-feedback">
                            
                            {errors.linked_vehichle?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Current Assignee</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Current Assignee"
                          type="text"
                          className={`form-control ${
                            errors.current_assignee ? "is-invalid" : ""
                          }`}
                          {...register("current_assignee")}
                        />
                        {errors.current_assignee && (
                          <div className="invalid-feedback">
                            {errors.current_assignee?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="mb-4">
                        <label className="form-label">Profile Photo</label>
                        <div className="row gx-2">
                            <input
                             type="file"
                            accept="image/*"
                            className="form-control"
                            {...register("profile_photo")}
                            />
                                {errors.profile_photo && (
                                <div className="invalid-feedback">
                                {errors.profile_photo?.message}
                                </div>
                                     )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Purchase Vendor</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Purchase Vendor"
                          type="text"
                          className={`form-control ${
                            errors.purchase_vendor ? "is-invalid" : ""
                          }`}
                          {...register("purchase_vendor")}
                        />
                        {errors.purchase_vendor && (
                          <div className="invalid-feedback">
                            {errors.purchase_vendor?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Purchase Price</label>
                      <div className="row gx-2">
                        <input
                          placeholder="350,000"
                          type="number"
                          className={`form-control ${
                            errors.purchase_price ? "is-invalid" : ""
                          }`}
                          {...register("purchase_price")}
                        />
                        {errors.purchase_price && (
                          <div className="invalid-feedback">
                            {errors.purchase_price?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div> 
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Purchase Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2024-03-07"
                          type="date"
                          className={`form-control ${
                            errors.purchase_date ? "is-invalid" : ""
                          }`}
                          {...register("purchase_date")}
                        />
                        {errors.purchase_date && (
                          <div className="invalid-feedback">
                            {errors.purchase_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Warranty Expiration Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2024-03-07"
                          type="date"
                          className={`form-control ${
                            errors.warranty_expiration_date ? "is-invalid" : ""
                          }`}
                          {...register("warranty_expiration_date")}
                        />
                        {errors.warranty_expiration_date && (
                          <div className="invalid-feedback">
                            {errors.warranty_expiration_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Purchase Comments</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Purchase Comments"
                          type="text"
                          className={`form-control ${
                            errors.purchase_comments ? "is-invalid" : ""
                          }`}
                          {...register("purchase_comments")}
                        />
                        {errors.purchase_comments && (
                          <div className="invalid-feedback">
                            {errors.purchase_comments?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">In Service Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2024-06-10"
                          type="date"
                          className={`form-control ${
                            errors.in_service_date ? "is-invalid" : ""
                          }`}
                          {...register("in_service_date")}
                        />
                        {errors.in_service_date && (
                          <div className="invalid-feedback">
                            {errors.in_service_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Estimated Service Life in Months</label>
                      <div className="row gx-2">
                        <input
                          placeholder="7"
                          type="number"
                          className={`form-control ${
                            errors.estimated_service_life ? "is-invalid" : ""
                          }`}
                          {...register("estimated_service_life")}
                        />
                        {errors.estimated_service_life && (
                          <div className="invalid-feedback">
                            {errors.estimated_service_life?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Estimated Resale Value</label>
                      <div className="row gx-2">
                        <input
                          placeholder="300,000"
                          type="number"
                          className={`form-control ${
                            errors.estimated_resale_value ? "is-invalid" : ""
                          }`}
                          {...register("estimated_resale_value")}
                        />
                        {errors.estimated_resale_value && (
                          <div className="invalid-feedback">
                            {errors.estimated_resale_value?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Out of Service Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2024-06-10"
                          type="date"
                          className={`form-control ${
                            errors.out_service_date ? "is-invalid" : ""
                          }`}
                          {...register("out_service_date")}
                        />
                        {errors.out_service_date && (
                          <div className="invalid-feedback">
                            {errors.out_service_date?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
                  
                  
                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Save Equipment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEquipment;

