import React from "react";
import ReactEcharts from "echarts-for-react";

const DonutChart = ({ title, data }) => {
  const getOption = () => ({
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "right",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["200%", "100%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  });

  return (
    <div>
      <h5 className="card-title">{title}</h5>
      <div id="donutChart" style={{ minHeight: "320px" }} className="echart">
        <ReactEcharts
          option={getOption()}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default DonutChart;
