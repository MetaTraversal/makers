// export const AppConfig = configData;
let wpData;
const getWordPressData = () => {
  if (configData !== "undefined") {
    return (wpData = configData);
  }
};
getWordPressData();

export const AppConfig = {
  SITE_URL: wpData?.SITE_URL,
  HOME_URL: wpData?.HOME_URL,
  THEME_DIR_URL: wpData?.THEME_DIR_URL,
  UPLOAD_DIR_URL: wpData?.UPLOAD_DIR_URL,
  SITE_TITLE: wpData?.SITE_TITLE,
  SITE_TAGLINE: wpData?.SITE_TAGLINE,
  SITE_CUSTOM_LOGO: wpData?.SITE_CUSTOM_LOGO,
  // "THEME_LOGO" => get_custom_logo()
  // "SITE_PLUGINS" => get_plugins(),
  // "SITE_ALL_OPTIONS" => wp_load_alloptions(),
  SITE_ACTIVE_PLUGINS: wpData?.SITE_ACTIVE_PLUGINS,
  SITE_FRONT_PAGE: wpData?.SITE_FRONT_PAGE,
  SITE_POST_PAGE: wpData?.SITE_POST_PAGE,
};
