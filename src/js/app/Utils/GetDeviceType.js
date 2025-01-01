export const getUserAgentDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let deviceType = "Unknown";
  // Check for specific keywords in the user agent string to identify device type

  switch (true) {
    case /Android/i.test(userAgent):
      deviceType = "Android";
      break;
    case /iPhone|iPad|iPod/i.test(userAgent):
      deviceType = "iOS";
      break;
    case /Windows Phone/i.test(userAgent):
      deviceType = "Windows Phone";
      break;
    case /Windows/i.test(userAgent):
      deviceType = "Windows";
      break;
    case /Macintosh/i.test(userAgent):
      deviceType = "Macintosh";
      break;
    case /Linux/i.test(userAgent):
      deviceType = "Linux";
      break;
    default:
      break;
  }

  return deviceType;
};
