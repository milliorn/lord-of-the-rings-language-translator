import React, { useState } from "react";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

const TranslationForm: React.FC<{
  onTranslate: (text: string, language: string) => void;
  onLanguageChange: (language: string) => void;
}> = ({ onTranslate, onLanguageChange }) => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("sindarin");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTranslate(inputText, selectedLanguage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your text:
        <input type="text" value={inputText} onChange={handleInputChange} />
      </label>
      <label>
        Choose language:
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="sindarin">Sindarin</option>
          <option value="quenya">Quenya</option>
        </select>
      </label>
      <button type="submit">Translate</button>
    </form>
  );
};

const App = () => {
  const [translations, setTranslations] = useState<{ [key: string]: string }>({
    sindarin: "",
    quenya: "",
  });

  const [selectedDisplayLanguage, setSelectedDisplayLanguage] =
    useState("Sindarin");

  const handleTranslate = async (text: string, language: string) => {
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: text,
            },
          ],
          model: "gpt-3.5-turbo",
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.statusText}`);
      }

      const data = await response.json();

      setTranslations((prevTranslations) => ({
        ...prevTranslations,
        [language]:
          data.choices[0]?.message?.content ||
          `No ${language} translation available`,
      }));

      // Update the selected display language
      setSelectedDisplayLanguage(
        language.charAt(0).toUpperCase() + language.slice(1)
      );
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedDisplayLanguage(
      language.charAt(0).toUpperCase() + language.slice(1)
    );
  };

  return (
    <div>
      <h1>Lord of the Rings Elvish Translator</h1>
      <TranslationForm
        onTranslate={handleTranslate}
        onLanguageChange={handleLanguageChange}
      />
      <div>
        <h2>{selectedDisplayLanguage}:</h2>
        <p>{translations[selectedDisplayLanguage.toLowerCase()]}</p>
      </div>
    </div>
  );
};

export default App;
