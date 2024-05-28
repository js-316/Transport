import {
  createBrowserRouter as Router,
  RouterProvider, BrowserRouter,Routes,Route
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import ErrorPage from "./pages/error-page";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";
import RequireNoAuth from "./components/RequireNoAuth";
import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import EditDriver from "./pages/EditDriver";
import Vehichles from "./pages/Vehichles";
import AddVehichle from "./pages/AddVehichle";
import EditVehichle from "./pages/EditVehichle";
import Logout from "./pages/Logout";
import Maintenance from "./pages/Maintenance";
import AddMaintenance from "./pages/AddMaintenance";
import EditMaintenance from "./pages/EditMaintenance";
import WorkOrder from "./pages/WorkOrder";
import ViewCosts from "./pages/ViewCosts";
import Fuel from "./pages/Fuel";
import AddFuel from "./pages/AddFuel";
import EditFuel from "./pages/EditFuel";
import ViewFuel from "./pages/ViewFuel";
import Service_Reminders from "./pages/Service_Reminders";
import Contact_Reminders from "./pages/Contact_Reminders";
import Vehicle_Reminder from "./pages/Vehicle_Reminder";

function App() {

  const routes = Router([
    {
      path: "",
      element: <RequireNoAuth />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
      ],
    },
    {
      path: "dashboard",
      element: <RequireAuth />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "drivers",
          element: <Drivers />,
        },
        {
          path: "drivers/add",
          element: <AddDriver />,
        },
        {
          path: "drivers/edit/:id",
          element: <EditDriver />,
        },
        {
          path: "vehichles",
          element: <Vehichles />,
        },
        {
          path: "vehichles/add",
          element: <AddVehichle />,
        },
        {
          path: "vehichles/edit/:id",
          element: <EditVehichle />,
        },
        {
          path: "vehichles/costs_view/:id",
          element: <ViewCosts />,
        },
        {
          path: "vehichles/fuel_view/:id",
          element: <ViewFuel />,
        },
        {
          path: "maintenance",
          element: <Maintenance />,
        },
        {
          path: "maintenance/edit/:id",
          element: <EditMaintenance />,
        },
        {
          path: "maintenance/add",
          element: <AddMaintenance />,
        },
        {
          path: "maintenance/work_order",
          element: <WorkOrder />,
        },
        {
          path: "fuel",
          element: <Fuel />,
        },
        {
          path: "fuel/add",
          element: <AddFuel />,
        },
        {
          path: "fuel/edit/:id",
          element: <EditFuel />,
        },

        {
          path: "logout",
          element: <Logout />,
        },

        {
          path: "service_reminders",
          element: <Service_Reminders />,
        },

        {
          path: "contact_reminders",
          element: < Contact_Reminders/>,
        },

        {
          path: "vehicle_reminders",
          element: <Vehicle_Reminder />,
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
            width: "200px",
            height: "50px",
          },
        }}
        reverseOrder={false}
      />

      <RouterProvider router={routes} />
    </>
  );
}

export default App;
