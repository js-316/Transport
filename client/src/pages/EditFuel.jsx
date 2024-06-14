import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetFuelByIdQuery, useEditFuelMutation } from "../features/fuel/fuelApiSlice";
import { useGetVehichlesQuery} from "../features/vehichle/vehicleApiSlice";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { fuelSchema } from "../util/validations";
import errorParser from "../util/errorParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";



const EditFuel = () => {
  const [appError, setAppError] = useState(null);
  const { register, handleSubmit, formState } = useForm() ;
  const navigate = useNavigate();
  const { id } = useParams();

  const [editFuel, { isLoading: isEditingFuel }] = useEditFuelMutation();

  const { data: fuel, isLoading: fuelLoading} = useGetFuelByIdQuery(id);

  const { isLoading: vehichleLoading, data } = useGetVehichlesQuery();

  const { ids, entities } = data || {};

  const vehichles = ids?.map((id) => entities[id]);

 
  const onSubmit = async (formData) => {
    setAppError(null);
    try {
      await editFuel({id, ...formData});
      navigate("/dashboard/fuel"); // Redirect to vehicles list after successful update
    } catch (error) {
      const parsedError = errorParser(error?.data);
      setAppError(parsedError || "An error occurred while updating the fuel and vehicle.");
    }
  };

  const { errors } = formState;

  if (fuelLoading || vehichleLoading) {
    return <div>Loading...</div>;
  }

  if (!fuel || !vehichles) {
    return <div>No data found</div>;
  }

  return (
    <Layout>
      <div className="row">
        <div className="content-header">
          <div>
            <Link to="/dashboard/fuel">
              <FontAwesomeIcon icon={faArrowCircleLeft} />Fuel Requests
            </Link>
            <h2 className="content-title">Edit Fuel Request</h2>
          </div>

        </div>
        <div className="card mb-4">
          <div className="card-header">
            <h4>Fuel Request Information</h4>
          </div>
          <div className="card-body">
            {appError && (
              <div className="alert alert-danger" role="alert">
                {appError}
              </div>
            )}
            <form id="fuel_edit" onSubmit={handleSubmit(onSubmit)}>
              {/* Input fields to edit vehicle information */}
              <div className="row">
              <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Fuel Type</label>
                    <div className="row-gx-2">
                      <input type="text" className="form-control"  defaultValue={fuel.fuel_type} {...register("fuel_type")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Vehicle Number Plate</label>
                    <div className="row-gx-2">
                      <span className="form-control"> {fuel.fuel_plate.number_plate} </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Mileage</label>
                    <div className="row-gx-2">
                      <input type="number" className="form-control" defaultValue={fuel.mileage} {...register("mileage")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Date Of Fueling</label>
                    <div className="row-gx-2">
                      <input type="date"  className="form-control" defaultValue={fuel.date_of_fueling} {...register("date_of_fueling")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Amount</label>
                    <div className="row-gx-2">
                      <input type="number" className="form-control" defaultValue={fuel.amount} {...register("amount")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Status</label>
                    <div className="row-gx-2">
                      <input type="text" className="form-control" defaultValue={fuel.status} {...register("status")}></input>
                    </div>
                  </div>
                </div>
                
              </div>
              {errors && <span>{errors.message}</span>}
              <button className="btn btn-primary" type="submit">
                {isEditingFuel  ? "Updating..." : "Update Fuel Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default EditFuel;
