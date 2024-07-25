## Mage React Cam

# Install:

`npm i mage-react-cam`

or

`yarn add mage-react-cam`

# Usage:

Here is a basic example of how to use mage-react-cam in your React project.

Import and Basic Usage:

```
import { useRef, useState } from "react";
import "./App.css";
import MageReactCam, {
  TReactCamRef,
} from "./components/MageReactCam/MageReactCam";

const App = () => {
  const [maxZoom, setMaxZoom] = useState<number>();
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>();
  const [currentImage, setCurrentImage] = useState<string>();
  const videoRef = useRef<TReactCamRef>(null);

  const handlerSnapshot = () => {
    const snapShot = videoRef?.current?.snapshot;
    if (snapShot) return snapShot();
  };

  const handleZoomIn = () => {
    const zoomIn = videoRef?.current?.zoomIn;
    if (zoomIn) zoomIn();
  };

  const handleZoomOut = () => {
    const zoomOut = videoRef?.current?.zoomOut;
    if (zoomOut) zoomOut();
  };

  const handleSwitchFacingMode = () => {
    const switchFacingMode = videoRef?.current?.switchFacingMode;
    if (switchFacingMode) switchFacingMode();
  };

  const handleGetMaxZoomLevel = () => () =>
    setMaxZoom(videoRef?.current?.getMaxZoomLevel || 1);

  const handleGetCurrentZoomLevel = () =>
    setCurrentZoomLevel(videoRef?.current?.getCurrentZoomLevel || 1);

  const capture = () => {
    const imageSrc = handlerSnapshot();
    if (imageSrc) {
      setCurrentImage(imageSrc);
    }
  };

  return (
    <div className="main-container">
      <h1>Mage React Cam</h1>
      <MageReactCam
        ref={videoRef}
        onUserMediaError={(error) => console.log(error)}
        videoConstraints={undefined}
        width={500}
        height={500}
        facingMode="environment"
        autoPlay
        playsInline
      />
      <button onClick={handleGetMaxZoomLevel}>
        {maxZoom ? `Max zoom level: ${maxZoom}` : "Get max zoom level"}
      </button>
      <button onClick={handleGetCurrentZoomLevel}>
        {currentZoomLevel
          ? `Current zoom level: ${currentZoomLevel}`
          : "Get current zoom level"}
      </button>
      <button onClick={capture}>Take Snapshot</button>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <button onClick={handleSwitchFacingMode}>Switch Facing Mode</button>
      {currentImage && (
        <img
          src={currentImage}
          alt="current captured image"
          style={{ width: "100%" }}
        />
      )}

      <a target="_blank" href="https://www.npmjs.com/package/mage-react-cam">
        HOW TO USE IT
      </a>
    </div>
  );
};

export default App;
```

# Props

- onUserMediaError: Function called when there is an error accessing the camera.
- videoConstraints: Media constraints for the video.
- width: Width of the video.
- height: Height of the video.
- facingMode: Defines which camera to use ("environment" for the back camera and "user" for the front camera).
- All video html props: autoPlay, playsInline, etc...

# Methods

- snapshot: Takes a snapshot of the current video stream and returns the image as a data URL.
- zoomIn: Increases the camera zoom.
- zoomOut: Decreases the camera zoom.
- switchFacingMode: Switch the facing mode.
- getMaxZoomLevel: Get the max zoom level information.
- getCurrentZoomLevel: Get the current zoom level information.
