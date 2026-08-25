"use client";

import { JSX, SVGProps, useState } from "react";
import { Inter } from "next/font/google";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export function ImageAnalysisComponent() {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageSrc) {
      setError("No image selected.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataUrlToBlob = (dataUrl: string): Blob => {
        const [header, base64] = dataUrl.split(",");
        const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: mime });
      };

      const blob = dataUrlToBlob(imageSrc as string);

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await fetch("http://127.0.0.1:9800/process-image/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setShowPrediction(true);
      console.log("Analysis Result:", data); // Debugging line to check the result structure
    } catch (error) {
      setError(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setShowPrediction(false);
    setImageSrc(null); // Clear the image source when starting a new analysis
  };

  return (
    <div
      className={`grid md:grid-cols-2 gap-6 items-start max-w-6xl mx-auto py-8 px-4 ${inter.className}`}
    >
      <div className="relative">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            showPrediction ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 hover:shadow-lg">
            <h2 className="text-2xl font-bold">رؤية الكمبيوتر</h2>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="image">تحميل الصورة</Label>
                <Input id="image" type="file" onChange={handleImageChange} />
              </div>
              {imageSrc && (
                <img
                  src={imageSrc.toString()}
                  alt="Uploaded Image"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              )}
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? "تحليل..." : "تحليل الصورة"}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            showPrediction ? "opacity-100" : "opacity-0"
          }`}
          style={{ visibility: showPrediction ? "visible" : "hidden" }}
        >
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 hover:shadow-lg">
            <Button variant="outline" onClick={handleAnalyzeAnother}>
              تحليل آخر
            </Button>
            <h2 className="text-2xl font-bold">تنبؤ</h2>
            <div className="grid gap-4">
              {result?.pipeline_result?.[0]?.Car_Detect_Crop_base64?.length >
                0 && (
                <img
                  src={`data:image/jpeg;base64,${result.pipeline_result[0].Car_Detect_Crop_base64[0]}`}
                  alt="Main Analyzed Image"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                {result?.pipeline_result?.[0]?.License_Plate_base64 && (
                  <img
                    src={`data:image/jpeg;base64,${result.pipeline_result[0].License_Plate_base64}`}
                    alt="License Plate Image"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="grid gap-2 group rounded-lg border border-transparent rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">كائن:</span>
                  <span className="font-medium">
                    {result?.pipeline_result?.[0]?.Car_Detected_predection
                      ?.predictions?.[0]?.class || "غير متاح"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">لوحة الترخيص:</span>
                  <span className="font-medium">
                    {result?.ocr_results || "غير متاح"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">مالك لوحة الترخيص:</span>
                  <span className="font-medium">
                    {result?.owner_name || "غير متاح"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">درجة الثقة:</span>
                  <span className="font-medium">
                    {result?.pipeline_result?.[0]?.Car_Detected_predection
                      ?.predictions?.[0]?.confidence || "غير متاح"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}
