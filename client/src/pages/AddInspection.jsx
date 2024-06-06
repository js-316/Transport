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


const AddInspection = () => {
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
                <Link to="/dashboard/inspections/inspection_history">
                  <FontAwesomeIcon icon={faArrowCircleLeft} />Inspections
                </Link>
              </div>
              <h2 className="content-title">
                New Vehicle Inspection</h2>
            </div>

          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Inspection Details</h4>
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
                      <label className="form-label">Interior Cleanliness</label>
                      <div className="row gx-2">
                        <input
                          type="file"
                          accept="image/*"
                          className={`form-control ${
                            errors.interior_cleanliness ? "is-invalid" : ""
                          }`}
                          {...register("interior_cleanliness")}
                        />
                        {errors.interior_cleanliness && (
                          <div className="invalid-feedback">
                            {errors.interior_cleanliness?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Engine</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("engine")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("engine")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Oil Left</label>
                      <div className="row gx-2">
                        <input
                          placeholder="0.5"
                          type="number"
                          className={`form-control ${
                            errors.oil_left ? "is-invalid" : ""
                          }`}
                          {...register("oil_left")}
                        />
                        {errors.oil_left && (
                          <div className="invalid-feedback">
                            {errors.oil_left?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Fuel Level</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Please select the fuel level"
                          type="number"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.fuel_level ? "is-invalid" : ""
                          }`}
                          {...register("fuel_level")}
                        />
                        {errors.fuel_level && (
                          <div className="invalid-feedback">
                            {errors.fuel_level?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Transmission</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("transmission")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("transmission")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Clutch</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("clutch")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("clutch")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Steering Mechanism</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("steering_mechanism")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("steering_mechanism")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Horn</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("horn")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("horn")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Windshield & Wipers</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("windshield")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("windshield")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Rear Vision Mirrors</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("rear_vision_mirrors")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("rear_vision_mirrors")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Lights and Reflectors</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("lights")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("lights")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Parking Brake</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("parking_brake")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("parking_brake")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Service Brakes</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("service_brakes")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("service_brakes")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Tires</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("tires")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("tires")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Wheels & Rims</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("wheels")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("wheels")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Emergency Equipment</label>
                      <div className="row gx-2 ">
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Pass"
                          className="form"
                          {...register("emergency_equipment")}
                        />
                        <label className="form-label">Pass</label>
                        </div>
                        <div className="form-check">
                        <input
                          type="radio"
                          value="Fail"
                          className="form"
                          {...register("emergency_equipment")}
                        />
                        <label className="form-label">Fail</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Vehicle Condition</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Please select Vehicle Condition"
                          type="number"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${
                            errors.fuel_level ? "is-invalid" : ""
                          }`}
                          {...register("vehicle_condition")}
                        />
                        {errors.vehicle_condition && (
                          <div className="invalid-feedback">
                            {errors.vehicle_condition?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                        <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Reviewing Driver's Signature</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Type your signature here"
                          type="text"
                          className={`form-control ${
                            errors.signature ? "is-invalid" : ""
                          }`}
                          {...register("signature")}
                        />
                        {errors.signature && (
                          <div className="invalid-feedback">
                            {errors.signature?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                  
                  
                <button class="btn btn-primary" type="submit">
                  {isLoading ? "Adding..." : "Save Inspection"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddInspection;

