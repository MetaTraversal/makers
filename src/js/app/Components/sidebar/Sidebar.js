import React, { useState } from "react";

import "@styles/style.scss";

export function Sidebar() {
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  const handleAccessibilityButtonClick = () => {
    setShowAccessibilityPanel(true);
  };

  const handleAccessibilityCloseButtonClick = () => {
    setShowAccessibilityPanel(false);
  };

  const handleHighContrastButtonClick = () => {
    document.body.classList.toggle("high-contrast");
  };

  const handleGreyscaleButtonClick = () => {
    document.body.classList.toggle("greyscale");
  };

  const handleIncreaseFontSizeButtonClick = () => {
    const currentFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    document.documentElement.style.fontSize = currentFontSize + 1 + "px";
  };

  const handleDecreaseFontSizeButtonClick = () => {
    const currentFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    document.documentElement.style.fontSize = currentFontSize - 1 + "px";
  };

  const handleLightModeButtonClick = () => {
    document.body.classList.toggle("light-mode");
  };

  const handleDarkModeButtonClick = () => {
    document.body.classList.toggle("dark-mode");
  };

  const handleIncreaseWordSpaceButtonClick = () => {
    const currentWordSpacing = parseFloat(
      getComputedStyle(document.documentElement).wordSpacing
    );
    document.documentElement.style.wordSpacing = currentWordSpacing + 1 + "px";
  };

  const handleDecreaseWordSpaceButtonClick = () => {
    const currentWordSpacing = parseFloat(
      getComputedStyle(document.documentElement).wordSpacing
    );
    document.documentElement.style.wordSpacing = currentWordSpacing - 1 + "px";
  };

  // const handleFocusModeButtonClick = () => {
  //   document.body.classList.toggle('focus-mode');
  // };

  const handleResetButtonClick = () => {
    // Reset body classList
    document.body.classList.remove("high-contrast");
    document.body.classList.remove("greyscale");
    document.body.classList.remove("light-mode");
    document.body.classList.remove("dark-mode");

    // Reset font size and word spacing
    document.documentElement.style.fontSize = "";
    document.documentElement.style.wordSpacing = "";
  };

  return (
    <div>
      <i
        className="fa-brands fa-accessible-icon"
        onClick={handleAccessibilityButtonClick}
      ></i>

      {showAccessibilityPanel && (
        <div
          className={`accessibility-panel ${
            showAccessibilityPanel ? "active" : ""
          }`}
        >
          <button
            className="accessibility-close-button"
            aria-label="Close Accessibility Menu"
            onClick={handleAccessibilityCloseButtonClick}
          >
            <span className="accessibility-close-icon"></span>
          </button>
          {/* <h2 style={{ color: 'black' }}>Accessibility Options</h2> */}
          <div className="accessibility-options">
            <ul>
              <li>
                <button
                  className="accessibility-high-contrast-button"
                  onClick={handleHighContrastButtonClick}
                >
                  High Contrast
                </button>
              </li>
              <li>
                <button
                  className="accessibility-greyscale-button"
                  onClick={handleGreyscaleButtonClick}
                >
                  Greyscale
                </button>
              </li>
              <li>
                <button
                  className="accessibility-increase-font-size-button"
                  onClick={handleIncreaseFontSizeButtonClick}
                >
                  Increase Font Size
                </button>
                <button
                  className="accessibility-decrease-font-size-button"
                  onClick={handleDecreaseFontSizeButtonClick}
                >
                  Decrease Font Size
                </button>
              </li>

              <li>
                <button
                  className="accessibility-dark-mode-button"
                  onClick={handleDarkModeButtonClick}
                >
                  Dark Mode
                </button>
              </li>
              <li>
                <button
                  className="accessibility-increase-word-space-button"
                  onClick={handleIncreaseWordSpaceButtonClick}
                >
                  Increase Word Space
                </button>
                <button
                  className="accessibility-decrease-word-space-button"
                  onClick={handleDecreaseWordSpaceButtonClick}
                >
                  Decrease Word Space
                </button>
              </li>
              {/* <li>
                <button
                  className='accessibility-focus-mode-button'
                  onClick={handleFocusModeButtonClick}
                >
                  Focus Mode
                </button>
              </li> */}
              <li>
                <button
                  className="accessibility-reset-button"
                  onClick={handleResetButtonClick}
                >
                  Reset
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
