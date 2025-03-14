"use client";
import { useRef, useState, useEffect, createContext } from "react";

interface CameraCaptureProps {
  image_data_url: string | null;
  capturedFile: File | null;
  stopCamera?: () => void;
  captureImage: () => void;
  startCamera: () => void;
}

export const CameraContext = createContext<CameraCaptureProps>({
  image_data_url: null,
  capturedFile:  null,
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
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  // Start Camera Function
  const startCamera = async () => {

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
        audio : false,
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
    } catch (err) {
      console.error("Camera initialization failed:", err);
      setError(err instanceof Error ? err.message : "Failed to access camera.");
      setTimeout(() => setError(null),1200)
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

      context.setTransform(1, 0, 0, 1, 0, 0);
      
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
          setCapturedFile(file); 
        }
      }, "image/jpeg", 0.7);
      setImageSrc(imageDataUrl);
      
    } catch (err) {
      console.error("Capture failed:", err);
      setError(err instanceof Error ? err.message : "Failed to capture image.");
      setTimeout(() => setError(null),1200)
    }
    finally {
      stopCamera()
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
    capturedFile : capturedFile,
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

      {/* {isCameraOn && ( */}
        <div  
        style={{
          display: isCameraOn ? "block" : "none", 
        }}
        className="z-[999] relative">
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
              transform: "scaleX(-1)",
              display: isCameraOn ? "block" : "none", 
            }}
          />
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button onClick={stopCamera} className=" px-4 py-2 border-0 outline-0 rounded-full bg-red-500 text-xl">
            Stop
          </button>
          <button onClick={captureImage} className=" px-4 py-2 border-0 outline-0 rounded-full bg-blue-500 text-xl">
            Capture
          </button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      {/* )} */}
      {children}
    </CameraContext.Provider>
  );
};

export default CameraProvider;