
import './element-style.css';
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google?: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // 1) Define the global callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        );
      }
    };

    // 2) Inject Google’s widget script once
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    } else {
      // If script already present (e.g., after HMR), try to init again
      window.googleTranslateElementInit?.();
    }
  }, []);

  return <div id="google_translate_element" />;
}
