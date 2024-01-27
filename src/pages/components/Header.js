import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="header container-fluid">
      <div className="header-logo row">
        <div className="container">
          <strong className="header-logo__title">КнигоМания</strong>
          <span className="header-logo__description">Найди свою книгу</span>
        </div>
      </div>
      <div className="header-menu row">
        <nav className="navbar navbar-inverse navbar-static-top">
          <div className="container">
            <div className="w-100">
              <div className="nav navbar-nav flex-row">
                <span className={location.pathname === "/" ? "active" : ""}>
                  <Link to="/">Главная</Link>
                </span>
                <span className={location.pathname === "/admin" ? "active" : ""}>
                  <Link to="/admin">Админка</Link>
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
