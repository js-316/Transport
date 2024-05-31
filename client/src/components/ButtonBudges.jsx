import React from "react";
import PropTypes from "prop-types";

const ButtonBudges = ({ statuses }) => {

var statuses = [
  { label: "Upcoming", count: 4, variant: "primary" },
  { label: "Pending", count: 4, variant: "secondary" },
  { label: "Done", count: 4, variant: "success" },
  { label: "OverDue", count: 4, variant: "danger" },
];

  return (
    <div className="card">
      <div className="card-body d-flex justify-content-between">
        <h5 className="card-title mb-6">Status</h5>
        {statuses.map((status, index) => (
          <button
            key={index}
            type="button"
            className={`btn mb-2 btn-${status.variant}`}
          >
            <span style={{ marginRight: "10px" }}>{status.label}</span>
            <span className={`badge bg-white text-${status.variant}`}>
              {status.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

ButtonBudges.propTypes = {
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      variant: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ButtonBudges;
