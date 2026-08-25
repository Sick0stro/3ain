import React from "react";
import { Button } from "./button";
import demoData from "../../data/demo_CitizenData.json";
import Image from "next/image";
import { Check, X } from "lucide-react";

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

const ResultsDrawer: React.FC<ResultsDrawerProps> = ({
  showResults,
  onClose,
  results,
}) => {
  // Use demoData if results is null or undefined
  const dataToDisplay: ScanResults = results || demoData;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-black rounded-t-3xl p-6 transition-transform duration-300 ease-in-out ${
        showResults ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <h2 className="text-2xl text-gray-200 font-bold mb-4">نتائج المسح</h2>

      {/* Images at the top of the drawer */}
      <div className="flex justify-between mb-4">
        <div className="w-[48%]">
          <div className="text-2xl text-gray-200 font-bold mb-4">
            <p>
              <strong>الصورة الممسوحة</strong>
            </p>
            {dataToDisplay.scanned_image && (
              <div className="relative w-full" style={{ paddingTop: "100%" }}>
                <Image
                  src={`data:image/png;base64,${dataToDisplay.scanned_image}`}
                  alt="Scanned"
                  fill
                  sizes="(max-width: 768px) 48vw, 48vw"
                  className="absolute top-0 left-0 rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-[48%]">
          <div className="text-2xl text-gray-200 font-bold mb-4">
            <p>
              <strong>صورة الهوية</strong>
            </p>
            {dataToDisplay.identity_image && (
              <div className="relative w-full" style={{ paddingTop: "100%" }}>
                <Image
                  src={`data:image/png;base64,${dataToDisplay.identity_image}`}
                  alt="Personal"
                  fill
                  sizes="(max-width: 768px) 48vw, 48vw"
                  className="absolute top-0 left-0 rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="w-[48%]">
          <div className="text-gray-300">
            {dataToDisplay.folder_name && (
              <p>
                <strong>اسم:</strong> {dataToDisplay.folder_name}
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
                <strong>العرق المسيطر:</strong> {dataToDisplay.dominant_race}
              </p>
            )}
            {dataToDisplay.fullName && (
              <p>
                <strong>Full Name:</strong> {dataToDisplay.fullName}
              </p>
            )}
            {dataToDisplay.id_CardNumber && (
              <p>
                <strong>ID Card Number:</strong> {dataToDisplay.id_CardNumber}
              </p>
            )}
            {dataToDisplay.age && (
              <p>
                <strong>Age:</strong> {dataToDisplay.age}
              </p>
            )}
            {dataToDisplay.gender && (
              <p>
                <strong>Gender:</strong> {dataToDisplay.gender}
              </p>
            )}
            {dataToDisplay.blood_type && (
              <p>
                <strong>Blood type:</strong> {dataToDisplay.blood_type}
              </p>
            )}
            {dataToDisplay.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong> {dataToDisplay.dateOfBirth}
              </p>
            )}
            {dataToDisplay.id_issueDate && (
              <p>
                <strong>ID Issue Date:</strong> {dataToDisplay.id_issueDate}
              </p>
            )}
            {dataToDisplay.id_expiryDate && (
              <p>
                <strong>ID Expiry Date:</strong> {dataToDisplay.id_expiryDate}
              </p>
            )}
            {dataToDisplay.profession && (
              <p>
                <strong>Profession:</strong> {dataToDisplay.profession}
              </p>
            )}
            {dataToDisplay.companyName && (
              <p>
                <strong>Company Name:</strong> {dataToDisplay.companyName}
              </p>
            )}
            {dataToDisplay.placeOfBirth && (
              <p>
                <strong>Place of Birth:</strong> {dataToDisplay.placeOfBirth}
              </p>
            )}
            {dataToDisplay.placeOf_id_Issue && (
              <p>
                <strong>Place of ID card issuance:</strong>{" "}
                {dataToDisplay.placeOf_id_Issue}
              </p>
            )}
          </div>
        </div>
        <div className="w-[48%]">
          {results?.wanted !== undefined && (
            <div>
              <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                <DetailItem
                  label="Wanted"
                  value={results.wanted as boolean} // Assert the type to boolean
                />
                <DetailItem
                  label="Wanted By"
                  value={results.wanted_by as string} // Assert the type to string
                />
                <DetailItem
                  label="Wanted Since"
                  value={results.wanted_since_date as string} // Assert the type to string
                />
                <DetailItem
                  label="Take Action"
                  value={results.take_action as boolean} // Assert the type to boolean
                />
                <DetailItem
                  label="Arrest Only"
                  value={results.arrest_only as boolean} // Assert the type to boolean
                />
                <DetailItem
                  label="Arrest and Delivery"
                  value={results.arrest_and_delivery as boolean} // Assert the type to boolean
                />
                <DetailItem
                  label="Inspection"
                  value={results.inspection as boolean} // Assert the type to boolean
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Button onClick={onClose} className="mt-4 w-full">
        Close
      </Button>
    </div>
  );
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | boolean;
}) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium">{label}:</span>
      {typeof value === "boolean" ? (
        <span
          className={`flex items-center ${
            value ? "text-green-600" : "text-red-600"
          }`}
        >
          {value ? (
            <Check className="w-5 h-5 mr-1" />
          ) : (
            <X className="w-5 h-5 mr-1" />
          )}
          {value ? "Yes" : "No"}
        </span>
      ) : (
        <span className="text-gray-300">{value}</span>
      )}
    </div>
  );
}

export default ResultsDrawer;
