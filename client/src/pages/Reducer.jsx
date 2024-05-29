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
            </li>
          ))}
        </ul>
      </nav>
    </div>