# Mage React Cam

A React library designed to facilitate the capture of video directly from the device's camera. It effectively abstracts away the complex `MediaDevices` API, allowing you to seamlessly handle camera streaming, snapshots, zooms, and camera switching without hassle.

## Implementation Examples

```tsx
import { useRef, useState } from "react";
import { MageReactCam, TReactCamRef } from "mage-react-cam";

const App = () => {
  const [currentImage, setCurrentImage] = useState<string>();
  const [maxZoom, setMaxZoom] = useState<number>();
  const [currentZoom, setCurrentZoom] = useState<number>();
  const videoRef = useRef<TReactCamRef>(null);

  const capture = () => {
    const snap = videoRef.current?.snapshot();
    if (snap) setCurrentImage(snap);
  };

  const toggleCamera = () => {
    videoRef.current?.switchFacingMode();
  };

  const handleZoomIn = () => {
    videoRef.current?.zoomIn();
    setCurrentZoom(videoRef.current?.getCurrentZoomLevel());
  };

  const handleZoomOut = () => {
    videoRef.current?.zoomOut();
    setCurrentZoom(videoRef.current?.getCurrentZoomLevel());
  };

  const checkMaxZoom = () => {
    setMaxZoom(videoRef.current?.getMaxZoomLevel());
  };

  return (
    <div>
      <MageReactCam
        ref={videoRef}
        width={500}
        height={500}
        facingMode="environment"
        onUserMediaError={(error) => console.error("Camera output error:", error)}
      />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: "20px 0" }}>
        <button onClick={capture}>Take Snapshot</button>
        <button onClick={toggleCamera}>Switch Camera</button>
        <button onClick={handleZoomIn}>Zoom In (Current: {currentZoom || 1})</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={checkMaxZoom}>Get Max Zoom (Max: {maxZoom || "?"})</button>
      </div>

      {currentImage && (
        <img src={currentImage} alt="Captured preview" style={{ maxWidth: "100%" }} />
      )}
    </div>
  );
};

export default App;
```

## Install

```bash
npm install mage-react-cam
```

or

```bash
yarn add mage-react-cam
```

## Props

- `onUserMediaError`: Function called when there is an error accessing the camera.
- `videoConstraints`: Optional specific media constraints for the video stream (`MediaTrackConstraints`).
- `width`: Ideal width of the requested video stream.
- `height`: Ideal height of the requested video stream.
- `facingMode`: Defines which camera setup to use (`"environment"` for the back camera and `"user"` for the front camera).
- Accepts all standard `<video>` HTML attributes (`autoPlay`, `playsInline`, `muted`, `className`, `style`, etc), configured with smart camera defaults for simpler usage (`autoPlay`, `playsInline` and `muted` are enabled by default so the stream plays seamlessly).

## Methods

Available via the component `ref`:

- `snapshot()`: Takes a snapshot of the current active video stream and returns the image as a base64 data URL.
- `zoomIn()`: Increases the camera zoom level.
- `zoomOut()`: Decreases the camera zoom level.
- `switchFacingMode()`: Switches between the active facing modes (for example, swapping from back-to-front camera).
- `getMaxZoomLevel()`: Returns the maximal supported zoom level by the device capability.
- `getCurrentZoomLevel()`: Returns the currently applied zoom level.
- `video`: Returns the raw `HTMLVideoElement` node.
