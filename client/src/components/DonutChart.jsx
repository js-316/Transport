import React from "react";
import ReactECharts from "echarts-for-react";

const DonutChart = () => {
  const options = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 484, name: "Diesel" },
          { value: 300, name: "Petrol" },
        ],
      },
    ],
  };

  return <ReactECharts option={options} />;
};

export default DonutChart;
