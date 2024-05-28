import React from "react";
import Chart from "react-apexcharts";

const FuelChart = () => {
  const series = [
    {
      name: "Amount",
      data: [100000, 55000, 250000, 35000, 130000, 78000, 25000],
    },
    
  ];
  const options = {
    chart: {
      height: 350,
      type: "bar", // Update chart type to bar
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "01/01/2013 ",
        "02/02/2013 ",
        "03/03/2013 ",
        "04/04/2013 ",
        "05/05/2013 ",
        "06/06/2013 ",
        "07/07/2013 ",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  };

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default FuelChart;