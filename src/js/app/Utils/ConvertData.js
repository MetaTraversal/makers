/**
 * Converts HTML content to plain text.
 * @param {string} htmlContent - HTML content to be converted to text
 * @returns {string} - Plain text extracted from HTML content
 */
export const HtmlToText = (htmlContent) => {
  try {
    console.log("htmlContent", htmlContent);
    if (!htmlContent || typeof htmlContent !== "string") {
      throw new Error("Invalid or empty HTML content provided.");
    }

    // Create a new DOMParser instance
    const parser = new DOMParser();
    // Parse the HTML content
    const parsedDocument = parser.parseFromString(htmlContent, "text/html");

    // Extract the plain text using textContent
    const textContent = parsedDocument.body.textContent || "";

    return textContent.trim(); // Trim any leading/trailing whitespace
  } catch (error) {
    console.error("Error occurred while converting HTML to text:", error);
    return ""; // Return empty string or throw the error further
  }
};



/**
 * Creates a JSON string from HTML attributes fetched from a string representation of an HTML element.
 * @param {string} entityString - String representation of an HTML element
 * @returns {string} - JSON string representation of HTML attributes
 */
export const CreateJsonString = (entityString) => {
  try {
    // Create a temporary element to parse the string
    const tempElement = document.createElement("div");
    tempElement.innerHTML = entityString;

    const entityAttributes = tempElement.firstChild?.attributes;

    if (!entityAttributes || entityAttributes.length === 0) {
      throw new Error("No attributes found or invalid entityString provided.");
    }

    // Convert the attributes into an object
    const entityObject = {};
    for (let i = 0; i < entityAttributes.length; i++) {
      const attr = entityAttributes[i];
      entityObject[attr.name] = attr.value;
    }

    // Convert the object to JSON string
    const jsonString = JSON.stringify(entityObject);
    return jsonString;
  } catch (error) {
    console.error("Error occurred:", error);
    return null; // or throw the error further
  }
};
