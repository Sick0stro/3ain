import React from "react";
import { Button } from "./button";
import demoData from "../../data/demo_CitizenData.json";
import Image from "next/image";

// Define a type for scan results with optional properties
interface ScanResults {
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
  id_issueDate?: string;
  id_expiryDate?: string;
  dateOfBirth?: string;
  personalPhoto?: string;
  scannedPhoto?: string;
  profession?: string;
  companyName?: string;
  placeOfBirth?: string;
  placeOf_id_Issue?: string;
  wanted?: boolean;
  show_wanted?: boolean;
  wanted_by?: string;
  wanted_since_date?: string;
  take_action?: boolean;
  arrest_only?: boolean;
  arrest_and_delivery?: boolean;
  inspection?: boolean;
}

interface ResultsDrawerProps {
  showResults: boolean;
  onClose: () => void;
  results: ScanResults | null;
}

const DemoResultsDrawer: React.FC<ResultsDrawerProps> = ({
  showResults,
  onClose,
  results,
}) => {
  // Use demoData if results is null or undefined
  const dataToDisplay: ScanResults = results || demoData;

  return (
    <div
      className={`absolute bottom-0 right-0 left-0 bg-opacity-70 bg-black rounded-t-3xl p-6 transition-transform duration-300 ease-in-out ${
        showResults ? "translate-y-0" : "translate-y-full"
      }`}
      dir="rtl" // Set the text direction to right-to-left
    >
      <h2 className="text-2xl text-gray-200 font-bold mb-4">
        {" "}
        نتائج مسح - شفرة [ عين تايقر ]
      </h2>

      {/* Images at the top of the drawer */}
      <div className="flex flex-row-reverse justify-between mb-4">
        <div className="w-[48%]">
          <div className="text-2xl text-gray-200 font-bold mb-2">
            <p>
              <strong>الصورة الممسوحة</strong>
            </p>
          </div>
          <div className="mt-4">
            {dataToDisplay.scanned_image && (
              <div
                className="relative w-full justify-between mb-4"
                style={{ paddingTop: "100%" }}
              >
                <Image
                  src={`data:image/png;base64,${dataToDisplay.scanned_image}`}
                  alt="Scanned"
                  fill
                  sizes="(max-width: 768px) 48vw, 48vw"
                  className="absolute top-0 right-0 rounded-md" // Changed left to right
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-[48%]">
          <div className="text-2xl text-gray-200 font-bold mb-2">
            <p>
              <strong>صورة من ذاكرة الذكاء الاصطناعي</strong>
            </p>
          </div>
          <div className="mt-4">
            {dataToDisplay.identity_image && (
              <div className="relative w-full" style={{ paddingTop: "100%" }}>
                <Image
                  src={`data:image/png;base64,${dataToDisplay.identity_image}`}
                  alt="Personal"
                  fill
                  sizes="(max-width: 768px) 48vw, 48vw"
                  className="absolute top-0 right-0 rounded-md" // Changed left to right
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="w-[48%]">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 space-y-4 text-gray-300">
            {dataToDisplay.folder_name && (
              <p>
                <strong>الاسم:</strong> {dataToDisplay.folder_name}
              </p>
            )}
            {dataToDisplay.predicted_age && (
              <p>
                <strong>العمر المتوقع:</strong> {dataToDisplay.predicted_age}
              </p>
            )}
            {dataToDisplay.dominant_emotion && (
              <p>
                <strong>العاطفة المسيطرة:</strong>{" "}
                {dataToDisplay.dominant_emotion}
              </p>
            )}
            {dataToDisplay.dominant_gender && (
              <p>
                <strong>الجنس المتوقع:</strong> {dataToDisplay.dominant_gender}
              </p>
            )}
            {dataToDisplay.dominant_race && (
              <p>
                <strong>العرق المسيطر المتوقع:</strong>{" "}
                {dataToDisplay.dominant_race}
              </p>
            )}
          </div>
        </div>
        <div className="w-[48%]">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 space-y-4 text-gray-300">
            <p>
              <strong>2024/9 - نسخة 0.1 إثبات الفكرة</strong>
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onClose} className="mt-4 w-full">
        إغلاق
      </Button>
    </div>
  );
};

export default DemoResultsDrawer;
