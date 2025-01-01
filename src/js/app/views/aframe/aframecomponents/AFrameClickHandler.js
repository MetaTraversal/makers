export const AFrameClickHandler = () => {
    // Usage: Adds a click event to the entity to show the description
    AFRAME.registerComponent("show-details-on-click", {
      init: function () {
        let el = this.el;
        // Handle cursor interactions in VR
        el.addEventListener("raycaster-intersected", (event) => {
          // Your logic to display details or perform actions
          // For example, toggle visibility or trigger some action
          // Access the intersected entity using event.detail.el
          ShowDescription(event, el);
        });

        el.addEventListener("raycaster-intersected-cleared", (event) => {
          // Logic when the cursor is not intersecting with an entity
        });
      },
    });
  };