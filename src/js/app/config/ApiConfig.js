import { AppConfig } from "./AppConfig";
import { getUserAgentDeviceInfo } from "../utils";

const BASE_URL = AppConfig.SITE_URL;
const TIMEOUT_DURATION = 20000; // Timeout for HTTP requests (20 seconds)
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  // Other headers can be added here
};

const handleErrors = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (error) {
      errorData = { message: "Response is not in JSON format" };
    }
    const errorMessage = `HTTP error! Status: ${response.status}. ${
      errorData.message || ""
    }`;
    const error = new Error(errorMessage);
    error.response = response;
    throw error;
  }
  return response.json();
};

const requestInterceptor = async (options) => {
  // Modify request options here if needed before sending the request
  const deviceType = getUserAgentDeviceInfo();
  return {
    ...options,
    headers: { ...options.headers, "X-Device-Type": deviceType },
  };
};

const responseInterceptor = async (response) => {
  // Modify response data here if needed before returning the result
  return handleErrors(response);
};

const makeRequest = async (endpoint, method, payload) => {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: DEFAULT_HEADERS,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: method !== "GET" ? JSON.stringify(payload) : undefined,
    timeout: TIMEOUT_DURATION,
  };

  try {
    const interceptedOptions = await requestInterceptor(options);
    console.log("requestInterceptor", interceptedOptions);
    const response = await fetch(url, interceptedOptions);
    const result = await responseInterceptor(response);
    console.log("responseInterceptor", result);
    return result;
  } catch (error) {
    console.error("Error occurred while making the HTTP request:", error);
    throw new Error(`HTTP Request Error: ${error.message}`);
  }
};

export const HttpRequest = {
  httpGet: (endpoint) => {
    return makeRequest(endpoint, "GET", null);
  },
  httpPost: (endpoint, payload) => {
    return makeRequest(endpoint, "POST", payload);
  },
  httpPut: (endpoint, payload) => {
    return makeRequest(endpoint, "PUT", payload);
  },
  httpDelete: (endpoint) => {
    return makeRequest(endpoint, "DELETE", null);
  },
};
