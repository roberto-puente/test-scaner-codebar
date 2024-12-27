import React, { useCallback, useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import Scanner from "./Scanner";
import Result from "./Result";

interface BarcodeScannerProps {
  onSave: (barcode: string) => void;
  onCancel: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onSave,
  onCancel,
}) => {
  const [scanning, setScanning] = useState(false); // toggleable state for "should render scanner"
  const [cameras, setCameras] = useState([]); // array of available cameras, as returned by Quagga.CameraAccess.enumerateVideoDevices()
  const [cameraId, setCameraId] = useState(null); // id of the active camera device
  const [cameraError, setCameraError] = useState(null); // error message from failing to access the camera
  const [results, setResults] = useState([]); // list of scanned results
  const [torchOn, setTorch] = useState(false); // toggleable state for "should torch be on"
  const scannerRef = useRef(null); // reference to the scanner element in the DOM

  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log("Cameras Detected: ", cameras);
      return cameras;
    };
    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then((cameras) => setCameras(cameras))
      .then(() => Quagga.CameraAccess.disableTorch()) // disable torch at start, in case it was enabled before and we hot-reloaded
      .catch((err) => setCameraError(err));
    return () => disableCamera();
  }, []);

  const onTorchClick = useCallback(() => {
    const torch = !torchOn;
    setTorch(torch);
    if (torch) {
      Quagga.CameraAccess.enableTorch();
    } else {
      Quagga.CameraAccess.disableTorch();
    }
  }, [torchOn, setTorch]);

  return (
    <div>
      {cameraError ? (
        <p>
          ERROR INITIALIZING CAMERA ${JSON.stringify(cameraError)} -- DO YOU
          HAVE PERMISSION?
        </p>
      ) : null}
      {cameras.length === 0 ? (
        <p>
          Enumerating Cameras, browser may be prompting for permissions
          beforehand
        </p>
      ) : (
        <form>
          <select onChange={(event) => setCameraId(event.target.value)}>
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || camera.deviceId}
              </option>
            ))}
          </select>
        </form>
      )}
      <button onClick={onTorchClick}>
        {torchOn ? "Disable Torch" : "Enable Torch"}
      </button>
      <button onClick={() => setScanning(!scanning)}>
        {scanning ? "Stop" : "Start"}
      </button>
      <ul className="results">
        {results.map(
          (result) =>
            result.codeResult && (
              <Result key={result.codeResult.code} result={result} />
            )
        )}
      </ul>
      <div
        ref={scannerRef}
        width="400"
        height="200"
        style={{
          position: "relative",
          minWidth: "200px",
          minHeight: "100px",
        }}
      >
        {/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
        <canvas
          className="drawingBuffer"
          style={{
            position: "absolute",
            top: "0px",
            // left: '0px',
            // height: '100%',
            // width: '100%',
            border: "3px solid green",
          }}
          width="400"
          height="200"
        />
        {scanning ? (
          <Scanner
            scannerRef={scannerRef}
            cameraId={cameraId}
            onDetected={(result) => {
              setResults([...results, result]);
              alert("Resultado:" + result);
              setScanning(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default BarcodeScanner;
