import React, { useState, useEffect, useContext, useRef } from "react";

import { ApiEndpoint, AppConfig, HttpRequest } from "../../config";
import { AppFonts } from "../../constants";
import { Clipboard, CreateJsonString, HtmlToText } from "../../utils";
import { DataContext } from "../../context";

const AFrame = (props) => {
  const base_url = AppConfig.SITE_URL;
  const upload_dir = AppConfig.UPLOAD_DIR_URL["baseurl"];
  const aFrameData = props?.aFrameData;
  const PAGE_SLUG = aFrameData?.slug;
  const { activeLanguages } = useContext(DataContext); // For all languages supported
  const [loading, setLoading] = useState(false); // For asset loading
  const [elementDetected, setElementDetected] = useState(false); // For inspector loaded
  const [assetsData, setAssetsData] = useState([]);

  const langRef = useRef(null); // Current language state
  const prev_langRef = useRef(null); // Previous language state
  const data = useRef([{}]); // Data from inspector

  const targetNodeRef = useRef(null);

  useEffect(() => {
    console.log("AFrame Data....", aFrameData);
    langRef.current = aFrameData?.languages?.default;
    prev_langRef.current = aFrameData?.languages?.default;
    getAssetsData();
  }, []);

  useEffect(() => {
    // checkElement();

    // Set up a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(checkElement);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, [elementDetected]);

  const checkElement = () => {
    // Usage: Checks if the inspector has been opened for the first time
    let ele = document.querySelector(
      "#scenegraph > div.outliner > div:nth-child(1)"
    );
    if (ele !== null && !elementDetected) {
      console.log("Inspector has been opened for the first time");
      addSaveButton();
      // Update the state to indicate that the element has been detected
      setElementDetected(true);
    }
  };

  const addSaveButton = () => {
    // Usage: Opens the Right Pane to add custom button
    let ele = document.querySelector(
      "#scenegraph > div.outliner > div:nth-child(1)"
    );
    ele.click();
    // console.log("Right Pane Opened", ele);
    // Function to create and append the save button
    let parentElement = document.querySelector(
      "#componentEntityHeader > div.static > div.collapsible-header > div"
    );
    setTimeout(function () {
      // Usage: Create an <a> element that is appended to the specified location in the inspector.
      // Properties: "copy-entity-to-clipboard" consolidates element attributes into string and copies to clipboard.
      if (parentElement) {
        let updateBtn = document.createElement("a");
        updateBtn.href = "#";
        updateBtn.title = "Save Element Data";
        updateBtn.setAttribute("data-action", "copy-entity-to-clipboard");
        updateBtn.id = "update-btn";
        // Add multiple classes to the button
        updateBtn.className = "button fa fa-floppy-disk";
        parentElement.appendChild(updateBtn);
        console.log("Save Button Added");
        fetchDataClipboard();
      }
    }, 500);
  };

  const fetchDataClipboard = async () => {
    // Usage: Fetches the data from the clipboard and stores it in a variable
    const updateBtn = document.getElementById("#update-btn");
    let clipboardData = await Clipboard.getFromClipBoard();
    updateBtn.onClick = function () {
      console.log("clipboardData", clipboardData);
      const jsonResult = CreateJsonString(clipboardData);
      if (jsonResult !== null) {
        console.log("JSON element:", jsonResult);
        // updateApiData(jsonResult);
      } else {
        console.log("Failed to create JSON string.");
      }
    };
  };

  // function updateApiData(jsonString) {
  //   // Usage: Updates the API data with the new JSON string
  //   // Functionality: Checks if the data exists in the API, if yes, updates the data, else adds the data to the API. Considers the "id" attribute to check if the data exists.
  //   const newData = JSON.parse(jsonString);
  //   delete newData["gltf-model"];
  //   delete newData["value"];
  //   delete newData["show-details-on-click"];
  //   delete newData["troika-text"];

  //   if (
  //     Array.isArray(data.current) &&
  //     data.current.length === 1 &&
  //     Object.keys(data.current[0]).length === 0
  //   ) {
  //     console.log("!!!!!No data found, adding new data");
  //     const updatedJsonString = JSON.stringify([newData], null, 2);
  //     updateInspectorData(updatedJsonString);
  //     return;
  //   }
  //   var foundData = false;
  //   var foundClassData = false;
  //   const updatedData = data.current.map((item) => {
  //     if (
  //       item?.class !== undefined &&
  //       newData?.class !== undefined &&
  //       newData?.class === item?.class
  //     ) {
  //       foundClassData = true;
  //       var alteredClassData = updateClassData(newData);
  //       return alteredClassData;
  //     } else if (newData?.id !== undefined && item?.id === newData?.id) {
  //       foundData = true;
  //       return newData;
  //     } else {
  //       return item;
  //     }
  //   });

  //   if (!foundData && newData?.id !== undefined && newData?.class === undefined)
  //     updatedData.push(newData);

  //   if (newData?.class !== undefined && !foundClassData) {
  //     var alteredClassData = updateClassData(newData);
  //     updatedData.push(alteredClassData);
  //   }

  //   const updatedJsonString = JSON.stringify(updatedData, null, 2);
  //   console.log("Updated data:", updatedData);
  //   updateInspectorData(updatedJsonString);
  // }

  // function updateClassData(json) {
  //   // Usage: Updates the class data to remove all object specific data
  //   const { value, id, visible, src, ...newJson } = json;
  //   return newJson;
  // }

  // Usage: updated the inspector data
  const updateInspectorData = async (data) => {
    const url = `/${ApiEndpoint.UPDATE_INSPECTOR_DATA}`;

    var formdata = new FormData();
    formdata.append("file", new Blob([data]));
    const file_name = PAGE_SLUG + ".json";
    formdata.append("page", file_name);

    HttpRequest.httpPost(url, formdata)
      .then((result) => {
        const dataResp = JSON.parse(result);
        alert(dataResp.message);
        getAssetsData();
      })
      .catch((error) => {
        console.log("UPDATE_INSPECTOR_DATA Error", error);
      });
  };

  // Usage: GetAssets Data from JsonFile
  const getAssetsData = () => {
    setLoading(true);
    const url = `/${ApiEndpoint.GET_ASSETS_DATA}/${PAGE_SLUG}.json`;
    HttpRequest.httpGet(url)
      .then((result) => {
        setAssetsData(result);
        // data.current = result;
        // AddClickEvent();
      })
      .catch((error) => {
        console.log("Error when getting Assets data", error);
      })
      .finally(() => {
        console.log("GET_ASSETS_DATA finaly response");
        setLoading(false);
      });
  };

  // const handleButtonClick = (event) => {
  //   // Usage: Handles language change on button click
  //   var buttonText = event.target.getAttribute("code");
  //   if (buttonText == "") {
  //     buttonText = "en";
  //   }
  //   prev_langRef.current = langRef.current;
  //   langRef.current = buttonText;
  //   if (prev_langRef.current !== langRef.current) {
  //     event.target.click();
  //   }
  // };

  // const AddClickEvent = () => {
  //   // Usage: Adds a click event to the entity to show the description
  //   AFRAME.registerComponent("show-details-on-click", {
  //     init: function () {
  //       let el = this.el;
  //       // Handle cursor interactions in VR
  //       el.addEventListener("raycaster-intersected", (event) => {
  //         // Your logic to display details or perform actions
  //         // For example, toggle visibility or trigger some action
  //         // Access the intersected entity using event.detail.el
  //         ShowDescription(event, el);
  //       });

  //       el.addEventListener("raycaster-intersected-cleared", (event) => {
  //         // Logic when the cursor is not intersecting with an entity
  //       });
  //     },
  //   });
  // };

  // function ShowDescription(event, Obj) {
  //   // Usage: Handles rendering of language change and toggle
  //   var children_lang = Obj.querySelectorAll("a-entity");

  //   for (var i = 0; i < children_lang.length; i += 2) {
  //     if (children_lang[i]?.getAttribute("id") === langRef.current) {
  //       children_lang[i].setAttribute("visible", "true");
  //       var state = !children_lang[i + 1].getAttribute("visible");
  //       children_lang[i + 1].setAttribute("visible", state);
  //     } else {
  //       children_lang[i].setAttribute("visible", "false");
  //       var state = !children_lang[i + 1].getAttribute("visible");
  //       children_lang[i + 1].setAttribute("visible", state);
  //     }
  //   }

  //   // Prevent event propagation to avoid closing the inspector
  //   event.stopPropagation();
  //   event.preventDefault();
  // }

  return (
    <div
      ref={targetNodeRef}
      id="aframe-container"
      style={{ height: "100vh", width: "100%" }}
    >
      <a-scene
        embedded
        environment="preset: forest; ground: canyon;groundTexture: walkernoise; groundColor: #2b291c; groundColor2: #312f20; dressingColor: #124017; grid: cross;"
        loading-screen="enabled: true;dotsColor: #FF3D00; backgroundColor: #252544"
        device-orientation-permission-ui="enabled: false"
        vr-mode-ui="enabled: true;"
        // webxr="requiredFeatures: hit-test,local-floor;
        //         optionalFeatures: dom-overlay,unbounded;
        //         overlayElement: #overlay;"
        cursor="rayOrigin: mouse; fuse: false"
        raycaster="objects: .raycastable"
        physics="gravity: -9.8"
      >
        {/* assets loading */}
        <a-assets timeout="5000">
          {aFrameData?.properties_3D?.world_model && (
            <a-asset-item
              id="world_model"
              src={aFrameData?.properties_3D?.world_model?.src}
              crossOrigin="anonymous"
            ></a-asset-item>
          )}
          {aFrameData.properties_3D?.nav_mesh && (
            <a-asset-item
              id="nav_mesh"
              src={aFrameData.properties_3D?.nav_mesh?.src}
              crossOrigin="anonymous"
            ></a-asset-item>
          )}
          {aFrameData?.properties_3D?.skybox && (
            <a-asset-item
              id="skybox"
              src={aFrameData?.properties_3D?.skybox?.src}
              crossOrigin="anonymous"
            ></a-asset-item>
          )}

          {aFrameData?.properties_3D?.furniture?.length > 0 &&
            aFrameData?.properties_3D?.furniture?.map((furniture) => {
              return (
                <a-asset-item
                  key={furniture?.id}
                  id={furniture?.slug}
                  src={base_url + furniture?.full_path}
                  crossOrigin="anonymous"
                ></a-asset-item>
              );
            })}

          {aFrameData?.post_media?.screen_image?.length > 0 &&
            aFrameData?.post_media?.screen_image?.map((scientist) => {
              return (
                <img
                  key={scientist?.id}
                  id={scientist?.slug}
                  src={base_url + scientist?.full_path}
                  alt={scientist?.alt}
                  crossOrigin="anonymous"
                ></img>
              );
            })}
        </a-assets>

        {/* CameraRig, Camera and Conrols */}
        <a-entity
          id="cameraRig"
          // position="25 10 0"
          rotation-reader
          thumbstick-logging
          movement-controls="constrainToNavMesh: true; speed:1; controls: checkpoint, gamepad, trackpad, keyboard, touch;"
          checkpoint-controls="mode: animate"
        >
          <a-entity
            id="camera"
            camera="active: true"
            position="0 1.6 0"
            rotation="-4.469070802020421 -84.91234523838803 0"
            look-controls="hmdEnabled: true; reverseMouseDrag: false; inverted: false; fly: true;"
            wasd-controls="acceleration: 100"
            // kinematic-body
            // collision-check
            raycaster="far: 5; objects: .clickable"
            super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
          >
            <a-entity
              id="cursor"
              animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
              animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1"
              animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
              cursor="rayOrigin: mouse"
              position="0 0 -0.2"
              geometry="primitive: ring; radiusInner: 0.002; radiusOuter: 0.003"
              material="color: #000; shader: flat"
              raycaster="far: 5; objects: .clickable"
              visible="false"
            ></a-entity>
          </a-entity>

          <a-entity id="controls">
            {/* hands control */}
            <a-entity
              id="lefthand-controls"
              mixin="hand"
              cursor="rayOrigin: mouse"
              raycaster="far: 5; objects: .clickable"
              hand-controls="hand: left; handModelStyle: highPoly; color: #ffcccc"
              laser-controls="hand: left"
              gearvr-controls="hand: left"
              magicleap-controls="hand: left"
              oculus-go-controls="hand: left"
              oculus-touch-controls="hand: left"
              vive-controls="hand: left"
              vive-focus-controls="hand: left"
              windows-motion-controls="hand: left"
              // teleport-controls="cameraRig: #cameraRig; teleportOrigin: #camera; startEvents: teleportstart; endEvents: teleportend"
              // super-hands="hand: left; colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
            />
            <a-entity
              id="righthand-controls"
              mixin="hand"
              cursor="rayOrigin: mouse"
              raycaster="far: 5; objects: .clickable"
              hand-controls="hand: right; handModelStyle: highPoly; color: #ffcccc"
              laser-controls="hand: right"
              gearvr-controls="hand: right"
              magicleap-controls="hand: right"
              oculus-go-controls="hand: right"
              oculus-touch-controls="hand: right"
              vive-controls="hand: right"
              vive-focus-controls="hand: right"
              windows-motion-controls="hand: right"
              // teleport-controls="cameraRig: #cameraRig; teleportOrigin: #camera; startEvents: teleportstart; endEvents: teleportend; type: line"
              // blink-controls="cameraRig: #cameraRig; teleportOrigin: #camera; collisionEntities: .collision; hitCylinderColor: #FF0; interval: 10; curveHitColor: #e9974c; curveNumberPoints: 40; curveShootingSpeed: 8;landingNormal:0 2 0"
              // super-hands="hand: right; colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
            />

            {/* Keyboard Controls  */}
            {/* <a-entity
              id="keyboard-controls"
              keyboard-controls="fly: true"
              position="0 0 -3"
              geometry="primitive: plane; width: 3; height: 2"
              material="color: #CCC; opacity: 0.3"
              visible="false"
            /> */}

            {/* Mobile Controls  */}
            {/* <a-entity
              id="mobile-controls"
              position="0 1 -3"
              nipple-controls
              physics-collider="ignoreSleep: true; collisionEntities: [mymovable]"
            /> */}
          </a-entity>
        </a-entity>

        {/* AFrame Lights */}

        <a-light
          id="bulb-1"
          type="directional"
          color="#35227A"
          intensity="0.60"
          position="4.40664 0.98434 0.05053"
          light="type: point; angle: 180"
          rotation="-0.3 50.509 147.30229250797848"
        ></a-light>

        <a-light
          id="bulb-2"
          type="directional"
          color="#FFFFBC"
          intensity="0.50"
          position="3.94786 -1.28516 -0.54807"
          light="type: hemisphere; angle: 90; color: #8778bf"
          rotation="-0.3 50.509 147.30229250797848"
        ></a-light>

        <a-light
          id="bulb-3"
          type="directional"
          color="#FF4400"
          intensity="2"
          position="20.45283 -2.62394 -5.68868"
          light="type: ambient; intensity: 0.3; angle: 180; color: #7156d2"
          rotation="-0.3 50.509 147.30229250797848"
        ></a-light>

        <a-light
          id="bulb-4"
          type="directional"
          color="#FFFFBC"
          intensity="0.50"
          position="-0.21291 -0.99888 0.00254"
          light="type: hemisphere; color: #ffffff; angle: 90"
          rotation="-0.3 50.509 147.30229250797848"
        ></a-light>

        {!loading && (
          <>
            {aFrameData?.properties_3D?.world_model && (
              <a-entity
                id="world_model"
                gltf-model="#world_model"
                position="4.537 0 3.468"
              ></a-entity>
            )}
            {aFrameData?.excerpt?.rendered?.length > 0 && (
              <a-troika-text
                id="Excerpt"
                value={HtmlToText(aFrameData?.excerpt?.rendered)}
                position={
                  assetsData?.find((obj) => obj?.id != "Excerpt") && "0 1.6 0"
                }
                {...assetsData?.find((obj) => obj?.id == "Excerpt")}
              ></a-troika-text>
            )}

            {aFrameData?.properties_3D?.furniture &&
              aFrameData?.properties_3D?.furniture?.map((furniture) => {
                let Obj_id = furniture?.slug;
                let Data_from_Inspector = assetsData?.find(
                  (obj) => obj?.id == Obj_id
                );
                if (!Data_from_Inspector) {
                  Data_from_Inspector = {
                    position: "0 1.6 0",
                  };
                }
                return (
                  <a-entity
                    key={furniture?.id}
                    id={furniture?.slug}
                    gltf-model={"#" + furniture?.slug}
                    {...Data_from_Inspector}
                  ></a-entity>
                );
              })}
            {aFrameData?.post_media?.screen_image &&
              aFrameData?.post_media?.screen_image?.map((scientist) => {
                var Obj_id = scientist?.slug;
                var Data_from_Inspector = assetsData?.find(
                  (obj) => obj?.id == Obj_id
                );
                var desc_format = assetsData?.find(
                  (obj) => obj?.class == "desc_wrapper"
                );
                var cap_format = assetsData?.find(
                  (obj) => obj?.class == "caption_wrapper"
                );
                var name_format = assetsData?.find(
                  (obj) => obj?.class == "name_wrapper"
                );
                var img_format = assetsData?.find(
                  (obj) => obj?.class == "image_wrapper"
                );

                if (!Data_from_Inspector) {
                  Data_from_Inspector = {
                    position: "0 1.6 0",
                  };
                }

                return (
                  <a-entity
                    key={scientist?.id}
                    id={scientist?.slug}
                    type="wrapper"
                    {...Data_from_Inspector}
                    show-details-on-click
                  >
                    <a-image
                      src={"#" + scientist?.slug}
                      type="wrapper"
                      class="image_wrapper"
                      {...img_format}
                    ></a-image>
                    {activeLanguages?.map((lang) => {
                      let font = AppFonts.NotoSans_Medium;
                      if (lang?.code == "zh-hans") {
                        font = AppFonts.NotoSansSC_Medium;
                      }
                      return (
                        <a-entity
                          key={lang?.code}
                          id={lang?.code}
                          visible="false"
                        >
                          <a-entity id="toggle" visible="false">
                            <a-troika-text
                              class="desc_wrapper"
                              type="wrapper"
                              value={scientist?.trans[lang?.code]?.desc}
                              font={font}
                              visible="true"
                              {...desc_format}
                            ></a-troika-text>
                            <a-troika-text
                              class="caption_wrapper"
                              type="wrapper"
                              value={scientist?.trans[lang?.code]?.caption}
                              font={font}
                              visible="true"
                              {...cap_format}
                            ></a-troika-text>
                            <a-troika-text
                              class="name_wrapper"
                              type="wrapper"
                              value={scientist?.trans[lang?.code]?.title}
                              font={font}
                              visible="true"
                              {...name_format}
                            ></a-troika-text>
                            {activeLanguages?.map((lang) => {
                              var key = lang?.code;
                              var classname = "btn-wrapper-" + key;
                              var insData = assetsData?.find(
                                (obj) => obj?.class == classname
                              );
                              var font = AppFonts.NotoSans_Medium;
                              if (lang?.code == "zh-hans") {
                                font = AppFonts.NotoSansSC_Medium;
                              }
                              return (
                                <a-troika-text
                                  class={classname}
                                  type="wrapper"
                                  visible="true"
                                  key={classname}
                                  value={lang?.native_name}
                                  code={key}
                                  font={font}
                                  // onClick={handleButtonClick}
                                  {...insData}
                                ></a-troika-text>
                              );
                            })}
                          </a-entity>
                        </a-entity>
                      );
                    })}
                  </a-entity>
                );
              })}

            {aFrameData?.properties_3D?.nav_mesh && (
              <a-entity
                nav-mesh
                id="nav_mesh"
                gltf-model="#nav_mesh"
                visible="false"
                position="4.762 0 3.739"
              ></a-entity>
            )}
            {aFrameData?.properties_3D?.skybox && (
              <a-sky id="skybox" color="#6EBAA7" src={"#skybox"}></a-sky>
            )}

            {/* floor collider */}
            <a-plane
              id="ground"
              static-body="shape:  mesh"
              position="0 0 -4"
              visible="false"
              rotation="-90 0 0"
              width="4"
              height="4"
              color="#7BC8A4"
              scale="6 2 2"
            ></a-plane>
          </>
        )}
      </a-scene>
    </div>
  );
};

export default AFrame;
