// page.tsx

"use client";
import { FacialRecognitionAppComponent } from "@/components/facial-recognition";
import React from "react";

const Page: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
      }}
    >
      <FacialRecognitionAppComponent />
    </div>
  );
};

export default Page;
