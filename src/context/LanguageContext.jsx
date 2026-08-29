import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LanguageContext = createContext(null);

const LANGUAGE_KEY = "aft_language";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Ignore localStorage errors
    }

    document.documentElement.lang =
      language === "ta" ? "ta" : "en";
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (newLanguage !== "en" && newLanguage !== "ta") {
      return;
    }

    setLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    setLanguage((currentLanguage) =>
      currentLanguage === "en" ? "ta" : "en"
    );
  };

  const value = useMemo(
    () => ({
      language,
      isTamil: language === "ta",
      changeLanguage,
      toggleLanguage,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}

export default LanguageContext;