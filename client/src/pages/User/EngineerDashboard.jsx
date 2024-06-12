import React from 'react'
import Layout from '../../components/Layout'
import { Link } from 'react-router-dom';
import { DriversnotificatioData } from '../../data/data';
import UserNotification from '../../components/UserNotification';

const EngineerDashboard = () => {
  return (
    <Layout>
      <div className="content-header">
        <div>
          <h2 className="content-title card-title">Dashboard</h2>
        </div>
      </div>
      <div className="row">
        {DriversnotificatioData?.map((cd, index) => (
          <div key={index} className="col-lg-3">
            <Link to={cd.Link}>
              <UserNotification
                data={{
                  title: cd.title,
                  text: cd.text,
                  numbers: cd.numbers,
                }}
              />
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default EngineerDashboard
