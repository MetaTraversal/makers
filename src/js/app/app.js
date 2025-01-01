import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { routes } from "./routes";
import { AppLoader } from "./components";
import { ApiEndpoint, AppConfig, HttpRequest } from "./config";
import { DataContext } from "./context";

const App = () => {
  const base_url = AppConfig.SITE_URL;
  const [loading, setLoading] = useState(false);
  const [activeLanguages, setActiveLanguages] = useState([
    {
      code: "en",
      native_name: "English",
      is_default: true,
    },
  ]);
  const [menuData, setMenuData] = useState([]);
  const [lang, setLang] = useState([]);

  useEffect(() => {
    // console.log("app config", AppConfig);
    getActiveLanguages();
    getMenuData();
  }, [lang]);

  const getActiveLanguages = () => {
    let SITE_ACTIVE_PLUGINS = AppConfig.SITE_ACTIVE_PLUGINS;
    let wpml = "sitepress-multilingual-cms/sitepress.php";
    if (!SITE_ACTIVE_PLUGINS.includes(wpml)) {
      setActiveLanguages();
    } else {
      const url = `${ApiEndpoint.GET_ACTIVE_LANGUAGES}`;

      HttpRequest.httpGet(url)
        .then((result) => {
          setActiveLanguages(result);
        })
        .catch((error) => {
          console.log("Error when getting ActiveLanguages data", error);
        })
        .finally(() => {});
    }
  };

  const getMenuData = () => {
    setLoading(true);
    const url = `/${lang}${ApiEndpoint.GET_MENUS}?menus`;
    HttpRequest.httpGet(url)
      .then((result) => {
        setMenuData(result);
      })
      .catch((error) => {
        console.log("Error when getting menu data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <DataContext.Provider
          value={{
            activeLanguages: activeLanguages,
            setActiveLanguages: setActiveLanguages,
            menuData: menuData,
            setMenuData: setMenuData,
            lang: lang,
            setLang: setLang,
          }}
        >
          <RouterProvider router={routes} />
        </DataContext.Provider>
      )}
    </>
  );
};
export default App;
