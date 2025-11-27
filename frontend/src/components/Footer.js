import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer pt-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-4 ms-auto">
            <div>
              <h6 className="font-weight-bolder mb-4 text-gradient">CarDoc</h6>
              <p className="text-sm text-secondary">
                AI-powered document summarization for your car documents
              </p>
            </div>
            <div>
              <ul className="d-flex flex-row ms-n3 nav">
                <li className="nav-item">
                  <a
                    className="nav-link pe-1"
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github text-lg opacity-8"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link pe-1"
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter text-lg opacity-8"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link pe-1"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin text-lg opacity-8"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-2 col-sm-6 col-6 mb-4">
            <div>
              <h6 className="text-sm">Product</h6>
              <ul className="flex-column ms-n3 nav">
                <li className="nav-item">
                  <a className="nav-link" href="#features">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#pricing">
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#faq">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-2 col-sm-6 col-6 mb-4">
            <div>
              <h6 className="text-sm">Resources</h6>
              <ul className="flex-column ms-n3 nav">
                <li className="nav-item">
                  <a className="nav-link" href="#documentation">
                    Documentation
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#api">
                    API
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#support">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-2 col-sm-6 col-6 mb-4">
            <div>
              <h6 className="text-sm">Company</h6>
              <ul className="flex-column ms-n3 nav">
                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    About Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">
                    Contact
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#blog">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-2 col-sm-6 col-6 mb-4 me-auto">
            <div>
              <h6 className="text-sm">Legal</h6>
              <ul className="flex-column ms-n3 nav">
                <li className="nav-item">
                  <a className="nav-link" href="#terms">
                    Terms & Conditions
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#privacy">
                    Privacy Policy
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#cookies">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-12">
            <div className="text-center">
              <p className="text-dark my-4 text-sm font-weight-normal">
                All rights reserved. Copyright © {currentYear} CarDoc.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
