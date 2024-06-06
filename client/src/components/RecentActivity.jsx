import React from "react";
import PropTypes from "prop-types";
import "../index.css";

const RecentActivity = ({ title, activities }) => {
  return (
    <div>
      <h5 className="card-title">
        {title} <span>| Today</span>
      </h5>
      <div className="activity">
        {activities?.map((activity, index) => (
          <div key={index} className="activity-item d-flex">
            <div className="activity-label">{activity.time}</div>
            <i
              className={`bi bi-circle-fill activity-badge text-${activity.badgeColor} align-self-start`}
            ></i>
            <div className="activity-content">
              {activity.content}
              {activity.link && (
                <a href={activity.link.href} className="fw-bold text-dark">
                  {activity.link.text}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

RecentActivity.propTypes = {
  title: PropTypes.string.isRequired,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      badgeColor: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      link: PropTypes.shape({
        href: PropTypes.string,
        text: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default RecentActivity;
