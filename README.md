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
import { MageReactCam, TReactCamRef } from "mage-react-cam";

const App = () => {
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

  const capture = () => {
    const imageSrc = handlerSnapshot();
    if (imageSrc) {
      setCurrentImage(imageSrc);
    }
  };

  return (
    <div className="main-container">
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
      <button onClick={capture}>Take Snapshot</button>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      {currentImage && (
        <img
          src={currentImage}
          alt="current captured image"
          style={{ width: "100%" }}
        />
      )}
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
