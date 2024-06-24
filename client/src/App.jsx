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
import MeterHistory from "./pages/MeterHistory";
import ExpensesHistory from "./pages/ExpensesHistory";
import Logout from "./pages/Logout";
import Maintenance from "./pages/Maintenance";
import AddMaintenance from "./pages/AddMaintenance";
import EditMaintenance from "./pages/EditMaintenance";
import WorkOrder from "./pages/JobCard";
import ViewCosts from "./pages/ViewCosts";
import Fuel from "./pages/Fuel";
import AddFuel from "./pages/AddFuel";
import EditFuel from "./pages/EditFuel";
import ViewFuel from "./pages/ViewFuel";
import Service_Reminders from "./pages/Service_Reminders";
import Contact_Reminders from "./pages/Contact_Reminders";
import Vehicle_Reminder from "./pages/Vehicle_Reminder";
import Staff from "./pages/Staff";
import Equipment from "./pages/Equipment";
import InspectionHistory from "./pages/InspectionHistory";
import ItemFailures from "./pages/ItemFailures";
import Schedules from "./pages/Schedules";
import Contacts from "./pages/Contacts";
import Parts from "./pages/Parts";
import AddEquipment from "./pages/AddEquipment";
import AddInspection from "./pages/AddInspection";
import AddIssue from "./pages/AddIssue";
import AddFault from "./pages/AddFault";
import AddServiceReminder from "./pages/AddServiceReminder";
import AddVehicleReminder from "./pages/AddVehicleRenewal";
import AddContactReminder from "./pages/AddContactRenewal";
import AddContact from "./pages/AddContact";
import AddExpense from "./pages/AddExpense";
import AddPart from "./pages/AddPart";
import AddMeter from "./pages/AddMeter";
import ViewFuelRequests from "./pages/ViewFuelRequests"
import UserDashboard from "./pages/User/UserDashboard"
import EngineerDashboard from "./pages/User/EngineerDashboard"
import { useSelector } from "react-redux";
import { selectUser } from "./features/auth/authSlice";
import AddJobCard from "./pages/AddJobCard";
import JobCard from "./pages/JobCard";


function App() {

  const user = useSelector(selectUser)

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
        user?.is_staff ?
        {
          path: "",
          element: <Dashboard />,
        
        } : null,
        user?.is_driver ?
        {
          path: "",
          element: <UserDashboard />,
        } : null,
        user?.is_engineer ? 
        {
          path: "",
          element: <EngineerDashboard />,
        } : null,
        
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
          path: "drivers",
          element: <RequireAuth />,
          children: [
            {
              path: "",
              element: <Drivers />,
              
            },
            
          ],
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
          path: "vehichles/expenses_history",
          element: <ExpensesHistory />,
        },
        {
          path: "vehichles/expenses_history/add",
          element: <AddExpense />,
        },
        {
          path: "vehichles/meter_history",
          element: <MeterHistory />,
        },
        {
          path: "vehichles/meter_history/add",
          element: <AddMeter />,
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
          path: "maintenance/job_card",
          element: <JobCard />,
        },
        {
          path: "maintenance/job_card/add",
          element: <AddJobCard />,
        },
        {
          path: "service_reminders",
          element: <Service_Reminders />,
        },
        {
          path: "service_reminders/add",
          element: <AddServiceReminder />,
        },

        {
          path: "contact_reminders",
          element: <Contact_Reminders />,
        },
        {
          path: "contact_reminders/add",
          element: <AddContactReminder />,
        },
        {
          path: "vehicle_reminders",
          element: <Vehicle_Reminder />,
        },
        {
          path: "vehicle_reminders/add",
          element: <AddVehicleReminder />,
        },
        {
          path: "equipment",
          element: <Equipment />,
        },
        {
          path: "equipment/add",
          element: <AddEquipment />,
        },
        {
          path: "inspections/item_failures",
          element: <ItemFailures />,
        },
        {
          path: "inspections/schedules",
          element: <Schedules />,
        },
        {
          path: "inspections/inspection_history",
          element: <InspectionHistory />,
        },
        {
          path: "inspections/inspection_history/add",
          element: <AddInspection />,
        },
        {
          path: "fuel",
          element: <Fuel  />,
        },
       
        {
          path: "fuelrequests",
          element: <ViewFuelRequests />,
        },
        {
          path: "issues/faults/add",
          element: <AddFault />,
        },
        {
          path: "contacts",
          element: <Contacts />,
        },
        {
          path: "contacts/add",
          element: <AddContact />,
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
          path: "charts",
          element: <Parts />,
        },
        {
          path: "charts/add",
          element: <AddPart />,
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
          element: <Contact_Reminders />,
        },

        {
          path: "vehicle_reminders",
          element: <Vehicle_Reminder />,
        },
        {
          path: "userdashboard",
          element: <UserDashboard />,
        },
        {
          path: "/dashboard/EngDashboard",
          element: <EngineerDashboard />,
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
