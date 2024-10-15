import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QRStyles.css";
import QrScanner from "qr-scanner";
import React from "react";

const ScanningTab = () => {
  const navigate = useNavigate();
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(false); // Tracks if the QR scanner is on
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  const onScanSuccess = (result: QrScanner.ScanResult) => {
     console.log("raw" + result);

    const DecodedData = atob(result.data)
    console.log("AFTER" + DecodedData)
    console.log("LAST" + JSON.parse(DecodedData))

    navigate("/", { state: JSON.parse(DecodedData)  });
    
  };

  const onScanFail = (err: string | Error) => {
    console.log("QR scan failed:", err);
  };

  const requestCameraAccess = async () => {
    console.log("Requesting camera access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoEl?.current) {
        console.log("Camera access granted");
        videoEl.current.srcObject = stream;
      }
      initializeScanner();
    } catch (error) {
      console.error("Camera access denied:", error);
      setQrOn(false); // Ensure qrOn is set to false if camera access is denied
    }
  };

  const initializeScanner = () => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))  // Set qrOn to true when the scanner starts
        .catch((err) => {
          console.error("Error starting QR scanner:", err);
          setQrOn(false);  // Set qrOn to false if the scanner fails to start
        });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    console.log("FIRST");
    return () => {
      if (scanner?.current) {
        console.log("Stopping scanner on unmount...");
        scanner.current.stop();
      }
    };
  }, []);

  // Alert user if the camera is blocked
  useEffect(() => {
    if (!qrOn) {
      console.log("QR scanner is off or camera is blocked.");
    }
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {/* Conditionally render the button if the QR scanner is off */}
      {!qrOn && (
        <button
          onClick={requestCameraAccess}
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            marginTop: "30px"  // This moves the button 30px down
          }}
        >
          Start Camera
        </button>
      )}

      <video ref={videoEl} autoPlay></video>
      <div ref={qrBoxEl} className="qr-box"></div>

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

export default ScanningTab;