import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDriverByIdQuery, useEditDriverMutation } from "../features/driver/driverApiSlice";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { driverSchema } from "../util/validations";
import errorParser from "../util/errorParser";


const EditDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: driver, isLoading, error} = useGetDriverByIdQuery(id);
  const [appError, setAppError] = useState(null);
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(driverSchema),
  });
  const { errors } = formState;

  const [editDriver, { isLoading : isEditingDriver}] = useEditDriverMutation();

  const onSubmit = async (formData) => {
    try {
      await editDriver({ id, ...formData, name: formData.first_name + " " + formData.last_name });
      
      navigate("/dashboard/drivers"); // Redirect to drivers list after successful update
      
    } catch (error) {
      const parsedError = errorParser(error?.data);
      setAppError(parsedError || "An error occurred while updating the driver.");
    }
  };

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  
  return (
    <Layout>
      <div className="row">
      <div className="content-header">
        <h2 className="content-title">Edit Driver</h2>
      </div>
      <div className="card mb-4">
        <div className="card-header">
          <h4>Driver Information</h4>
        </div>
        <div className="card-body">
          {appError && (
            <div className="alert alert-danger" role="alert">
              {appError}
            </div>
          )}
          <form id="driver_edit" onSubmit={handleSubmit(onSubmit)}>
            {/* Input fields to edit driver information */}
            <div className="row">
              <div className="col-lg-4">
                <div className="mb-4">
                  <label className="form-label">First Name</label>
                  <div className="row-gx-2">
                    <input type="text" className="form-control" defaultValue={driver.name.split(" ")[0]} {...register("first_name")}></input>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-4">
                  <label className="form-label">Last Name</label>
                  <div className="row-gx-2">
                    <input type="text"  className="form-control" defaultValue={driver.name.split(" ")[1]} {...register("last_name")}></input>
                  </div>
                </div>
              </div>
            
              <div className="col-lg-4">
                <div className="mb-4">
                  <label className="form-label">Phone Number</label>
                  <div className="row-gx-2">
                    <input type="text"  className="form-control" defaultValue={driver.phone_number} {...register("phone_number")}></input>
                    </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-4">
                  <label className="form-label">Age</label>
                  <div className="row-gx-2">
                    <input type="number"  className="form-control" defaultValue={driver.age} {...register("age")}></input>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-4">
                  <label className="form-label">Date Hired</label>
                  <div className="row-gx-2">
                    <input type="date" defaultValue={driver.date_hired} className="form-control disabled" {...register("date_hired")} />
                  </div>
                </div>
              </div>
            </div>
            {errors && <span>{errors.message}</span>}
            <button class="btn btn-primary" type="submit" >
                  {isEditingDriver ? "Updating..." : "Update Driver"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default EditDriver;

            