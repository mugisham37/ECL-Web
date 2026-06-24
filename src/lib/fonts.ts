import localFont from "next/font/local";

export const hankenGrotesk = localFont({
  src: "../../public/fonts/hanken-grotesk-latin-wght-normal.woff2",
  variable: "--font-ui-family",
  display: "swap",
  weight: "100 900",
});

export const spectral = localFont({
  src: [
    {
      path: "../../public/fonts/spectral-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/spectral-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/spectral-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/spectral-latin-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/spectral-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/spectral-latin-600-italic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-display-family",
  display: "swap",
});

export const geistMono = localFont({
  src: [
    {
      path: "../../public/fonts/geist-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/geist-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono-family",
  display: "swap",
});

export const fontVariables = `${hankenGrotesk.variable} ${spectral.variable} ${geistMono.variable}`;
