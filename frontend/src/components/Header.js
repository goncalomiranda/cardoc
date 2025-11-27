import React from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="container position-sticky z-index-sticky top-0">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg blur border-radius-xl top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4 navbar-custom">
            <div className="container-fluid px-0">
              <Link className="navbar-brand font-weight-bolder ms-sm-3" to="/">
                <i className="material-symbols-rounded me-2">directions_car</i>
                CarDoc
              </Link>
              <button
                className="navbar-toggler shadow-none ms-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navigation"
                aria-controls="navigation"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon mt-2">
                  <span className="navbar-toggler-bar bar1"></span>
                  <span className="navbar-toggler-bar bar2"></span>
                  <span className="navbar-toggler-bar bar3"></span>
                </span>
              </button>
              <div
                className="collapse navbar-collapse pt-3 pb-2 py-lg-0"
                id="navigation"
              >
                <ul className="navbar-nav navbar-nav-hover ms-auto">
                  <SignedIn>
                    <li className="nav-item mx-2">
                      <Link
                        className="nav-link ps-2 d-flex align-items-center"
                        to="/"
                      >
                        <i className="material-symbols-rounded opacity-6 me-2">
                          upload_file
                        </i>
                        <span className="d-sm-inline d-none">Upload</span>
                      </Link>
                    </li>
                    <li className="nav-item mx-2">
                      <Link
                        className="nav-link ps-2 d-flex align-items-center"
                        to="/protected"
                      >
                        <i className="material-symbols-rounded opacity-6 me-2">
                          lock
                        </i>
                        <span className="d-sm-inline d-none">Protected</span>
                      </Link>
                    </li>
                    <li className="nav-item ms-2">
                      <div className="d-flex align-items-center">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </li>
                  </SignedIn>
                  <SignedOut>
                    <li className="nav-item ms-2">
                      <SignInButton mode="modal">
                        <button className="btn btn-sm bg-gradient-primary mb-0">
                          <i className="material-symbols-rounded me-1">login</i>
                          Sign In
                        </button>
                      </SignInButton>
                    </li>
                  </SignedOut>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
