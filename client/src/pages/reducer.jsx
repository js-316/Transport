import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fuelSchema, jobCardSchema } from "../util/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { useAddFuelMutation } from "../features/fuel/fuelApiSlice";
import errorParser from "../util/errorParser";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useAddJobcardMutation } from "../features/jobcard/jobcardApiSlice";
import DynamicTable from "../components/DynamicTable";

const AddJobCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appError, setAppError] = useState(null);


  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(jobCardSchema),
  });

  const { isLoading: loading, data, refetch } = useGetVehichlesQuery();

  const { ids, entities } = data || {};
  const vehichlesArray = ids?.map((id) => entities[id]);

  const [addJobcard, { isLoading, isSuccess }] = useAddJobcardMutation();


  const handleAddJobcard = async (data) => {
    setAppError(null);
    try {
      const res = await addJobcard({

        vehichle: data.jobcard_plate,
        machine_name: data.machine_name,
        // maintenance: data.repair_request,
        date_of_jobcard: data.date_of_jobcard,
        parts_needed: data.quantity + " " + data.part,
        //status: data.status,
      }).unwrap();
      if (res.jobcard) {
        navigate("/dashboard/maintenance/work_order");
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

  //const { watch } = useForm();


  const handleAddPart = () => {

    // const vehicleId = watch('vehicle_id');
    // console.log('vehicleId:', vehicleId);
    // const quantity = watch('quantity');
    // const vehicle = vehichlesArray.find((vehicle) => vehicle.id === vehicleId);
    // console.log('Vehicles',vehicle)
    // if (vehicle) {
    //   const newVehicle = { name: vehicle.number_plate, quantity: parseInt(quantity) };
    //   setAddedVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    // } else {
    //   console.error(`Vehicle with ID ${vehicleId} not found`);
    // }
  };

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

              <form id="jobcard_form" onSubmit={handleSubmit(handleAddJobcard)}>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Vehicle</label>
                      <div className="row gx-2">
                        <select
                          placeholder="Select Vehichle"
                          className={`form-control ${errors.jobcard_plate ? "is-invalid" : ""
                            }`}
                          {...register("jobcard_plate")}
                        >
                          <option>Select Vehicle</option>
                          {vehichlesArray?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.number_plate}
                            </option>
                          ))}
                        </select>
                        {errors.jobcard_plate && (
                          <div className="invalid-feedback">

                            {errors.jobcard_plate?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Repair Request</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Repair Request"
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
                  </div> */}
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Machine Name</label>
                      <div className="row gx-2">
                        <input
                          placeholder="Machine Name"
                          type="text"
                          className={`form-control ${errors.machine_name ? "is-invalid" : ""
                            }`}
                          {...register("machine_name")}
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
                      <label className="form-label">Date</label>
                      <div className="row gx-2">
                        <input
                          placeholder="2022-02-02"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${errors.date_of_jobcard ? "is-invalid" : ""
                            }`}
                          {...register("date_of_jobcard")}
                        />
                        {errors.date_of_jobcard && (
                          <div className="invalid-feedback">
                            {errors.date_of_jobcard?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Requester Signature</label>
                      <input
                        type="text"
                        placeholder="Sign with name e.g dean"
                        className="form-control"
                        {...register("requester_signature")}
                      />
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
                  </div> */}
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label">Parts</label>
                      <DynamicTable />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      {/* <label className="form-label">Quantity</label> */}
                      <div className="row gx-2">
                        <div className="col-5">
                          {/* <input
                          placeholder="5"
                          type="number"
                          className={`form-control ${errors.quantity ? "is-invalid" : ""
                            }`}
                          {...register("quantity")}
                        /> */}
                          {errors.quantity && (
                            <div className="invalid-feedback">
                              {errors.quantity?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-7">
                          <div className="vehicle-box">
                            {/* <input
                          placeholder="Part Needed"
                          type="text"
                          className={`form-control ${errors.part ? "is-invalid" : ""
                            }`}
                          {...register("part")}
                        /> */}
                            {errors.part && (
                              <div className="invalid-feedback">
                                {errors.part?.message}
                              </div>
                            )}
                            {/* <select
                            className="form-control"
                            {...register("part")}
                          >
                            <option value="">Select Part</option>
                            {vehichlesArray?.map((d, index) => (
                              <option key={index} value={d.id}>{d.number_plate}</option>
                            ))}
                          </select> */}

                            {/* <button
                              className="material-icons md-plus btn btn-primary btn-sm mt-1"
                              type="button"
                              onClick={() => handleAddPart()}
                              style={{
                                position: 'absolute',
                                
                                right: '5px',
                                padding: '5px 10px',
                                fontSize: '10px',
                                borderRadius: '5px',
                                margin: '10px'
                              }}
                            >
                              Add Part
                            </button>
                           */}
                          </div>




                        </div>
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
      </div >
    </Layout >
  );
};

export default AddJobCard;

