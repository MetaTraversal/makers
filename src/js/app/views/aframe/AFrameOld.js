import React, { useState, useEffect, useRef, useContext } from "react";

import { ApiEndpoint, AppConfig, HttpRequest } from "../../config";
import { AppLoader } from "../../components";
import {  HtmlToText } from "../../utils";
import { AppFonts } from "../../constants";
import { DataContext } from "../../context";

export const AFrameOld = (props) => {
  const base_url = AppConfig.SITE_URL;
  const upload_dir = AppConfig.UPLOAD_DIR_URL["baseurl"];
  const aFrameData = props?.aFrameData;
  const PAGE_SLUG = aFrameData?.slug;

  const { activeLanguages } = useContext(DataContext); // For all languages supported
  const [loading, setLoading] = useState(true); // For asset loading
  const [elementDetected, setElementDetected] = useState(false); // For inspector loaded

  // const [worldData, setWorldData] = useState([]); // World model
  // const [meshData, setMeshData] = useState([]); // Navmesh
  // const [excerptData, setExcerptData] = useState(null);
  // const [skyboxData, setSkyboxData] = useState(null);
  // const [furnitureData, setFurnitureData] = useState([]); // GLTF models
  // const [scientistsData, setScientistsData] = useState([]); // For a-images

  const langRef = useRef(null); // Current language state
  const prev_langRef = useRef(null); // Previous language state
  const data = useRef([{}]); // Data from inspector

  useEffect(() => {
    console.log("Aframe props", aFrameData);
    fetchLatestData();
  }, []);

  useEffect(() => {
    // getFromServer();
    // AddClickEvent();
    // checkElement();

    // Set up a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(checkElement);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, [elementDetected]);

  const checkElement = () => {
    // Usage: Checks if the inspector has been opened for the first time
    const ele = document.querySelector(
      "#scenegraph > div.outliner > div:nth-child(1)"
    );
    if (ele !== null && !elementDetected) {
      console.log("Inspector has been opened for the first time");
      customManipulation();
      // Update the state to indicate that the element has been detected
      setElementDetected(true);
    }
  };

  function customManipulation() {
    setTimeout(function RightPaneOpen() {
      // Usage: Opens the Right Pane to add custom button
      var ele = document.querySelector(
        "#scenegraph > div.outliner > div:nth-child(1)"
      );
      ele.click();
      console.log("Right Pane Opened");
      addSaveButton();
    }, 2500); // Adjust the delay as needed
  }

  function addSaveButton() {
    setTimeout(function () {
      // Usage: Create an <a> element that is appended to the specified location in the inspector.
      // Properties: "copy-entity-to-clipboard" consolidates element attributes into string and copies to clipboard.
      var link = document.createElement("a");
      link.href = "#";
      link.title = "Send Element Data";
      link.setAttribute("data-action", "copy-entity-to-clipboard");
      link.classList.add("button", "fa", "fa-floppy-disk");
      var parentElement = document.querySelector(
        "#componentEntityHeader > div.static > div.collapsible-header > div"
      );
      parentElement.appendChild(link);
      console.log("Save Button Added");
      fetchDataClipboard();
    }, 1000); // Adjust the delay as needed
  }

  const fetchDataClipboard = () => {
    // Usage: Fetches the data from the clipboard and stores it in a variable
    var element = document.querySelector(
      "#componentEntityHeader > div.static > div.collapsible-header > div > a.button.fa.fa-floppy-disk"
    );
    element.onclick = function () {
      // Usage: Access the data from the clipboard and store it in a variable "clipboardData"

      navigator.clipboard
        .readText()
        .then((clipboardData) => {
          console.log("Clipboard Data fetched:", clipboardData);
          createJsonString(clipboardData);
        })
        .catch((err) => {
          console.error("Failed to get clipboard data: ", err);
        });
    };
  };

  function createJsonString(entityString) {
    // Usage: Creates a JSON string from the data fetched from the clipboard.
    var tempElement = document.createElement("div"); // Create a temporary element to parse the string
    tempElement.innerHTML = entityString;
    var entityAttributes = tempElement.firstChild.attributes;
    // Convert the attributes into an object
    var entityObject = {};
    for (var i = 0; i < entityAttributes.length; i++) {
      var attr = entityAttributes[i];
      entityObject[attr.name] = attr.value;
    }

    // Convert the object to JSON string
    var jsonString = JSON.stringify(entityObject);
    console.log("JSON element: ", jsonString);
    updateApiData(jsonString);
  }
  
  function updateApiData(jsonString) {
    // Usage: Updates the API data with the new JSON string
    // Functionality: Checks if the data exists in the API, if yes, updates the data, else adds the data to the API. Considers the "id" attribute to check if the data exists.
    const newData = JSON.parse(jsonString);
    delete newData["gltf-model"];
    delete newData["value"];
    delete newData["show-details-on-click"];
    delete newData["troika-text"];

    if (
      Array.isArray(data.current) &&
      data.current.length === 1 &&
      Object.keys(data.current[0]).length === 0
    ) {
      console.log("!!!!!No data found, adding new data");
      const updatedJsonString = JSON.stringify([newData], null, 2);
      sendApiRequest(updatedJsonString);
      return;
    }
    var foundData = false;
    var foundClassData = false;
    const updatedData = data.current.map((item) => {
      if (
        item?.class !== undefined &&
        newData?.class !== undefined &&
        newData?.class === item?.class
      ) {
        foundClassData = true;
        var alteredClassData = updateClassData(newData);
        return alteredClassData;
      } else if (newData?.id !== undefined && item?.id === newData?.id) {
        foundData = true;
        return newData;
      } else {
        return item;
      }
    });

    if (!foundData && newData?.id !== undefined && newData?.class === undefined)
      updatedData.push(newData);

    if (newData?.class !== undefined && !foundClassData) {
      var alteredClassData = updateClassData(newData);
      updatedData.push(alteredClassData);
    }

    const updatedJsonString = JSON.stringify(updatedData, null, 2);
    console.log("Updated data:", updatedData);
    sendApiRequest(updatedJsonString);
  }

  function updateClassData(json) {
    // Usage: Updates the class data to remove all object specific data
    const { value, id, visible, src, ...newJson } = json;
    return newJson;
  }



  const handleButtonClick = (event) => {
    // Usage: Handles language change on button click
    var buttonText = event.target.getAttribute("code");
    if (buttonText == "") {
      buttonText = "en";
    }
    prev_langRef.current = langRef.current;
    langRef.current = buttonText;
    if (prev_langRef.current !== langRef.current) {
      event.target.click();
    }
  };
  

  async function fetchLatestData() {
    // Usage: Fetches the latest data from the server saved through Inspector
    const url = `/${ApiEndpoint.GET_ASSETS_DATA}/${PAGE_SLUG}.json`;
    HttpRequest.httpGet(url)
      .then((result) => {
        data.current = result;
      })
      .catch((error) => {
        console.log("Failed to fetch dynamic content", error);
      });
  }
  const sendApiRequest = async (data) => {
    // Usage: Sends the updated data to the API
    const url = `/${ApiEndpoint.UPDATE_INSPECTOR_DATA}`;

    var formdata = new FormData();
    formdata.append("file", new Blob([data]));
    const file_name = PAGE_SLUG + ".json";
    formdata.append("page", file_name);

    HttpRequest.httpPost(url, formdata)
      .then((result) => {
        // Result : {success: true/false, message: "..."}
        console.log("API Response: ", result);
        const dataResp = JSON.parse(result);
        alert(dataResp.message);
      })
      .catch((error) => console.log("Error", error));
    fetchLatestData();
  };

  
  // function AddClickEvent() {
  //   // Usage: Adds a click event to the entity to show the description
  //   AFRAME.registerComponent("show-details-on-click", {
  //     init: function () {
  //       var el = this.el;
  //       el.addEventListener("click", function () {
  //         ShowDescription(el);
  //       });
  //     },
  //   });
  // }

  // function ShowDescription(Obj) {
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
  // }

  // function HtmlToText(htmlContent) {
  //   // Create a new DOMParser instance
  //   const parser = new DOMParser();
  //   // Parse the HTML content
  //   const document = parser.parseFromString(htmlContent, "text/html");
  //   // Extract the plain text using textContent
  //   const textContent = document.body.textContent;
  //   return textContent;
  // }

  // const getFromServer = () => {
  //   // Usage: Loads all assets from server
  //   const url = `/${ApiEndpoint.GET_PAGES}?fields=id,type,title,content,slug,excerpt,languages,post_media,featured_media,screen_images,properties_3D,featured_video,cats,tags,type&filter[orderby]=ID&order=asc&per_page=100`;
  //   HttpRequest.httpGet(url)
  //     .then((result) => {
  //       var pagecontents = [];
  //       var furniture = [];
  //       var world = [];
  //       var navmesh = [];
  //       console.log("RESULT!!!!!!!!!!", result);
  //       result.map((item) => {
  //         if (item?.slug === PAGE_SLUG) {
  //           langRef.current = item?.languages?.default;
  //           prev_langRef.current = item?.languages?.default;
  //           pagecontents = item?.post_media?.screen_image;
  //           furniture = item?.properties_3D?.furniture;

  //           world = item?.properties_3D?.world_model;

  //           navmesh = item?.properties_3D?.nav_mesh;
  //           console.log("Data from server...", result);
  //           setExcerptData(item?.excerpt?.rendered);
  //           setSkyboxData(item?.properties_3D?.skybox);
  //           setFurnitureData(furniture);
  //           setWorldData(world);
  //           setMeshData(navmesh);
  //           setScientistsData(pagecontents);
  //           setTimeout(() => setLoading(false), 1000);
  //         }
  //       });
  //       AddClickEvent(pagecontents);
  //     })
  //     .catch((error) => {
  //       console.log("Error from server...", error);
  //     });
  // };

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <a-scene
          embedded
          environment="preset: forest; groundTexture: walkernoise; groundColor: #2b291c; groundColor2: #312f20; dressingColor: #124017;"
          cursor="rayOrigin: mouse"
        >
          <a-entity
            id="rig"
            rotation-reader
            thumbstick-logging
            movement-controls="constrainToNavMesh: true; speed:1; controls: checkpoint, gamepad, trackpad, keyboard, touch;"
          >
            <a-entity
              camera=""
              position="0 1.6 0"
              rotation="-4.469070802020421 -84.91234523838803 0"
              look-controls="fly:true"
              raycaster="far: 5; objects: .clickable"
              super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
            >
              <a-entity
                laser-controls="hand: right"
                raycaster="objects: .clickable"
                cursor="rayOrigin: mouse"
              ></a-entity>
              <a-entity
                id="crosshair"
                cursor="rayOrigin:mouse"
                position="0 0 -0.2"
                geometry="primitive: ring; radiusInner: 0.002; radiusOuter: 0.003"
                material="shader: flat"
                raycaster="far: 5; objects: .clickable"
                visible="false"
              ></a-entity>
            </a-entity>
            <a-entity
              mixin="hand"
              oculus-touch-controls="hand: left"
              hand-controls="hand: left; handModelStyle: highPoly; color: #0055ff"
            ></a-entity>
            <a-entity
              mixin="hand"
              oculus-touch-controls="hand: right"
              hand-controls="hand: right; handModelStyle: highPoly; color: #0055ff"
              blink-controls="cameraRig: #rig; teleportOrigin: #camera; collisionEntities: .collision; hitCylinderColor: #FF0; interval: 10; curveHitColor: #e9974c; curveNumberPoints: 40; curveShootingSpeed: 8;landingNormal:0 2 0"
            ></a-entity>
          </a-entity>

          <a-assets timeout="10000">
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
          {loading && (
            <>
              {aFrameData?.properties_3D?.world_model && (
                <a-entity
                  id="world_model"
                  gltf-model="#world_model"
                  position="4.537 0 3.468"
                ></a-entity>
              )}
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

              {aFrameData?.excerpt?.rendered?.length > 0 && (
                <a-troika-text
                  id="Excerpt"
                  value={HtmlToText(aFrameData?.excerpt?.rendered)}
                  position={
                    data?.current?.find((obj) => obj?.id != "Excerpt") &&
                    "0 1.6 0"
                  }
                  {...data?.current?.find((obj) => obj?.id == "Excerpt")}
                ></a-troika-text>
              )}

              {aFrameData?.properties_3D?.furniture?.length > 0 &&
                aFrameData?.properties_3D?.furniture?.map((furniture) => {
                  var Obj_id = furniture?.slug;
                  var Data_from_Inspector = data?.current?.find(
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
              {aFrameData?.post_media?.screen_image?.length > 0 &&
                aFrameData?.post_media?.screen_image?.map((scientist) => {
                  var Obj_id = scientist?.slug;
                  var Data_from_Inspector = data?.current?.find(
                    (obj) => obj?.id == Obj_id
                  );
                  var desc_format = data?.current?.find(
                    (obj) => obj?.class == "desc_wrapper"
                  );
                  var cap_format = data?.current?.find(
                    (obj) => obj?.class == "caption_wrapper"
                  );
                  var name_format = data?.current?.find(
                    (obj) => obj?.class == "name_wrapper"
                  );
                  var img_format = data?.current?.find(
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
                      show-details-on-click=""
                    >
                      <a-image
                        src={"#" + scientist?.id}
                        type="wrapper"
                        class="image_wrapper"
                        {...img_format}
                      ></a-image>
                      {activeLanguages?.map((lang) => {
                        var font = AppFonts.NotoSans_Medium;
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
                                var insData = data?.current?.find(
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
                                    onClick={handleButtonClick}
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
              <a-light
                type="directional"
                color="#35227A"
                intensity="0.60"
                position="4.40664 0.98434 0.05053"
                light="type: point; angle: 180"
                rotation="-0.3 50.509 147.30229250797848"
                id="bulb-1"
              ></a-light>

              <a-light
                type="directional"
                color="#FFFFBC"
                intensity="0.50"
                position="3.94786 -1.28516 -0.54807"
                light="type: hemisphere; angle: 90; color: #8778bf"
                rotation="-0.3 50.509 147.30229250797848"
                id="bulb-2"
              ></a-light>

              <a-light
                type="directional"
                color="#FF4400"
                intensity="2"
                position="20.45283 -2.62394 -5.68868"
                light="type: ambient; intensity: 0.3; angle: 180; color: #7156d2"
                rotation="-0.3 50.509 147.30229250797848"
                id="bulb-3"
              ></a-light>
              <a-light
                type="directional"
                color="#FFFFBC"
                intensity="0.50"
                position="-0.21291 -0.99888 0.00254"
                light="type: hemisphere; color: #ffffff; angle: 90"
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
            </>
          )}
        </a-scene>
      </div>
    </>
  );
};
