import { Navbar } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { Button } from "flowbite-react";
import logo from "/logo.svg";
import React from "react";

export default function NavbarComponent() {
  function isAuthenticated() {
    const token = localStorage.getItem("jwt");
    return !!token;
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.reload(true);
  };

  return (
    <Navbar
      fluid={true}
      rounded={true}
      className="!bg-transparent"
      id="navbar"
      style={{
        fontSize: "2rem",
      }}
    >
      <Navbar.Brand href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="ReviewRealm Logo" />
        <span className="self-center whitespace-nowrap font-montserrat text-white text-xl font-normal dark:text-white">
          REVIEW
        </span>
        <span className="self-center whitespace-nowrap font-montserrat font-normal text-[#558EFF] text-xl dark:text-white">
          REALM
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {isAuthenticated() ? (
          <Button onClick={handleLogout}>Sign out</Button>
        ) : (
          <Button href="/generate">Get started</Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <NavLink to="/" exact="true" activeclassname="active">
          Home
        </NavLink>
        <NavLink to="/about" exact="true" activeclassname="active">
          About
        </NavLink>
        <NavLink to="/generate" exact="true" activeclassname="active">
          Generate
        </NavLink>

        {isAuthenticated() && (
          <NavLink to="/about" exact activeClassName="active">
            AboutAuth
          </NavLink>
        )}
      </Navbar.Collapse>
    </Navbar>
    // </div>
  );
}
