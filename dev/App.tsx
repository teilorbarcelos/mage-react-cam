import { useRef, useState } from "react";
import { MageReactCam, TReactCamRef } from "../src";

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
    <div style={{ fontFamily: "sans-serif", margin: "20px auto", maxWidth: "600px" }}>
      <h1>Mage React Cam Dev</h1>
      <MageReactCam
        ref={videoRef}
        width={500}
        height={500}
        facingMode="environment"
        onUserMediaError={(error) => console.log(error)}
        style={{ borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: "20px 0" }}>
        <button onClick={capture}>Take Snapshot</button>
        <button onClick={toggleCamera}>Switch Camera</button>
        <button onClick={handleZoomIn}>Zoom In (Current: {currentZoom || 1})</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={checkMaxZoom}>Get Max Zoom (Max: {maxZoom || "?"})</button>
      </div>

      {currentImage && (
        <img src={currentImage} alt="Captured preview" style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
      )}
    </div>
  );
};

export default App;
