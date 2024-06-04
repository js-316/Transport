import React from "react";
import PropTypes from "prop-types";

const ButtonBudges = ({ title, buttons }) => {
  return (
    <div className="card">
      <div className="card-body d-flex justify-content-between">
        <h5 className="card-title mb-6">{title}</h5>
        {buttons?.map((button, index) => (
          <button
            key={index}
            type="button"
            className={`btn btn-${button.color} mb-2`}
          >
            <span style={{ marginRight: "10px" }}>{button.label}</span>
            <span className={`badge bg-white text-${button.color}`}>
              {button.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

ButtonBudges.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ButtonBudges;
