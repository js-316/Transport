import React from "react";
import LetteredAvatar from "react-lettered-avatar";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCar } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";


const Navbar = () => {
  const user = useSelector(selectUser)
  return (
    <header className="main-header navbar">
    <div className="col-lg-4 col-md-6 me-auto">
    <div className="input-group">
    <Link to="/dashboard" className="input-group-text">
    <FontAwesomeIcon icon={faCar} 
    size="lg" 
    style={{ fontSize: 24, color: '#008000' }} 
    />
    <span>
      
    </span>
    </Link>


    {/* <span className="input-group-text">
      <FontAwesomeIcon icon={faSearch} />
    </span>
    <input
      type="text"
      placeholder="Search..."
      onChange={(e) => setSearchQuery(e.target.value)}
      className="form-control"
    /> */}

  </div>
</div>



      
      {/* <div className="col-search">
        <form className="searchform">
          <div className="input-group">
            <input
              list="search_terms"
              type="text"
              className="form-control"
              placeholder="Search term"
              value={""}
              onChange={() => {}}
              readOnly
            />
            <button className="btn btn-light bg" type="button">
              {" "}
              <i className="material-icons md-search"></i>
            </button>
          </div>
        </form>
      </div> */}
      <div className="col-nav">
        <button
          className="btn btn-icon btn-mobile me-auto"
          data-trigger="#offcanvas_aside"
        >
          {" "}
          <i className="material-icons md-appsz "></i>{" "}
        </button>

        <ul className="nav">
          <li className="nav-item">
            <a 
            title={user.username || user.email}
            href="#" className="requestfullscreen nav-link btn-icon">
              <LetteredAvatar
                size={48}
                name={user.username || user.email}
                color="#fff"
                background="#000"
              />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
