import { useState, FunctionComponent } from "react";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

import React from "react";

interface TranslationFormProps {
  onTranslate: (text: string) => void;
}

type TranslationForm = React.FC<TranslationFormProps>;

const TranslationForm: TranslationForm = ({ onTranslate }) => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onTranslate(inputText);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your text:
        <input type="text" value={inputText} onChange={handleInputChange} />
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

  const handleTranslate = async (text: string) => {
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

      console.log("Response:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTranslations({
        sindarin:
          data.choices[0]?.message?.content ||
          "No Sindarin translation available",
        quenya:
          data.choices[1]?.message?.content ||
          "No Quenya translation available",
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
