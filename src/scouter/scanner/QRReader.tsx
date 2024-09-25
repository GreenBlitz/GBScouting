import { useEffect, useRef, useState } from "react";

// Styles
import "./QRStyles.css";

// Qr Scanner
import QrScanner from "qr-scanner";

const QRReader = () => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(false);

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    setScannedResult(result?.data);
    



  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  // Request camera access
  const requestCameraAccess = async () => {
    try {
      // Request camera permission from the user
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // If permission is granted, set video element to stream
      if (videoEl?.current) {
        videoEl.current.srcObject = stream;
      }
      // Set QR scanner after getting camera stream
      initializeScanner();
    } catch (error) {
      // If permission is denied, show an alert
      alert("Camera access denied. Please allow access to scan QR codes.");
      setQrOn(false);
    }
  };

  // Initialize QR Scanner
  const initializeScanner = () => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      // Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }
  };

  // On component mount, request camera access
  useEffect(() => {
    requestCameraAccess();

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // Handle no camera access state
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl} autoPlay></video>
      <div ref={qrBoxEl} className="qr-box">
        {/* Optional overlay like QrFrame.svg can go here */}
      </div>

      {/* Show Data Result if scan is successful */}
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
  );
};

export default QRReader;