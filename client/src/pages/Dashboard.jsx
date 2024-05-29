import React from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import TableLoader from "../components/TableLoader";
import { useGetVehichlesQuery } from "../features/vehichle/vehicleApiSlice";
import { Link } from "react-router-dom";
import { useGetDriversQuery } from "../features/driver/driverApiSlice";
import { cardsData } from "../data/data";
import Charts from "../components/Charts";
import LetteredAvatar from "react-lettered-avatar";
import { useGetMaintenanceQuery } from "../features/maintenance/maintenanceApiSlice";
import { useGetFuelQuery } from "../features/fuel/fuelApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUser, faWrench, faTint } from '@fortawesome/free-solid-svg-icons';
import PriorityChart from "../components/PriorityChart";
import FuelChart from "../components/FuelChart";
import ServiceChart from "../components/ServiceChart"


const Dashboard = () => {
  const { isLoading, data } = useGetVehichlesQuery();
  const { data: drivers } = useGetDriversQuery();
  const { data: maintenanceData } = useGetMaintenanceQuery()
  const { data: fuelData } = useGetFuelQuery()

  const { ids, entities } = data || {};
  const { ids: driverIds, entities: driverEntities } = drivers || {}
  const { ids: maintenanceIds, entities: maintenancesEntities } = maintenanceData || {}
  const { ids: fuelIds, entities: fuelEntities } = fuelData || {}

  const vehichlesArray = ids?.map((id) => entities[id]);
  const driversArray = driverIds?.map((id) => driverEntities[id])
  const maintenancesArray = maintenanceIds?.map((id) => maintenancesEntities[id])
  const fuelArray = maintenanceIds?.map((id) => fuelEntities[id])

  return (
    <Layout>
      <div className="content-header">
        <div>
          <h2 className="content-title card-title">My Dashboard </h2>

        </div>
        
      </div>
      <div className="row">
        {cardsData.map((cd, index) => (
          <div key={index} className="col-lg-3">
            <Card
              data={{
                title: cd.title,
                text: cd.text,
                icon: cd.icon,
                numbers: cd.numbers,
              }}
            />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-6">

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <article className="card-body">
                  <h5 className="card-title">Records Statistics</h5>
                  <Charts />
                </article>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-4">
                <article className="card-body">
                  <h5 className="card-title">Repair Priority Class Trends</h5>
                  <PriorityChart />
                </article>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <article className="card-body">
                  <h5 className="card-title">Fuel Costs</h5>
                  <FuelChart />
                </article>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-4">
                <article className="card-body">
                  <h5 className="card-title">Service Costs</h5>
                  <ServiceChart />
                </article>
              </div>
            </div>
          </div>

          <div className="row">
            
            
          </div>
        </div>

      </div>
      
    </Layout>
  );
};

export default Dashboard;