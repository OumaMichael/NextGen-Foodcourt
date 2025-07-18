// src/pages/_app.tsx
import "@/../src/index.css"; // Tailwind styles
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
