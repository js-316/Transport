import React from "react";
import Chart from "react-apexcharts";

const PriorityChart = () => {
  const series = [
    {
        name: "No Priority",
        data: [],
      },
    {
      name: "Scheduled",
      data: [44, 55, 41, 67, 22, 43, 21],
    },
    {
      name: "Non-Scheduled",
      data: [13, 23, 20, 8, 13, 27, 33],
    },
    {
      name: "Emergency",
      data: [11, 17, 15, 15, 21, 14, 15],
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "area",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "01/01/2013 00:00",
        "02/01/2014 01:30",
        "03/01/2015 02:30",
        "04/01/2016 03:30",
        "05/01/2017 04:30",
        "06/01/2018 05:30",
        "07/01/2023 06:30",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  return <Chart options={options} series={series} type="area" height={350} />;
};

export default PriorityChart;
