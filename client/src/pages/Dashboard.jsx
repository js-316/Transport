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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUser,
  faWrench,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
import PriorityChart from "../components/PriorityChart";
import FuelChart from "../components/FuelChart";
import ServiceChart from "../components/ServiceChart";
import BarChart from "../components/Barchart";
import Listgroups from "../components/Listgroups";
import DonutChart from "../components/DonutChart";
import { issues,workorder,items ,activities } from "../data/chartData";
import RecentActivity from "../components/RecentActivity";

const Dashboard = () => {
  const { isLoading, data } = useGetVehichlesQuery();
  const { data: drivers } = useGetDriversQuery();
  const { data: maintenanceData } = useGetMaintenanceQuery();
  const { data: fuelData } = useGetFuelQuery();

  const { ids, entities } = data || {};
  const { ids: driverIds, entities: driverEntities } = drivers || {};
  const { ids: maintenanceIds, entities: maintenancesEntities } =
    maintenanceData || {};
  const { ids: fuelIds, entities: fuelEntities } = fuelData || {};

  const vehichlesArray = ids?.map((id) => entities?.[id]);
  const driversArray = driverIds?.map((id) => driverEntities?.[id]);
  const maintenancesArray = maintenanceIds?.map(
    (id) => maintenancesEntities?.[id]
  );
  const fuelArray = maintenanceIds?.map((id) => fuelEntities?.[id]);

  const items = [
    { text: "Service Reminders", badge: 14 },
    { text: "Contact Renewals", badge: 2 },
    { text: "Vehicle Renewals", badge: 1 },
  ];
  const issues = [
    { text: "vehicle Failures", badge: 14 },
    { text: "Faults", badge: 2 },
  ];

  return (
    <Layout>
      <div className="content-header">
        <div>
          <h2 className="content-title card-title">Admin Dashboard </h2>
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

      <div className="col">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-3">
              <article className="card-body">
                <Listgroups title="Issues" items={issues} />
              </article>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <article className="card-body">
                <Listgroups title="Job Cards" items={workorder} />
              </article>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <article className="card-body">
                <Listgroups title="Reminders" items={items} />
              </article>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-6">
              <article className="card-body">
                <h5 className="card-title">Repair Priority Class Trends</h5>
                <PriorityChart />
              </article>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4" style={{ height: "445px" }}>
              <article className="card-body">
                <RecentActivity
                  title="Recent Activity"
                  activities={activities}
                />
              </article>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <article className="card-body">
                <h5 className="card-title">Monthly Service Costs</h5>
                <BarChart />
              </article>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4" style={{ height: "445px" }}>
              <article className="card-body">
                <h5 className="card-title">Service Costs</h5>
                <DonutChart />
              </article>
            </div>
          </div>
        </div>
      </div>
      <div />

      <div className="card mb-4">
        <header className="card-header" data-select2-id="11">
          <h4 className="card-title">Latest Fleet</h4>
          <div className="row align-items-center" data-select2-id="10">
            <div className="col-md-2 col-6">
              <input type="date" value="02.05.2022" className="form-control" />
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Number Plate</th>
                    <th>Drivers</th>
                    <th>Mileage</th>
                    <th>Manufacturer</th>
                    <th>Date of Purchase</th>
                    <th className="text-end"> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? [...Array(5)].map((_, i) => (
                        <TableLoader key={i} count={6} />
                      ))
                    : vehichlesArray?.map((v, index) => (
                        <tr key={index}>
                          <td>{v.number_plate}</td>
                          <td>{v.driver.name}</td>
                          <td>{v.mileage}</td>
                          <td>{v.manufacturer}</td>
                          <td>{v.date_of_purchase}</td>
                          <td className="text-end">
                            <Link
                              to={`/vehichles/${v.id}`}
                              className="btn btn-sm font-sm rounded btn-brand mx-4"
                            >
                              <i className="material-icons md-edit"></i>
                              Edit
                            </Link>
                            <button className="btn btn-sm font-sm rounded btn-danger">
                              <i className="material-icons md-delete"></i>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;