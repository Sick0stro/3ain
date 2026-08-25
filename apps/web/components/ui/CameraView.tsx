"use client";

import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from "react";

export interface CameraViewHandle {
  captureImage: () => void;
}

interface CameraViewProps {
  onCapture: (image: string) => void;
}

const CameraView = forwardRef<CameraViewHandle, CameraViewProps>(
  ({ onCapture }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">(
      "user"
    );
    const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);

    useImperativeHandle(ref, () => ({
      captureImage() {
        if (videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          if (context) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            const image = canvasRef.current.toDataURL("image/jpeg");
            onCapture(image);
          }
        }
      },
    }));

    const stopMediaTracks = useCallback((stream: MediaStream) => {
      stream.getTracks().forEach((track) => track.stop());
    }, []);

    useEffect(() => {
      let currentStream: MediaStream | null = null;

      const getCameraStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
          });
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                const aspectRatio =
                  videoRef.current.videoWidth / videoRef.current.videoHeight;
                setVideoAspectRatio(aspectRatio);
              }
            };
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      };

      getCameraStream();

      return () => {
        if (currentStream) {
          stopMediaTracks(currentStream);
        }
      };
    }, [facingMode, stopMediaTracks]);

    const toggleCamera = () => {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ aspectRatio: videoAspectRatio }}
        />
        <canvas ref={canvasRef} className="hidden" />
        <button
          onClick={toggleCamera}
          className="absolute bottom-4 right-4 bg-white bg-opacity-50 p-2 rounded-full z-10"
        >
          اقلب الكاميرا
        </button>
      </div>
    );
  }
);

CameraView.displayName = "CameraView";

export default CameraView;
