export const Clipboard = {
  // Function to check clipboard read permission
  checkClipboardReadPermission: async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "clipboard-read",
      });
      console.log("Clipboard permission status:", permissionStatus.state);
      permissionStatus.onchange = () => {
        console.log("Permission status changed to:", permissionStatus.state);
      };
      return permissionStatus.state; // Return the permission status
    } catch (err) {
      console.error("Error checking clipboard permission:", err);
      throw new Error(err); // Throw the error
    }
  },

  // Function to get data from clipboard
  getFromClipBoard: async () => {
    try {
      const permissionState = await Clipboard.checkClipboardReadPermission();
      return new Promise(async (resolve, reject) => {
        if (permissionState === "granted" || permissionState === "prompt") {
          if (navigator.clipboard) {
            try {
              const text = await navigator.clipboard.readText();
              console.log("Text from clipboard:...", text);
              resolve(text); // Resolve the promise with the clipboard text
            } catch (err) {
              console.error("Failed to read clipboard:", err);
              alert(
                "Failed to read clipboard data. Check console for error details."
              );
              reject(new Error(err)); // Reject the promise with the error
            }
          } else {
            console.error("Clipboard API is not supported in this browser.");
            alert("Clipboard API is not supported in this browser.");
            reject(new Error("Clipboard API is not supported"));
          }
        } else {
          console.error("Clipboard permission denied in this browser.");
          alert("Clipboard permission denied in this browser.");
          reject(new Error("Clipboard permission denied"));
        }
      });
    } catch (err) {
      console.error("Error checking clipboard permission:", err);
      throw err; // Propagate the error
    }
  },
};
