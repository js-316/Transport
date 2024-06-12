import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { selectUser } from "../features/auth/authSlice";


const Sidebar = () => {
 
  const location = useLocation();
  const [toggleMenu, setToggleMenu] = useState(false);

  const user = useSelector(selectUser);
 
  
  const [menuLinks, setMenuLinks] = useState([
    user?.is_staff ?
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "icon material-icons md-home",
      active: location.pathname === "/dashboard",
    } : null,
    user?.is_staff ?
    
    {
      name: "Vehicles",
      icon: "icon material-icons md-directions_car",
      submenu: [
        {
          name: "Vehicles List",
          path: "/dashboard/vehichles",
          active: location.pathname === "/dashboard/vehichles",
        },
        {
          name: "Meter History",
          path: "/dashboard/vehichles/meter_history",
          active: location.pathname === "/dashboard/vehichles/meter_history",
        },
        {
          name: "Expense History",
          path: "/dashboard/vehichles/expenses_history",
          active: location.pathname === "/dashboard/vehichles/expenses_history",
        },
      ],
    }: null,

    user?.is_driver ?
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "icon material-icons md-home",
      active: location.pathname === "/dashboard",
    } : null,
    user?.is_engineer ?
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "icon material-icons md-home",
      active: location.pathname === "/dashboard",
    }:null,
    user?.is_staff ?
    {
      name: "Drivers",
      path: "/dashboard/drivers",
      icon: "icon material-icons md-person",
      active: location.pathname === "/dashboard/drivers",
    } : null,
    
    {
      name: "Maintainance",
      icon: "icon material-icons md-home_repair_service",
      submenu: [
        {
          name: "Mantainance Requests",
          path: "/dashboard/maintenance",
          active: location.pathname === "/dashboard/maintenance",
        },
        user?.is_staff || user?.is_engineer ?
        
        {
          name: "Job Cards",
          path: "/dashboard/maintenance/work_order",
          active: location.pathname === "/dashboard/maintenance/work_order",
        } : null,
      ].filter(Boolean),
    },
    user?.is_staff || user?.is_engineer ?
    
    {
      name: "Equipment",
      path: "/dashboard/equipment",
      icon: "icon material-icons md-handyman",
      active: location.pathname === "/dashboard/equipment",

    } : null,
    user?.is_staff || user?.is_engineer ? 
    
    {
      name: "Inspections",
      icon: "icon material-icons md-hourglass_bottom",
      submenu: [
        {
          name: "Inspection History",
          path: "/dashboard/inspections/inspection_history",
          active:
            location.pathname === "/dashboard/inspections/insspection_history",
        },
        {
          name: "Item failures",
          path: "/dashboard/inspections/item_failures",
          active: location.pathname === "/dashboard/inspections/item_failures",
        },
        {
          name: "Schedules",
          path: "/dashboard/inspections/schedules",
          active: location.pathname === "/dashboard/inspections/schedules",
        },
      ],
    } : null,
    user?.is_staff || user?.is_driver ?
    
    {
      name: "Fuel",
      icon: "icon material-icons md-local_gas_station",
      submenu: [
        {
          name: "Fuel history",
          path: "/dashboard/fuel",
          active: location.pathname === "/dashboard/fuel",
          
        },
        {
          name: "Fuel Requests",
          path: "/dashboard/fuelrequests",
          active: location.pathname === "/dashboard/fuelrequests",
        },
      ],
    } : null,
    user?.is_staff || user?.is_driver ?
    {
      name: "Reminders",
      icon: "icon material-icons md-notification_important",
      submenu: [
        {
          name: "Service  Reminders",
          path: "/dashboard/service_reminders",
          active: location.pathname === "/dashboard/service_reminders",
        },
        {
          name: "Vehicle Renewals",
          path: "/dashboard/vehicle_reminders",
          active: location.pathname === "/dashboard/vehicle_reminders",
        },
        {
          name: "Contact Renewals",
          path: "/dashboard/contact_reminders",
          active: location.pathname === "/dashboard/contact_reminders",
        },
      ],
    } : null,
    user?.is_staff ?
    
    {
      name: "Contacts",
      path: "/dashboard/contacts",
      icon: "icon material-icons md-people",
      active: location.pathname === "/dashboard/contacts",
    } : null,
    user?.is_staff || user?.is_driver ?
    {
      name: "Fuel",
      path: "/dashboard/fuel",
      icon: "icon material-icons md-local_gas_station",
      active: location.pathname === "/dashboard/fuel",
    } : null,
    user?.is_staff || user?.is_engineer ?
    
    {
      name: "Parts",
      path: "/dashboard/parts",
      icon: "icon material-icons md-local_shipping",
      active: location.pathname === "/dashboard/parts",
    } : null,
    {
      name: "Logout",
      path: "/dashboard/logout",
      icon: "icon material-icons md-log_out",
      active: location.pathname === "/dashboard/logout",
    },
  ].filter(Boolean)
);


  const [currentMenuItem, setCurrentMenuItem] = useState(null);

  const toggleAside = () => {
    setToggleMenu(!toggleMenu);
    document.body.classList.toggle("aside-mini");
  };

  useEffect(() => {
    document.body.classList.remove("aside-mini");
    setToggleMenu(false);
  }, [location]);

  const toggleSubMenu = (link) => {
    const updatedMenuLinks = menuLinks.map((menuLink) => {
      if (menuLink === link) {
        menuLink.active = !menuLink.active;
        setCurrentMenuItem(link);
      } else {
        menuLink.active = false;
      }
      return menuLink;
    });
    setMenuLinks(updatedMenuLinks);
  };

  return (
    <div
      className={`navbar-aside ps ${toggleMenu ? "open" : ""}`}
      id="offcanvas_aside"
    >
      <div className="aside-top">
        <Link to="/dashboard" className="brand-wrap">
          Fleet Management
        </Link>
        <div>
          <button
            onClick={toggleAside}
            className="btn btn-icon btn-aside-minimize"
          >
            <i className="text-muted material-icons md-menu_open"></i>
          </button>
        </div>
      </div>
      <nav>
        <ul className="menu-aside">
          {menuLinks.map((link, index) => (
            <li
              key={index}
              className={`${link.active ? "menu-item active" : "menu-item"}`}
              onClick={() => toggleSubMenu(link)}
            >
              <Link to={link.path} className="menu-link">
                <i className={link.icon}></i>
                <span className="text">{link.name}</span>
                {link.submenu && (
                  <i className="material-icons md-arrow_drop_down"></i>
                )}
              </Link>
              {link.submenu && (
                <ul className="submenu">
                  {link.submenu.map((submenuItem, submenuIndex) => (
                    <li key={submenuIndex}>
                      <Link to={submenuItem.path} className="">
                        <span className="text">{submenuItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {currentMenuItem === link && (
                <div className="scrollbar">
                  <div className="scrollbar-inner">
                    {/* Add scrollbar content here */}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
