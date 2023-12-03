import React, { useState } from "react";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

const TranslationForm: React.FC<{
  onTranslate: (text: string, language: string) => void;
}> = ({ onTranslate }) => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("sindarin");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
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
  const [translations, setTranslations] = useState({
    sindarin: "",
    quenya: "",
  });

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

      setTranslations({
        ...translations,
        [language]:
          data.choices[0]?.message?.content ||
          `No ${language} translation available`,
      });
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <h1>ChatGPT Translation App</h1>
      <TranslationForm onTranslate={handleTranslate} />
      <div>
        <h2>Sindarin:</h2>
        <p>{translations.sindarin}</p>
      </div>
      <div>
        <h2>Quenya:</h2>
        <p>{translations.quenya}</p>
      </div>
    </div>
  );
};

export default App;
