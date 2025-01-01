import React from "react";
import { Link } from "react-router-dom";

import "@styles/style.scss";
import { AppConfig } from "../../config/AppConfig";

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        {/* <div className="row">
          <div className="col-2">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Features
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Pricing
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-2">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Features
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Pricing
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-2">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Features
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  Pricing
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="#" className="nav-link p-0 text-muted">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-4 offset-1">
            <form>
            <h5>Subscribe to our newsletter</h5>
            <p>Monthly digest of whats new and exciting from us.</p>
            <div className="d-flex w-100 gap-2">
              <label for="newsletter1" className="visually-hidden">
                Email address
              </label>
              <input id="newsletter1" type="text" className="form-control" placeholder="Email address">
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </form>
          </div>
        </div> */}

        <div className="d-flex justify-content-between py-4 my-4 border-top">
          <p>
            © 2023
            {AppConfig.SITE_TITLE ? (
              <span> {AppConfig.SITE_TITLE}</span>
            ) : (
              <span> Site Title </span>
            )}
            . All rights reserved.
          </p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3">
              <Link
                className="link-light"
                href="https://twitter.com/webxrawards"
                rel="noreferrer"
                target="_blank"
              >
                <span className="dropdown__logo-img">
                  <i className="fa-brands fa-twitter fa-xl"></i>
                </span>
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="link-light"
                href="https://www.instagram.com/webxrawards/"
                rel="noreferrer"
                target="_blank"
              >
                <span className="dropdown__logo-img">
                  <i className="fa-brands fa-instagram fa-xl"></i>
                </span>
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="link-light"
                href="https://www.facebook.com/groups/webxrawards"
                rel="noreferrer"
                target="_blank"
              >
                <span className="dropdown__logo-img">
                  <i className="fa-brands fa-facebook fa-xl"></i>
                </span>
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="link-light"
                href="https://www.linkedin.com/company/the-polys/"
                rel="noreferrer"
                target="_blank"
              >
                <span className="dropdown__logo-img">
                  <i className="fa-brands fa-linkedin fa-xl"></i>
                </span>
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="link-light"
                href="https://discord.gg/T5vRuM5cDS"
                rel="noreferrer"
                target="_blank"
              >
                <span className="dropdown__logo-img">
                  <i className="fa-brands fa-discord fa-xl"></i>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
