import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetVehichleByIdQuery, useEditVehichleMutation } from "../features/vehichle/vehicleApiSlice";
import {  useEditDriverMutation,useGetDriversQuery} from "../features/driver/driverApiSlice";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { vehichleSchema } from "../util/validations";
import errorParser from "../util/errorParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

const EditVehichle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: vehichle, isLoading: vehichleLoading} = useGetVehichleByIdQuery(id);

  const { isLoading: driverLoading, data } = useGetDriversQuery();

  const { ids, entities } = data || {};

  const drivers = ids?.map((id) => entities[id]);

  const [appError, setAppError] = useState(null);
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  
  const [editVehichle, {isLoading: isEditingVehichle }] = useEditVehichleMutation();


  const onSubmit = async (formData) => {
    try {
      await editVehichle({ id, ...formData });

      navigate("/dashboard/vehichles"); // Redirect to drivers list after successful update
      
    } catch (error) {
      const parsedError = errorParser(error?.data);
      setAppError(parsedError || "An error occurred while updating the vehichle.");
    }
  };

  if (vehichleLoading || driverLoading) {
    return <div>Loading...</div>;
  }

  if (!vehichle || !drivers) {
    return <div>No data found</div>;
  }

  return (
    <Layout>
      <div className="row">
        <div className="content-header">
          <div>
            <Link to="/dashboard/vehichles">
            <FontAwesomeIcon icon={faArrowCircleLeft} />Vehicles
            </Link>
            <h2 className="content-title">Edit Vehicle</h2>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-header">
            <h4>Vehicle Information</h4>
          </div>
          <div className="card-body">
            {appError && (
              <div className="alert alert-danger" role="alert">
                {appError}
              </div>
            )}
            <form id="vehicle_edit" onSubmit={handleSubmit(onSubmit)}>
              {/* Input fields to edit vehicle information */}
              <div className="row">
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Vehicle Number Plate</label>
                    <div className="row-gx-2">
                      <input className="form-control" defaultValue={vehichle.number_plate} {...register("number_plate")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Driver</label>
                    <div className="row-gx-2">
                      <select
                          className="form-control"
                          {...register("driver")}
                          
                        >
                          <option>{ vehichle.driver.name}</option>
                          {drivers?.map((d, index) => (
                            <option key={index} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Mileage</label>
                    <div className="row-gx-2">
                      <input type="number" className="form-control" defaultValue={vehichle.mileage} {...register("mileage")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Vehichle Type</label>
                    <div className="row-gx-2">
                    <input type="text" className="form-control" defaultValue={vehichle.vehichle_type} {...register("vehichle_type")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Manufacturer</label>
                    <div className="row-gx-2">
                    <input type="text" className="form-control" defaultValue={vehichle.manufacturer} {...register("manufacturer")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Date Of Purchase</label>
                    <div className="row-gx-2">
                    <input type="date" className="form-control" defaultValue={vehichle.date_of_purchase} {...register("date_of_purchase")}></input>
                    </div>
                  </div>
                </div>
              </div>
              {errors && <span>{errors.message}</span>}
              <button className="btn btn-primary" type="submit">
                {isEditingVehichle  ? "Updating..." : "Update Vehicle"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default EditVehichle;