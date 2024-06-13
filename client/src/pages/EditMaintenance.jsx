import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetMaintenanceByIdQuery, useEditMaintenanceMutation } from "../features/maintenance/maintenanceApiSlice";
import { useGetVehichleByIdQuery, useEditVehichleMutation,useGetVehichlesQuery} from "../features/vehichle/vehicleApiSlice";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { maintenanceSchema } from "../util/validations";
import errorParser from "../util/errorParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";


const EditMaintenance = () => {
  const [appError, setAppError] = useState(null);
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [editMaintenance, { isLoading: isEditingMaintenance }] = useEditMaintenanceMutation();

  const { data: maintenance, isLoading: maintenanceLoading, error: maintenanceError } = useGetMaintenanceByIdQuery(id);

  const { isLoading: vehichleLoading, data } = useGetVehichlesQuery();

  const { ids, entities } = data || {};

  const vehichles = ids?.map((id) => entities[id]);

  
  const onSubmit = async (formData) => {
    setAppError(null);
    try {
        editMaintenance({id, ...formData}),
      
        navigate("/dashboard/maintenance"); // Redirect to vehicles list after successful update
    } catch (error) {
      const parsedError = errorParser(error?.data);
      setAppError(parsedError || "An error occurred while updating the maintenance and vehicle.");
    }
  };

  const { errors } = formState;

  if (maintenanceLoading || vehichleLoading) {
    return <div>Loading...</div>;
  }

  if (!maintenance || !vehichles) {
    return <div>No data found</div>;
  }

  return (
    <Layout>
      <div className="row">
        <div className="content-header">
          <div>
            <Link to="/dashboard/maintenance">
            <FontAwesomeIcon icon={faArrowCircleLeft} />Maintenance Requests
            </Link>
            <h2 className="content-title">Edit Maintenance</h2>
          </div>

        </div>
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
            <form id="maintenance_edit" onSubmit={handleSubmit(onSubmit)}>
              {/* Input fields to edit vehicle information */}
              <div className="row">
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Vehicle Number Plate</label>
                    <div className="row-gx-2">
                      <span className="form-control"> {maintenance.fleet.number_plate} </span>
                    </div>
                  </div>
                </div>
              
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <div className="row-gx-2">
                      <input type="text" className="form-control"  defaultValue={maintenance.description} {...register("description")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Cost</label>
                    <div className="row-gx-2">
                      <input type="number"  className="form-control" defaultValue={maintenance.cost} {...register("cost")}></input>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <label className="form-label">Date</label>
                    <div className="row-gx-2">
                      <input type="date" className="form-control" defaultValue={maintenance.date} {...register("date")}></input>
                    </div>
                  </div>
                </div>
              </div>
              {errors && <span>{errors.message}</span>}
              <button className="btn btn-primary" type="submit">
                {isEditingMaintenance  ? "Updating..." : "Update Maintenance"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default EditMaintenance;
