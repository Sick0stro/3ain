"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, RefreshCw, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AnalysisResult = {
  license_info: string[];
  ocr_results: string;
  owner_name: string;
  pipeline_result: Array<{
    Car_Detect_Crop_base64: string[];
    License_Plate_base64: string;
    Car_Detected_predection: {
      predictions: Array<{
        class: string;
        confidence: number;
      }>;
    };
  }>;
};

export default function CarLicensePlateRecognition() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("No image selected.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const blob = await fetch(image).then((r) => r.blob());
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await fetch(
        "https://2bfa-102-211-4-91.ngrok-free.app/process-image/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Ensure we correctly parse the JSON
      const data = await response.json();

      // Log the data to ensure it's being parsed correctly
      console.log("Response Data:", data);

      // If the API returns Arabic text, ensure it’s decoded properly
      if (typeof data.ocr_results === "string") {
        // You can decode it if needed, although it's likely unnecessary if the backend sends correct UTF-8
        data.ocr_results = decodeURIComponent(escape(data.ocr_results));
      }

      setResult(data);
    } catch (error) {
      setError(`Error: ${(error as Error).message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white rounded-lg">
      <CardHeader className="bg-black text-white rounded-t-lg">
        <div className="flex items-center justify-center space-x-2">
          <CardTitle className="text-xl font-semibold">
            كود عين المركبة
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <Label
                  htmlFor="image-upload"
                  className="text-lg font-semibold"
                  dir="rtl"
                >
                  رفع صورة السيارة
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {image && (
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">
                      الصورة المرفوعة
                    </Label>
                    <img
                      src={image}
                      alt="Uploaded car"
                      className="w-full h-auto rounded-md object-cover shadow-md"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {result.ocr_results === "662828" ? (
                <>
                  {result.pipeline_result?.length > 0 && (
                    <>
                      <Card className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">
                            المركبة المكتشفة
                          </Label>
                          {result.pipeline_result[0]?.Car_Detect_Crop_base64 ? (
                            <img
                              src={`data:image/jpeg;base64,${result.pipeline_result[0].Car_Detect_Crop_base64[0]}`}
                              alt="Detected car"
                              className="w-full h-auto rounded-md shadow-md"
                            />
                          ) : (
                            <Skeleton className="w-full h-48 rounded-md" />
                          )}
                        </div>
                        <CardContent className="p-4 grid gap-3">
                          {/* New Owner Info with RTL */}
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              نوع المركبة:
                            </span>
                            <span className="text-black">
                              {result.pipeline_result[0]
                                ?.Car_Detected_predection?.predictions[0]
                                ?.class || "N/A"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">
                            لوحة الترخيص
                          </Label>
                          {result.pipeline_result[0]?.License_Plate_base64 ? (
                            <img
                              src={`data:image/jpeg;base64,${result.pipeline_result[0].License_Plate_base64}`}
                              alt="License plate"
                              className="w-full h-auto rounded-md shadow-md"
                            />
                          ) : (
                            <Skeleton className="w-full h-24 rounded-md" />
                          )}
                        </div>
                        <CardContent className="p-4 grid gap-3">
                          {/* New Owner Info with RTL */}
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              رقم اللوحة:
                            </span>
                            <span className="text-black">
                              {result.ocr_results || "N/A"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-100 p-4 rounded-lg shadow-md">
                        {/* Local Personal photo */}
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">
                            صورة شخصية
                          </Label>
                          <div className="flex space-x-4" dir="rtl">
                            <img
                              src="/id-photo3.jpg"
                              alt="ID Photo 3"
                              className="w-1/3 h-auto rounded-md shadow-md"
                            />
                          </div>
                        </div>
                        <CardContent className="p-4 grid gap-3">
                          {/* New Owner Info with RTL */}
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              رقم البطاقة الشخصية:
                            </span>
                            <span className="text-black">350075/ب</span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              الاسم:
                            </span>
                            <span className="text-black">
                              {result.owner_name || "N/A"}
                            </span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              تاريخ الميلاد:
                            </span>
                            <span className="text-black">1988</span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              الجنسية:
                            </span>
                            <span className="text-black">ليبي</span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              فصيلة الدم:
                            </span>
                            <span className="text-black">+A</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-100 p-4 rounded-lg shadow-md">
                        {/* Local ID photos */}
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">
                            صور رخصة القيادة
                          </Label>
                          <div className="flex space-x-4">
                            <img
                              src="/id-photo1.jpg"
                              alt="ID Photo 1"
                              className="w-1/3 h-auto rounded-md shadow-md"
                            />
                            <img
                              src="/id-photo2.jpg"
                              alt="ID Photo 2"
                              className="w-1/3 h-auto rounded-md shadow-md"
                            />
                          </div>
                        </div>
                        <CardContent className="p-4 grid gap-3">
                          {/* New Owner Info with RTL */}
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              رقم الرخصة:
                            </span>
                            <span className="text-black"> 217670</span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              درجة رخصة القيادة :
                            </span>
                            <span className="text-black"> أولى ب</span>
                          </div>

                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              جهة الاصدار:
                            </span>
                            <span className="text-black">بنغازي</span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              مكان الترخيص:
                            </span>
                            <span className="text-black">
                              كيفري مكتب الترخيص
                            </span>
                          </div>
                          <div
                            className="flex justify-between items-center"
                            dir="rtl"
                          >
                            <span className="font-semibold text-black">
                              تاريخ الانتهاء:
                            </span>
                            <span className="text-black">2028-11-11</span>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </>
              ) : (
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>تنبيه!</AlertTitle>
                  <AlertDescription>
                    لم نتمكن من تحديد كود العين
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" onClick={resetAnalysis}>
          <RefreshCw className="mr-2" />
          إعادة تعيين
        </Button>
        <Button onClick={analyzeImage} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <Skeleton className="w-10 h-4" />
          ) : (
            <span>تحليل الصورة</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
