import React from "react";

function ProtectedPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card mt-8">
            <div className="card-header bg-gradient-primary p-4 text-center">
              <i
                className="material-symbols-rounded text-white"
                style={{ fontSize: "3rem" }}
              >
                lock
              </i>
              <h3 className="text-white mb-0 mt-2">Protected Area</h3>
            </div>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="icon icon-shape bg-gradient-primary shadow-primary text-center border-radius-md mx-auto mb-3">
                  <i
                    className="material-symbols-rounded opacity-10"
                    style={{ fontSize: "2rem" }}
                  >
                    verified_user
                  </i>
                </div>
                <h4 className="text-dark">You're Authenticated!</h4>
                <p className="text-secondary">
                  This page is only accessible to authenticated users through
                  Clerk authentication.
                </p>
              </div>

              <div className="alert alert-success" role="alert">
                <div className="d-flex align-items-center">
                  <i className="material-symbols-rounded me-2">check_circle</i>
                  <div>
                    <strong>Success!</strong> Your session is active and secure.
                  </div>
                </div>
              </div>

              <hr className="horizontal dark my-4" />

              <h5 className="mb-3">Security Features</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-flex">
                    <div className="icon icon-sm icon-shape bg-gradient-primary shadow text-center border-radius-md me-3">
                      <i className="material-symbols-rounded opacity-10">
                        security
                      </i>
                    </div>
                    <div>
                      <h6 className="mb-1">JWT Authentication</h6>
                      <p className="text-sm text-secondary mb-0">
                        Secure token-based authentication
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex">
                    <div className="icon icon-sm icon-shape bg-gradient-primary shadow text-center border-radius-md me-3">
                      <i className="material-symbols-rounded opacity-10">
                        encrypted
                      </i>
                    </div>
                    <div>
                      <h6 className="mb-1">Encrypted Connection</h6>
                      <p className="text-sm text-secondary mb-0">
                        All data transmitted securely
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex">
                    <div className="icon icon-sm icon-shape bg-gradient-primary shadow text-center border-radius-md me-3">
                      <i className="material-symbols-rounded opacity-10">
                        shield_lock
                      </i>
                    </div>
                    <div>
                      <h6 className="mb-1">Protected Routes</h6>
                      <p className="text-sm text-secondary mb-0">
                        Backend API routes are secured
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex">
                    <div className="icon icon-sm icon-shape bg-gradient-primary shadow text-center border-radius-md me-3">
                      <i className="material-symbols-rounded opacity-10">
                        admin_panel_settings
                      </i>
                    </div>
                    <div>
                      <h6 className="mb-1">User Management</h6>
                      <p className="text-sm text-secondary mb-0">
                        Managed by Clerk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedPage;
