## Mage React Cam

# Install:

`npm i mage-react-cam`

or

`yarn add mage-react-cam`

# Usage:

```
import { MageReactCam } from 'mage-react-cam';
import { MediaSrcObjectProps, TReactCamRef } from 'mage-react-cam/dist/MageReactCam';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

interface MyReactCamComponentProps {
  onUpdate: (arg0: unknown, arg1?: any) => void;
  onError?: (arg0: string | DOMException) => void;
  width?: number | string;
  height?: number | string;
  facingMode?: 'environment' | 'user';
  torch?: boolean;
  delay?: number;
  videoConstraints?: MediaStreamConstraints;
  stopStream?: boolean;
}

const MyReactCamComponent = ({
  onUpdate,
  onError,
  torch,
  delay = 500,
  videoConstraints,
  stopStream,
}: MyReactCamComponentProps): ReactElement => {
  const [timer, setTimer] = useState<boolean>(false);
  const videoRef = useRef<TReactCamRef>(null);

  const handlerSnapshot = () => {
    const snapShot = videoRef?.current?.snapshot;
    if (snapShot) return snapShot();
  };

  const handleZoomIn = () => { // use if need zoom +
    const zoomIn = videoRef?.current?.zoomIn;
    if (zoomIn) zoomIn();
  };

  const handleZoomOut = () => { // use if need zoom -
    const zoomOut = videoRef?.current?.zoomOut;
    if (zoomOut) zoomOut();
  };

  useEffect(() => {
    if (timer)
      setTimeout(() => {
        setTimer(false);
      }, 3000);
  }, [timer]);

  const capture = useCallback(() => {
    const imageSrc = handlerSnapshot();
    if (imageSrc) {
      // use imageSrc like you want
    }
  }, [onUpdate, videoRef]);

  useEffect(() => {
    if (
      typeof torch === 'boolean' &&
      (navigator?.mediaDevices?.getSupportedConstraints() as { torch: any }).torch
    ) {
      const stream = videoRef?.current?.video?.srcObject as MediaSrcObjectProps;
      const track = stream?.getVideoTracks()[0];
      if (
        track &&
        track.getCapabilities().torch &&
        !track.getConstraints().torch
      ) {
        track
          .applyConstraints({
            advanced: [{ torch }],
          })
          .catch((err: any) => onUpdate(err));
      }
    }
  }, [torch, onUpdate]);

  useEffect(() => {
    if (stopStream) {
      let stream = videoRef?.current?.video?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track: any) => {
          stream?.removeTrack(track);
          track.stop();
        });
        stream = undefined;
      }
    }
  }, [stopStream]);

  useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
        <MageReactCam
          ref={videoRef}
          onUserMediaError={onError}
          videoConstraints={videoConstraints}
          width={500}
          height={500}
          facingMode="environment"
        />
    </div>
  );
};

export default MyReactCamComponent;
```
