"use client";
import { useRef, useState, useEffect, createContext } from "react";

interface CameraCaptureProps {
  image_data_url: string | null;
  stopCamera?: () => void;
  captureImage: () => void;
  startCamera: () => void;
}

export const CameraContext = createContext<CameraCaptureProps>({
  image_data_url: null,
  stopCamera: () => {},
  captureImage: () => {},
  startCamera: () => {},
});

const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Start Camera Function
  const startCamera = async () => {
    console.log("Starting camera...");
    try {
      setError(null);

      // Ensure videoRef is available
      if (!videoRef.current) {
        throw new Error(
          "Video element not found. Make sure the video element is rendered."
        );
      }

      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      // Get media stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: "environment" }, // Use "user" for front camera
        },
      });

      // Assign stream to video element
      videoRef.current.srcObject = mediaStream;

      // Wait for video to load metadata
      await new Promise((resolve, reject) => {
        if (!videoRef.current) {
          reject("Video element not found.");
          return;
        }

        videoRef.current.onloadedmetadata = () => {
          resolve(null);
        };

        videoRef.current.onerror = (err) => {
          reject(`Video error: ${err}`);
        };
      });

      // Play the video
      await videoRef.current.play();

      setStream(mediaStream);
      setIsCameraOn(true);
      console.log("Camera started successfully.");
    } catch (err) {
      console.error("Camera initialization failed:", err);
      setError(err instanceof Error ? err.message : "Failed to access camera.");
      stopCamera();
    }
  };

  // Stop Camera Function
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    console.log("Camera stopped.");
  };

  // Capture Image Function with Flip
  const captureImage = () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        throw new Error("Camera elements not initialized.");
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas context not available.");
      }

      // Set canvas dimensions (optional: resize to smaller dimensions)
      const scaleFactor = 0.5; // Reduce size to 50% of original
      canvas.width = video.videoWidth * scaleFactor;
      canvas.height = video.videoHeight * scaleFactor;

      // Flip the image horizontally
      context.translate(canvas.width, 0); // Move the context to the right
      context.scale(-1, 1); // Flip horizontally

      // Draw video frame onto canvas (resized)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset the transformation matrix
      context.setTransform(1, 0, 0, 1, 0, 0);

      // Convert canvas to image with reduced quality
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = 70% quality

      setImageSrc(imageDataUrl);

      console.log("Image captured and compressed successfully.");
    } catch (err) {
      console.error("Capture failed:", err);
      setError(err instanceof Error ? err.message : "Failed to capture image.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [stream]);

  // Context value
  const contextValue = {
    image_data_url: imageSrc,
    stopCamera : stopCamera,
    startCamera : startCamera,
    captureImage : captureImage,
  };

  return (
    <CameraContext.Provider value={contextValue}>
      {error && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          Error: {error}
        </div>
      )}

      {isCameraOn && (
        <div className="z-[999]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "auto",
              border: "2px solid #ddd",
              borderRadius: "8px",
              transform: "scaleX(-1)", // Mirror the video feed
              display: isCameraOn ? "block" : "none", // Hide when camera is off
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      {children}
    </CameraContext.Provider>
  );
};

export default CameraProvider;