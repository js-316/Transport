import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [menuLinks, setMenuLinks] = useState([
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "icon material-icons md-home",
      active: location.pathname === "/dashboard",
    },
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
    },
    {
      name: "Drivers",
      path: "/dashboard/drivers",
      icon: "icon material-icons md-person",
      active: location.pathname === "/dashboard/drivers",
    },
    {
      name: "Service",
      icon: "icon material-icons md-home_repair_service",
      submenu: [
        {
          name: "Service History",
          path: "/dashboard/maintenance",
          active: location.pathname === "/dashboard/maintenance",
        },
        {
          name: "Work Orders",
          path: "/dashboard/maintenance/work_order",
          active: location.pathname === "/dashboard/maintenance/work_order",
        },
      ],
    },
    
    {
      name: "Equipment",
      path: "/dashboard/equipment",
      icon: "icon material-icons md-handyman",
      active: location.pathname === "/dashboard/equipment",
    },
    {
      name: "Inspections",
      icon: "icon material-icons md-hourglass_bottom",
      submenu: [
        {
          name: "Inspection History",
          path: "/dashboard/inspections/inspection_history",
          active: location.pathname === "/dashboard/inspections/insspection_history",
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
    },
    {
      name: "Issues",
      icon: "icon material-icons md-warning",
      submenu: [
        {
          name: "Issues",
          path: "/dashboard/issues",
          active: location.pathname === "/dashboard/issues",
        },
        {
          name: "Faults",
          path: "/dashboard/issues/faults",
          active: location.pathname === "/dashboard/issues/faults",
        },
      ],
    },
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
    },
    {
      name: "Contacts",
      path: "/dashboard/contacts",
      icon: "icon material-icons md-people",
      active: location.pathname === "/dashboard/contacts",
    },
    {
      name: "Fuel",
      path: "/dashboard/fuel",
      icon: "icon material-icons md-local_gas_station",
      active: location.pathname === "/dashboard/fuel",
    },
    {
      name: "Parts",
      path: "/dashboard/parts",
      icon: "icon material-icons md-local_shipping",
      active: location.pathname === "/dashboard/parts",
    },
    {
      name: "Logout",
      path: "/dashboard/logout",
      icon: "icon material-icons md-log_out",
      active: location.pathname === "/dashboard/logout",
    },
  ]);
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
        menuLink.active = true;
        setCurrentMenuItem(link);
      } else {
        menuLink.active = false;
      }
      return menuLink;
    });
    setMenuLinks(updatedMenuLinks);
  };

  return (
    <div className="navbar-aside ps" id="offcanvas_aside">
      <div className="aside-top">
        <Link to="/dashboard" className="brand-wrap">
          Fleet Management
        </Link>
        <div>
          <button onClick={toggleAside} className="btn btn-icon btn-aside-minimize">
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
              onClick={index.onClick}
            >
              <Link to={link.path} className="menu-link">
                <i className={link.icon}></i>
                <span className="text">{link.name}</span>
                {link.submenu && <i className="material-icons md-arrow_drop_down"></i>}
              </Link>
              {link.submenu && (
                <ul className="submenu">
                  {link.submenu.map((submenuItem, submenuIndex) => (
                    <li key={submenuIndex}>
                      <Link to={submenuItem.path} className="menu-link">
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

      </nav >
    </div >
  );
};

export default Sidebar