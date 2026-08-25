# 3ain (عين)

**Civic identity verification for Libya — face recognition and license plate recognition in one platform.**

## Overview

Libya's civic infrastructure lacks accessible digitized identity verification. Citizens interact with government offices that rely on manual checks — holding up an ID card, comparing a photo, reading a plate number by hand. The gap between physical identity documents and digital systems creates friction at every checkpoint, registration desk, and traffic stop.

3ain bridges that gap with computer vision.

## Problem

Two verification needs dominate Libyan civic life:

1. **Who is this person?** — manual photo-on-ID comparison fails at scale, has no audit trail, and is trivially defeated by a printed photo
2. **What vehicle is this?** — plate numbers are handwritten into ledgers, cross-referencing against registration databases requires phone calls or trips to government offices

Both problems share the same root: no real-time, camera-first system that can take a photo and return a verified identity in seconds.

## Solution

Three components, one platform:

- **`apps/web`** — facial recognition identity verification. Captures a face photo via device camera, runs DeepFace analysis (age, gender, race, emotion), matches against a citizen database using ArcFace embeddings, and returns verified identity. Arabic UI with full RTL layout.
- **`apps/vehicle`** — license plate recognition. Captures a vehicle photo, detects the car via YOLO object detection, crops and isolates the license plate, runs OCR to extract the plate number, and cross-references against registration data. Arabic UI.
- **`backend`** — FastAPI server powering the facial recognition pipeline. Accepts base64 images, runs DeepFace analysis + face matching against a local database, returns structured identity results.

## Impact

Both apps are **deployed on Vercel** and operational:

- **Identity verification**: deployed at [3ain-sigma.vercel.app](https://3ain-sigma.vercel.app)
- **Vehicle recognition**: deployed at [3ain-vehicle.vercel.app](https://3ain-vehicle.vercel.app)

Real-time camera capture on mobile devices. Full Arabic interface. Results in seconds, not hours.

## My Role

Built the full stack — frontend (Next.js 14 + TypeScript + Tailwind/shadcn/ui), backend (FastAPI + DeepFace + ArcFace), and deployment pipeline. Co-developed with government stakeholders to ensure the verification workflow matched real civic processes.

## Technology

**Frontend:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Vercel Analytics  
**Backend:** Python · FastAPI · DeepFace · ArcFace · Pillow · Pandas  
**Detection:** YOLO object detection (vehicle) · OCR pipeline (plate reading)  
**Deployed:** Vercel (frontend) · self-hosted (backend)

## Architecture

```
3ain/
├── apps/
│   ├── web/          # Facial recognition identity app
│   │   ├── app/      # Next.js app router
│   │   ├── components/  # Camera, scan, result drawers
│   │   └── data/     # Demo citizen data
│   └── vehicle/      # License plate recognition app
│       ├── app/      # Next.js app router
│       └── components/  # Plate recognition, OCR display
└── backend/
    ├── app.py        # FastAPI server (DeepFace + ArcFace)
    ├── requirements.txt
    └── user/database/  # Face embedding database (demo data)
```

## Engineering Highlights

- **ArcFace embeddings** for identity matching — not naive photo comparison but learned face representations that are robust to lighting, angle, and expression variance
- **Composite pipeline** for vehicle recognition: YOLO detection → crop → plate isolation → OCR → registration lookup — not a single monolithic model
- **Full Arabic RTL** interface across both apps — component library chosen for RTL compatibility
- **Camera-first** design — both apps are built for mobile camera capture, not file upload

## Current Status

**Production** — both apps deployed and operational on Vercel. Backend requires local setup (DeepFace + face database). Demo data included.

## What I'd Build Next

- Liveness detection (anti-spoofing against printed photos)
- Backend containerization for one-command deployment
- Shared component library between the two apps (currently duplicated shadcn/ui setup)
- Registration database API integration for real-time plate verification
