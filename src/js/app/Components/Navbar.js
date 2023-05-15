import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./../../../scss/style.scss";
import DataContext from "../Utils/DataContext";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [navbarMenus, setNavbarMenus] = useState([]);
  const [c2IDs, setC2IDs] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const { data, setData } = useContext(DataContext);

  // The useEffect hook is used to call the getData function once when the component is mounted.
  useEffect(() => {
    fetchMenuData();
  }, []);

  // This function fetches data from an API endpoint and sets the navbarMenus state variable to the retrieved data.
  async function fetchMenuData() {
    try {
      let stagingData = await fetch(
        "https://staging.webxr.link/wp-json/wp/v2/menus?menus"
      );
      let jsonData = await stagingData.json();
      let items = jsonData[0].items;
      setMenuData(items);
      setData(items);
    } catch (error) {
      console.log("Error fetching staging data: ", error);
    }
  }

  function setMenuData(items) {
    let head = items.filter((e) => e.menu_item_parent === "0")[0];
    let childItems = items.filter(
      (e) => parseInt(e.menu_item_parent) === head.ID
    );
    let nestedItems = [];
    let currIDs = [];
    for (let i = 0; i < childItems.length; i++) {
      let currChild = childItems[i];
      let allNestedChild = items.filter((e) => parseInt(e.menu_item_parent) === currChild.ID);
      if (allNestedChild.length > 0) {
        currIDs.push(currChild.ID);
        allNestedChild.map(ele => nestedItems.push(ele));
      }
    }
    setC2IDs(currIDs);
    let cData = [
      {
        head,
        childItems,
        nestedItems,
      },
    ];
    setNavbarMenus(cData);
  }

  /**
   * This is a functional React component that returns a Navbar.
   */

  return (
    <>
      <nav className="navbar">
        {/* The brand section of the Navbar */}
        <div className="navbar-brand">
          The Polys WebXR Awards and Summit Series
        </div>
        <div className="navbar-right">
          {/* The main dropdown menu items of the Navbar */}
          {navbarMenus ? (
            navbarMenus.map((currEle, i) => {

              let {head, childItems, nestedItems} = currEle;

              return (
                <div className="dropdown" key={i}>
                <button className="dropbtn">{head.title}</button>
                <div className="dropdown__content">
                  {childItems.map((menu, i) => {
                    const c = c2IDs.includes(menu.ID);
                    return (
                      <Link
                        className="dropdown__items"
                        key={i}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        to={menu.url}
                      >
                        {menu.title}
                        {c && (
                          <span className="n2-drop">
                            <i className="fa-solid fa-circle-chevron-down"></i>
                          </span>
                        )}
                        {c && hoveredIndex === i && (
                          <div className="n2">
                            {nestedItems.map((cur, i) => (
                              <Link
                                to={cur.url}
                                className="dropdown__items d2"
                                key={i}
                              >
                                {cur.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
              );
            })
          ) : (
            <></>
          )}
          {/* The social media logo section of the Navbar */}
          <div className="dropdown dropdown--logos dropdown__socials">
            <a
              href="https://twitter.com/webxrawards"
              rel="noreferrer"
              target="_blank"
            >
              <span className="dropdown__logo-img">
                <i className="fa-brands fa-twitter fa-xl"></i>
              </span>
            </a>
            <a
              href="https://www.instagram.com/webxrawards/"
              rel="noreferrer"
              target="_blank"
            >
              <span className="dropdown__logo-img">
                <i className="fa-brands fa-instagram fa-xl"></i>
              </span>
            </a>
            <a
              href="https://www.facebook.com/groups/webxrawards"
              rel="noreferrer"
              target="_blank"
            >
              <span className="dropdown__logo-img">
                <i className="fa-brands fa-facebook fa-xl"></i>
              </span>
            </a>
            <a
              href="https://www.linkedin.com/company/the-polys/"
              rel="noreferrer"
              target="_blank"
            >
              <span className="dropdown__logo-img">
                <i className="fa-brands fa-linkedin fa-xl"></i>
              </span>
            </a>
            <a
              href="https://discord.gg/T5vRuM5cDS"
              rel="noreferrer"
              target="_blank"
            >
              <span className="dropdown__logo-img">
                <i className="fa-brands fa-discord fa-xl"></i>
              </span>
            </a>
          </div>

          <div className="hamburger">
            <span
              className="hamburger__logo"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              <i className="fa-solid fa-bars fa-xl"></i>
            </span>
          </div>
          {/* The side menu that appears when the hamburger icon is clicked */}
          {showMenu === true ? (
            <div className="sideMenu">
              {
          navbarMenus ? (
            navbarMenus.map((currEle, i) => {

              let {head, childItems, nestedItems} = currEle;

              return (
                <div className="dropdown2" key={i}>
                <button className="dropbtn">{head.title}</button>
                <div className="dropdown__content">
                  {childItems.map((menu, i) => {
                    const c = c2IDs.includes(menu.ID);
                    return (
                      <Link
                        className="dropdown__items"
                        key={i}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        to={menu.url}
                      >
                        {menu.title}
                        {c && (
                          <span className="n2-drop">
                            <i className="fa-solid fa-circle-chevron-down"></i>
                          </span>
                        )}
                        {c && hoveredIndex === i && (
                          <div className="n2">
                            {nestedItems.map((cur, i) => (
                              <Link
                                to={cur.url}
                                className="dropdown__items d2"
                                key={i}
                              >
                                {cur.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
              );
            })
          ) : (
            <></>
          )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
