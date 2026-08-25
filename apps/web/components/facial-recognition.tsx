"use client";

import { useRef, useState } from "react";
import CameraView, { CameraViewHandle } from "./ui/CameraView";
import ScanButton from "./ui/ScanButton";
import ScanningAnimation from "./ui/ScanningAnimation";
import DemoResultsDrawer from "./ui/DemoResultDrawer";
import Logo from "./ui/logo";

const translationMap: Record<string, string> = {
  angry: "غاضب",
  disgust: "مشمئز",
  fear: "خوف",
  happy: "سعيد",
  sad: "حزين",
  surprise: "متفاجئ",
  neutral: "حيادي",
  Woman: "امرأة",
  Man: "رجل",
  asian: "آسيوي",
  indian: "هندي",
  black: "أسود",
  white: "أبيض",
  "middle eastern": "الشرق الأوسط",
  "latino hispanic": "لاتيني اسباني",
  SAMI: "سامي محمد عثمان عبدالله",
  NIZAR: "نزار الصافي الحاج ابراهيم",
  NODATA: "لا يوجد داخل بيانات نسخة اثبات الفكرة",
  AMINA: "امينا الحب",
  HANAN: "حنان سنون",
  ALI: " علي عبدالسلام المشاي",
};

type ResultValue = string | number | boolean | null | undefined;

interface ResultObject {
  [key: string]: ResultValue | ResultObject | ResultValue[];
}

function translateResult(result: ResultObject): ResultObject {
  const translatedResult: ResultObject = {};

  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "string") {
      translatedResult[key] = translationMap[value] || value;
    } else if (Array.isArray(value)) {
      translatedResult[key] = value.map((item) =>
        typeof item === "string" ? translationMap[item] || item : item
      );
    } else if (typeof value === "object" && value !== null) {
      translatedResult[key] = translateResult(value as ResultObject);
    } else {
      translatedResult[key] = value;
    }
  }

  return translatedResult;
}

interface AnalysisResult extends ResultObject {
  dominant_emotion?: string;
  dominant_race?: string;
  dominant_gender?: string;
  predicted_age?: number;
  identity_image?: string;
  scanned_image?: string;
  folder_name?: string;
  fullName?: string;
  id_CardNumber?: string;
  age?: number;
  gender?: string;
  blood_type?: string;
  dateOfBirth?: string;
  id_issueDate?: string;
  id_expiryDate?: string;
  profession?: string;
  companyName?: string;
  placeOfBirth?: string;
  placeOf_id_Issue?: string;
  scannedPhoto?: string;
  personalPhoto?: string;
  wanted?: boolean;
  show_wanted?: boolean;
  wanted_by?: string;
  wanted_since_date?: string;
  take_action?: boolean;
  arrest_only?: boolean;
  arrest_and_delivery?: boolean;
  inspection?: boolean;
}

export function FacialRecognitionAppComponent() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const cameraViewRef = useRef<CameraViewHandle>(null);

  const handleScanAndCapture = () => {
    setIsScanning(true);
    if (cameraViewRef.current) {
      cameraViewRef.current.captureImage();
    }
  };

  const cleanBase64Image = (base64Image: string) => {
    return base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
  };

  const sendImageToBackend = async (base64Image: string) => {
    try {
      const response = await fetch(
        " https://f691-102-211-4-91.ngrok-free.app/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        }
      );
      const result = (await response.json()) as AnalysisResult;
      const translatedResult = translateResult(result);
      setResults(translatedResult as AnalysisResult);
      setShowResults(true);
      setIsScanning(false);
    } catch (error) {
      console.error("Error:", error);
      setIsScanning(false);
    }
  };

  const handleCapture = (image: string) => {
    const cleanedBase64 = cleanBase64Image(image);
    sendImageToBackend(cleanedBase64);
  };

  return (
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden flex flex-col">
      <div className="flex-grow relative">
        <CameraView ref={cameraViewRef} onCapture={handleCapture} />
      </div>
      <Logo src="/gcolaf.png" alt="App Logo" />
      <ScanButton onClick={handleScanAndCapture} disabled={isScanning} />
      <ScanningAnimation visible={isScanning} />
      <DemoResultsDrawer
        showResults={showResults}
        onClose={() => setShowResults(false)}
        results={results}
      />
    </div>
  );
}
