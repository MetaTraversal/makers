import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";

import "@styles/style.scss";
import { AppConfig } from "../../config/AppConfig";
import { DataContext } from "../../context";

export const Header = () => {
  const [mainMenus, setMainMenus] = useState([]);
  const [parentMenus, setParentMenus] = useState([]);
  const [childMenus, setChildMenus] = useState([]);
  const { activeLanguages, menuData, lang, setLang } = useContext(DataContext);

  useMemo(() => {
    menuData.filter((item) => {
      if (item?.slug == "main-menu") {
        setMainMenus(item?.items);
      }
    });
  }, [menuData, lang]);

  const SubNestedMenus = ({ items }) => {
    console.log("SubNested Menus Item", items);
    return (
      items.length > 0 && (
        <ul className="dropdown-menu dropdown__content subNested-Menus">
          {items.map((childItem) => (
            <li key={childItem.ID} className="nav-item">
              <Link className="dropdown-item" to={childItem.url}>
                {childItem.title}
              </Link>
              {/* <NestedMenu
                items={items.filter(
                  (subItem) => subItem.menu_item_parent == childItem.ID
                )}
              /> */}
            </li>
          ))}
        </ul>
      )
    );
  };

  const NestedMenu = ({ items }) => {
    // console.log("Nested Item", items);
    return (
      items?.length > 0 && (
        <ul className="dropdown-menu dropdown__content">
          {items.map((childItem) => (
            <li key={childItem?.ID} className="nav-item">
              <Link className="dropdown-item" to={childItem?.url}>
                {childItem?.title}
              </Link>
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <header className="App-header">
      <div className="App-header-left">
        <Link className="" to="/">
          {AppConfig?.SITE_CUSTOM_LOGO && (
            <div className="App-logo">
              <img src={AppConfig?.SITE_CUSTOM_LOGO[0]} alt="logo" />
            </div>
          )}
          <div className="App-title">
            {AppConfig.SITE_TITLE ? (
              <h4 className="title-head"> {AppConfig.SITE_TITLE}</h4>
            ) : (
              <h4 className="title-head"> WebXR By - PowerSimple </h4>
            )}
          </div>
        </Link>
      </div>
      <div className="App-header-right  d-flex flex-row-reverse ">
        <nav className="navbar navbar-expand-lg navbar-dark  ">
          <div className="container-fluid navbar-container ">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarToggleBtn"
              aria-controls="navbarToggleBtn"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarToggleBtn">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                {
                  /* The main dropdown menu items of the Navbar */

                  mainMenus?.length > 0 &&
                    mainMenus?.map((menuItem) => {
                      if (menuItem.menu_item_parent === "0") {
                        return (
                          <li className="nav-item dropdown" key={menuItem.ID}>
                            <Link
                              className="dropdownbtn nav-link active"
                              to={menuItem.url}
                            >
                              {menuItem.title}
                            </Link>
                            <NestedMenu
                              items={mainMenus.filter(
                                (childItem) =>
                                  childItem.menu_item_parent == menuItem.ID
                              )}
                            />
                          </li>
                        );
                      }
                    })
                }

                {
                  /* The activeLanguages items of the Navbar */
                  activeLanguages?.length > 0 && (
                    <li className="nav-item dropdown">
                      <Link className="dropdownbtn nav-link active" to="#">
                        Languages
                      </Link>
                      <ul className="dropdown-menu dropdown__content">
                        {activeLanguages?.map((item, index) => {
                          let code = item?.code;
                          if (code == "en") {
                            code = "";
                          }

                          return (
                            <li className="nav-item" key={index}>
                              <span
                                className="dropdown-item"
                                onClick={() => setLang(`${code}`)}
                              >
                                {item?.native_name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
