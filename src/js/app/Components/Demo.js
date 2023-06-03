import React, { useState, useEffect } from "react";
import assets from "../psudo_data/assets_demo.json";
import data from "./dynamicContent_demo.json";
// have used native file system till endpoints unavailable

function Demo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // loading inspector
    function loadAndGet() {
      var sceneEl = document.querySelector("a-scene");
      sceneEl.addEventListener("loaded", function () {
        sceneEl.components.inspector.openInspector();
      });
    }
    // creating new button for getting all the data for the entity
    function addMani() {
      setTimeout(function () {
        var ele = document.querySelector(
          "#scenegraph > div.outliner > div:nth-child(1)"
        );

        console.log(ele);
        ele.click();
        console.log("Clicked");
        // Create the <a> element
        var link = document.createElement("a");
        link.href = "#";
        link.title = "send data";
        link.setAttribute("data-action", "copy-entity-to-clipboard");
        link.classList.add("button", "fa", "fa-bookmark");

        // Append the <a> element to the specified location
        var parentElement = document.querySelector(
          "#componentEntityHeader > div.static > div.collapsible-header > div"
        );

        console.log("!!!!!!!!!!!!got the parent element");
        console.log(parentElement);
        parentElement.appendChild(link);
        dataToConsole();
      }, 10000); // Adjust the delay as needed
    }

    // getting data from the clipboard to console
    function dataToConsole() {
      var element = document.querySelector(
        "#componentEntityHeader > div.static > div.collapsible-header > div > a.button.fa.fa-bookmark"
      );

      // Add the onclick function
      element.onclick = function () {
        // Access the data from the clipboard
        navigator.clipboard.readText().then(function (clipboardData) {
          // Print the clipboard data to the console
          console.log(clipboardData);
          storeData(clipboardData);
        });
      };
    }

    function storeData(entityString) {
      // Create a temporary element to parse the string
      var tempElement = document.createElement("div");
      tempElement.innerHTML = entityString;

      // Get the attributes of the <a-entity> element
      var entityAttributes = tempElement.firstChild.attributes;

      // Convert the attributes into an object
      var entityObject = {};
      for (var i = 0; i < entityAttributes.length; i++) {
        var attr = entityAttributes[i];
        entityObject[attr.name] = attr.value;
      }

      // Convert the object to JSON string
      var jsonString = JSON.stringify(entityObject);
      console.log("!!!!!!!!!!!!!!!!!");
      console.log(jsonString);
      updateDataFile(jsonString);
    }

    function updateDataFile(jsonString) {
      const newData = JSON.parse(jsonString);
      var foundData = false;
      const updatedData = data.map((item) => {
        if (item.id === newData.id) {
          console.log("Found the item to update");
          foundData = true;
          return newData;
        } else {
          console.log("Not the item to update");
          return item;
        }
      });

      if (!foundData) updatedData.push(newData);
      const updatedJsonString = JSON.stringify(updatedData, null, 2);
      console.log("Updated data:", updatedData);
      const fileName = "dynamicContent_demo.json";
      saveJsonAsBlob(updatedJsonString, fileName);
    }

    function saveJsonAsBlob(updatedData, fileName) {
      const blob = new Blob([updatedData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Append the link to the document body and click it programmatically
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // Heavy models take time to load, hence wait for a while
    setTimeout(() => setLoading(false), 1000); // Wait for 1 second before setting loading to false

    loadAndGet();
    addMani();
  }, []);

  return (
    <>
      <a-scene>
        <a-entity
          id="rig"
          movement-controls="constrainToNavMesh: true;
          controls: checkpoint, gamepad, trackpad, keyboard, touch;"
        >
          <a-entity
            camera
            position="0 1.6 0"
            look-controls="pointerLockEnabled: true"
          ></a-entity>
        </a-entity>

        <a-assets>
          {assets.map((asset) => {
            if (asset.type === "model") {
              return (
                <a-asset-item
                  id={asset.id}
                  src={asset.url}
                  key={asset.id}
                  crossOrigin="anonymous"
                ></a-asset-item>
              );
            }
            return (
              <img
                id={asset.id}
                src={asset.url}
                key={asset.id}
                crossOrigin="anonymous"
              />
            );
          })}
        </a-assets>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <a-entity environment="preset:starry;groundTexture:  walkernoise;grid:none"></a-entity>
            <a-entity
              id="#room"
              gltf-model="#room"
              crossOrigin="anonymous"
              position="-1.693 0 0.07"
            ></a-entity>

            {/* Finally toggle visibility */}
            <a-entity
              nav-mesh
              id="#navmesh"
              gltf-model="#navmesh"
              crossOrigin="anonymous"
              visible="true"
            ></a-entity>

            {data.map((entity) => (
              <a-entity key={entity.id} {...entity}></a-entity>
            ))}
          </>
        )}

        <a-light
          type="directional"
          color="#ffffff"
          intensity="0.8"
          position="0.12062 1.52455 0.52977"
          light="type: point; angle: 180"
          rotation="-0.3 50.509 147.30229250797848"
          id="bulb"
          visible=""
        ></a-light>
        <a-light
          type="directional"
          color="#ffffff"
          intensity="0.8"
          position="3.94786 -1.28516 -0.54807"
          light="type: hemisphere; angle: 180"
          rotation="-0.3 50.509 147.30229250797848"
          id="bulb-3"
        ></a-light>
        <a-light
          type="hemisphere"
          color="#ffffff"
          intensity="0.8"
          position="20.45283 -2.62394 -5.68868"
          light="type: hemisphere; angle: 180"
          rotation="-0.3 50.509 147.30229250797848"
          id="bulb-4"
        ></a-light>

        {/* floor collider */}
        <a-plane
          static-body="shape:  mesh"
          position="0 0 -4"
          visible="false"
          rotation="-90 0 0"
          width="4"
          height="4"
          color="#7BC8A4"
          scale="6 2 2"
        ></a-plane>
      </a-scene>
    </>
  );
}

export default Demo;