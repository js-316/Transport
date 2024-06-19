import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUser,
  faWrench,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const cardsData = [
  {
    id: 1,
    title: "Vehichles",
    text: "Vehichles awaiting for maintenance",
    icon: "car",
    numbers: 5,
  },
  {
    id: 2,
    title: "Drivers",
    text: "Drivers awaiting for training",
    icon: "user",
    numbers: 4,
  },
  {
    id: 3,
    title: "Maintenance",
    text: "Maintenance awaiting for approval",
    icon: "wrench",
    numbers: 3,
  },
  {
    id: 4,
    title: "Fuel",
    text: "Fuel that has been consumed",
    icon: "tint",
    numbers: 2,
  },
];

export const UsernotificatioData = [
  {
    id: 1,
    title: "Issues history",
    text: "Previous car Issues",
    Link: "/dashboard/issues",
    numbers: 5,
  },
  {
    id: 2,
    title: "Active Issues",
    text: "Current Car Issues",
    Link: "/dashboard/issues",
    numbers: 4,
  },
  {
    id: 2,
    title: "Job cards",
    text: "Created Job Cards",
    Link: "/dashboard/maintenance/work_order",
    numbers: 4,
  },
  {
    id: 3,
    title: "Services History",
    text: "Times its been Serviced",
    Link: "/dashboard/maintenance",
    numbers: 3,
  },
  {
    id: 4,
    title: "Fuel",
    text: "Fuel Expenditures",
    Link: "/dashboard/fuel",
    numbers: 2,
  },
];

export const DriversnotificatioData = [
  {
    id: 1,
    title: "Issues",
    text: "Previous car Issues",
    Link: "/dashboard/issues",
    numbers: 5,
  },
  {
    id: 2,
    title: "Active Issues",
    text: "Current Car Issues",
    Link: "/dashboard/issues",
    numbers: 4,
  },
  {
    id: 2,
    title: "Job cards",
    text: "Created Job Cards",
    Link: "/dashboard/maintenance/work_order",
    numbers: 4,
  },
  {
    id: 3,
    title: "Services History",
    text: "Times its been Serviced",
    Link: "/dashboard/maintenance",
    numbers: 3,
  },
  {
    id: 4,
    title: "Fuel",
    text: "Fuel Expenditures",
    Link: "/dashboard/fuel",
    numbers: 2,
  },
];

export const VehichlelistColumns = [
  "Number Plate",
  "Model",
  "Manufacturer",
  "Year Make",
  "Fuel Type",
  "Milage",
];
export const Vehichlelistdata = [
  {
    "Number Plate": "UBY200M",
    "Model": "Harrier",
    "Manufacturer": "Toyota",
    "Year Make": "2000",
    "Fuel Type": "Diesel",
    "Milage": "187453",
  },
];
