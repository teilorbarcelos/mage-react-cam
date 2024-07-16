import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";

type GetTrackProps = { stop: () => void };

interface MediaSrcObjectProps {
  getTracks: () => GetTrackProps[];
  removeTrack: (data: GetTrackProps) => void;
}

type CustomMediaVideoProps = HTMLVideoElement & {
  srcObject: MediaSrcObjectProps;
};

export type TReactCamRef = {
  snapshot: () => string | undefined;
  zoomIn: () => void;
  zoomOut: () => void;
  switchFacingMode: () => void;
  video?: CustomMediaVideoProps;
};

interface MageReactCamProps extends VideoHTMLAttributes<HTMLVideoElement> {
  onUserMediaError?: (arg0: string | DOMException) => void;
  videoConstraints?: MediaStreamConstraints;
  width?: number;
  height?: number;
  facingMode?: "environment" | "user";
}

type CustomConstraintsProps = MediaStreamConstraints & {
  video: MediaTrackConstraints & { advanced?: { zoom: number }[] };
};

const MageReactCam = forwardRef<TReactCamRef, MageReactCamProps>(
  (
    {
      onUserMediaError,
      videoConstraints,
      width,
      height,
      facingMode = "environment",
      ...rest
    }: MageReactCamProps,
    ref
  ) => {
    const internalRef = useRef<HTMLVideoElement & TReactCamRef>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [currentFacingMode, setCurrentFacingMode] = useState<
      "environment" | "user"
    >(facingMode);

    const snapshot = () => {
      if (internalRef.current) {
        const video = internalRef.current;
        const tempCanvas = document.createElement("canvas");
        const tempContext = tempCanvas.getContext("2d");
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempContext?.drawImage(
          video,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );

        const dataURL = tempCanvas.toDataURL("image/jpeg");
        return dataURL;
      }
    };

    const zoomIn = () => {
      setZoomLevel((prevZoom) => prevZoom + 1);
    };

    const zoomOut = () => {
      setZoomLevel((prevZoom) => (prevZoom > 1 ? prevZoom - 1 : prevZoom));
    };

    const switchFacingMode = () => {
      setCurrentFacingMode((prevFacingMode) =>
        prevFacingMode === "environment" ? "user" : "environment"
      );
    };

    useImperativeHandle(ref, () => ({
      snapshot,
      zoomIn,
      zoomOut,
      switchFacingMode,
    }));

    useEffect(() => {
      const constraints: CustomConstraintsProps = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: width || 500 },
          height: { ideal: height || 500 },
          advanced: [
            {
              zoom: zoomLevel,
            },
          ],
        },
      };

      let stream: MediaStream;

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((s) => {
          stream = s;
          if (internalRef.current) {
            internalRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          onUserMediaError && onUserMediaError(error);
        });

      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [
      zoomLevel,
      internalRef,
      videoConstraints,
      onUserMediaError,
      height,
      width,
      facingMode,
      currentFacingMode,
    ]);

    return <video style={{ width: "100%" }} ref={internalRef} {...rest} />;
  }
);

MageReactCam.displayName = "MageReactCam";

export default MageReactCam;
