import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export type TReactCamRef = {
  snapshot: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

interface MageReactCamProps {
  onUserMediaError?: (arg0: string | DOMException) => void;
  videoConstraints?: MediaStreamConstraints;
  width?: number;
  height?: number;
}

const MageReactCam = forwardRef<TReactCamRef, MageReactCamProps>(
  (
    { onUserMediaError, videoConstraints, width, height }: MageReactCamProps,
    ref,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);

    const snapshot = () => {
      if (internalRef.current) {
        const video = internalRef.current;
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempContext?.drawImage(
          video,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
        );

        const dataURL = tempCanvas.toDataURL('image/jpeg');
        return dataURL;
      }
    };

    const [zoomLevel, setZoomLevel] = useState(1);

    const zoomIn = () => {
      setZoomLevel((prevZoom) => prevZoom + 1);
    };

    const zoomOut = () => {
      setZoomLevel((prevZoom) => (prevZoom > 1 ? prevZoom - 1 : prevZoom));
    };

    useImperativeHandle(ref, () => ({
      snapshot,
      zoomIn,
      zoomOut,
    }));

    useEffect(() => {
      if (!internalRef?.current) return;
      const constraints: any = videoConstraints
        ? videoConstraints
        : {
            video: {
              facingMode: 'environment',
              width: { ideal: width || 500 },
              height: { ideal: height || 500 },
            },
          };

      if (constraints.video) {
        if (zoomLevel > 0) {
          const advancedConstraints = {
            zoom: zoomLevel,
          };
          constraints.video.advanced = [advancedConstraints];
        }
      }

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
    ]);

    return <video ref={internalRef} autoPlay />;
  },
);

MageReactCam.displayName = 'MageReactCam';

export default MageReactCam;

