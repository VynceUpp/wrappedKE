# wrappedKE 🇰🇪
**Your M-Pesa year, wrapped.**

wrappedKE turns your M-Pesa statement into a beautiful, Spotify Wrapped-style financial summary:
- Spending insights & trends
- Visual charts
- Fun highlights & personality
- Shareable stories

<img width="1501" height="994" alt="image" src="https://github.com/user-attachments/assets/fe508996-c308-4bbc-beb1-5b726d043401" />
<img width="1913" height="993" alt="image" src="https://github.com/user-attachments/assets/82dec50e-3413-448e-9550-64d9b5da1367" />
<img width="1911" height="986" alt="image" src="https://github.com/user-attachments/assets/feb21630-55a6-4824-b1f2-ae3f8b014d45" />

<img width="1411" height="999" alt="image" src="https://github.com/user-attachments/assets/7eb6be9c-f6aa-4674-83fe-cb343e3edaa7" />


## Privacy First 🔒
All processing happens **locally in your browser**.  
Your statement is **never uploaded, stored, or shared**.

## Features
- **Upload M-Pesa statements** (CSV recommended, PDF supported with password)
- **Automatic transaction categorization**
- **Monthly income vs expenses** charts
- **Category breakdown** & top spending areas
- **Top recipients**
- **Spending Personality** (e.g., 💰 The Saver, 🎉 The Spender, 🛍️ The Shopaholic)
- **Personalized highlights** (highest spending month, net savings, etc.)
- **Spotify Wrapped-style Story Slides**
- **Detailed Analytics Dashboard**
- **Demo mode** with realistic mock data


## How to Use
1. Export your M-Pesa statement:
   - **Best option**: CSV from the M-PESA app (fast & 100% accurate)
   - PDF statements work too (enter your password: National ID number or 6-digit SMS code) ## but still not fixed, if you can help please do
2. Upload the file
3. Enjoy your financial year in review!

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- PapaParse (CSV)
- pdfjs-dist + Tesseract.js (PDF parsing & OCR fallback)
- Lucide React icons
- Sonner (toasts)

## Development
```bash
npm install
npm run dev
