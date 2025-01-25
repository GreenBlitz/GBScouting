import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QRStyles.css";
import QrScanner from "qr-scanner";
import React from "react";
import { renderScouterNavBar } from "../../App";
import * as serde from "../../utils/Serde";
import {decode} from "uint8-to-base64";

const ScanningTab = () => {
  const navigate = useNavigate();
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(false); // Tracks if the QR scanner is on

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log("raw " + result.data);

    const data = serde.deserialize(serde.serdeRecord(serde.qrSerde).deserializer,decode(result.data));
    console.log("data: " + data);

    navigate("/", { state: data });
  };

  const onScanFail = (err: string | Error) => {
    console.log("QR scan failed:", err);
  };

  const requestCameraAccess = async () => {
    console.log("Requesting camera access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
        audio: false,
      });
      if (videoEl?.current) {
        console.log("Camera access granted");
        videoEl.current.srcObject = stream;
      }
      initializeScanner();
    } catch (error) {
      console.error("Camera access denied:", error);
      console.log("trying non environment facing camera");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoEl?.current) {
          console.log("Camera access granted");
          videoEl.current.srcObject = stream;
        }
        initializeScanner();
      } catch (error) {
        console.error("Camera access denied:", error);
        setQrOn(false); // Ensure qrOn is set to false if camera access is denied
      }
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
        .then(() => setQrOn(true)) // Set qrOn to true when the scanner starts
        .catch((err) => {
          console.error("Error starting QR scanner:", err);
          setQrOn(false); // Set qrOn to false if the scanner fails to start
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
      {renderScouterNavBar()}
      {/* Conditionally render the button if the QR scanner is off */}
      {!qrOn && (
        <button
          onClick={requestCameraAccess}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-lg mt-8 cursor-pointer"
        >
          Start Camera
        </button>
      )}

      <video ref={videoEl} autoPlay></video>
      <div ref={qrBoxEl} className="qr-box"></div>
    </div>
  );
};

export default ScanningTab;
