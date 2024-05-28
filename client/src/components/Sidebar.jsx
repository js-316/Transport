import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [toggleMenu, setToggleMenu] = useState(false);

  // to toggle the menu, add aside-mini class to the body
  const toggleAside = () => {
    setToggleMenu(!toggleMenu);
    document.body.classList.toggle("aside-mini");
  };

  useEffect(() => {
    // to close the menu when the route changes
    document.body.classList.remove("aside-mini");
    setToggleMenu(false);
  }, [location]);

  const menuLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "icon material-icons md-home",
      active: location.pathname === "/dashboard",
    },
    {
      name: "Vehicles",
      path: "/dashboard/vehichles",
      icon: "icon material-icons md-directions_car",
      active: location.pathname === "/dashboard/vehichles",
    },
    {
      name: "Drivers",
      path: "/dashboard/drivers",
      icon: "icon material-icons md-person",
      active: location.pathname === "/dashboard/drivers",
    },
    {
      name: "Reminders",
      icon: "icon material-icons md-home_repair_service",
      submenu: [
        {
          name: "Service",
          path: "/dashboard/servicereminders",
          active: location.pathname === "/dashboard/servicereminders",
        },
        {
          name: "Vehicle Reminders",
          path: "/dashboard/vehiclereminders",
          active: location.pathname === "/dashboard/vehiclereminders",
        },
        {
          name: "Contact Reminders",
          path: "/dashboard/contactreminders",
          active: location.pathname === "/dashboard/contactreminders",
        },
      ],
    },
    {
      name: "Staff",
      path: "/dashboard/staff",
      icon: "icon material-icons md-people",
      active: location.pathname === "/dashboard/staff",
    },
    {
      name: "Fuel",
      path: "/dashboard/fuel",
      icon: "icon material-icons md-local_gas_station",
      active: location.pathname === "/dashboard/fuel",
    },
    {
      name: "Logout",
      path: "/dashboard/logout",
      icon: "icon material-icons md-log_out",
      active: location.pathname === "/dashboard/logout",
    },
  ];

  return (
    <div className="navbar-aside ps" id="offcanvas_aside">
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
              className={link.active ? "menu-item active" : "menu-item"}
            >
              <Link to={link.path} className="menu-link">
                <i className={link.icon}></i>
                <span className="text">{link.name}</span>
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
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
