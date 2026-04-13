import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";

interface ZoomMediaTrackConstraintSet extends MediaTrackConstraintSet {
  zoom?: number;
}

interface ZoomMediaTrackCapabilities extends MediaTrackCapabilities {
  zoom?: { max: number; min: number; step: number };
}

export type TReactCamRef = {
  snapshot: () => string | undefined;
  zoomIn: () => void;
  zoomOut: () => void;
  switchFacingMode: () => void;
  getMaxZoomLevel: () => number;
  getCurrentZoomLevel: () => number;
  video: HTMLVideoElement | null;
};

interface MageReactCamProps extends VideoHTMLAttributes<HTMLVideoElement> {
  onUserMediaError?: (error: unknown) => void;
  videoConstraints?: MediaTrackConstraints;
  width?: number;
  height?: number;
  facingMode?: "environment" | "user";
}

const MageReactCam = forwardRef<TReactCamRef, MageReactCamProps>(
  (
    {
      onUserMediaError,
      videoConstraints,
      width,
      height,
      facingMode = "environment",
      autoPlay = true,
      playsInline = true,
      muted = true,
      style,
      ...rest
    }: MageReactCamProps,
    ref
  ) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const [maxZoom, setMaxZoom] = useState<number>(1);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [currentFacingMode, setCurrentFacingMode] = useState<"environment" | "user">(facingMode);

    const snapshot = () => {
      const video = internalRef.current;
      if (!video) return undefined;
      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");
      if (!tempContext) return undefined;

      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      tempContext.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

      return tempCanvas.toDataURL("image/jpeg");
    };

    const zoomIn = () => setZoomLevel((prev) => (prev + 1 <= maxZoom ? prev + 1 : prev));
    const zoomOut = () => setZoomLevel((prev) => (prev > 1 ? prev - 1 : prev));
    const getMaxZoomLevel = () => maxZoom;
    const getCurrentZoomLevel = () => zoomLevel;
    const switchFacingMode = () => {
      setCurrentFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    };

    useEffect(() => {
      setCurrentFacingMode(facingMode);
    }, [facingMode]);

    useImperativeHandle(ref, () => ({
      snapshot,
      zoomIn,
      zoomOut,
      switchFacingMode,
      getMaxZoomLevel,
      getCurrentZoomLevel,
      video: internalRef.current,
    }));

    useEffect(() => {
      let stream: MediaStream | null = null;

      const initializeCamera = async () => {
        try {
          const constraints: MediaStreamConstraints = {
            video: {
              ...videoConstraints,
              facingMode: currentFacingMode,
              width: width ? { ideal: width } : undefined,
              height: height ? { ideal: height } : undefined,
              advanced: [{ zoom: zoomLevel } as ZoomMediaTrackConstraintSet],
            },
          };

          stream = await navigator.mediaDevices.getUserMedia(constraints);
          const videoTrack = stream.getVideoTracks()[0];
          const capabilities = videoTrack.getCapabilities() as ZoomMediaTrackCapabilities;

          if (capabilities.zoom) {
            setMaxZoom(capabilities.zoom.max);
          }

          if (internalRef.current) {
            internalRef.current.srcObject = stream;
          }
        } catch (error: unknown) {
          if (onUserMediaError) {
            onUserMediaError(error);
          }
        }
      };

      initializeCamera();

      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [
      zoomLevel,
      currentFacingMode,
      width,
      height,
      videoConstraints,
      onUserMediaError,
    ]);

    return (
      <video
        ref={internalRef}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
        style={{ width: "100%", ...style }}
        {...rest}
      />
    );
  }
);

MageReactCam.displayName = "MageReactCam";

export default MageReactCam;
