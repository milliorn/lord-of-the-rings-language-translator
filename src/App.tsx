import React, { ChangeEvent, FormEvent, useState } from "react";

// Material UI imports
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.grey[100],
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    margin: theme.spacing(2),
    textAlign: "center",
  },
  form: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(2),
  },
  label: {
    color: theme.palette.grey[100],
    margin: theme.spacing(2),
  },
  input: {
    color: theme.palette.grey[100],
    margin: theme.spacing(2),
    "& label.Mui-focused": {
      color: theme.palette.grey[100],
    },
  },
  button: {
    color: theme.palette.grey[100],
    margin: theme.spacing(2),
  },
}));

interface TranslationFormProps {
  onTranslate: (text: string, language: string) => void;
  onLanguageChange: (language: string) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({
  onTranslate,
  onLanguageChange,
}) => {
  const classes = useStyles();
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("sindarin");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleLanguageChange = (e: ChangeEvent<{ value: unknown }>) => {
    const newLanguage = e.target.value as string;
    setSelectedLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onTranslate(inputText, selectedLanguage);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <InputLabel className={classes.label}>Enter your text:</InputLabel>
      <TextField
        className={classes.input}
        type="text"
        value={inputText}
        onChange={handleInputChange}
      />
      <FormControl className={classes.input}>
        <InputLabel>Choose language:</InputLabel>
        <Select value={selectedLanguage} onChange={handleLanguageChange}>
          <MenuItem value="adunaic">Adûnaic</MenuItem>
          <MenuItem value="black-speech">Black Speech</MenuItem>
          <MenuItem value="quenya">Quenya</MenuItem>
          <MenuItem value="rohirric">Rohirric</MenuItem>
          <MenuItem value="sindarin">Sindarin</MenuItem>
          <MenuItem value="telerin">Telerin</MenuItem>
          <MenuItem value="westron">Westron</MenuItem>
        </Select>
      </FormControl>
      <Button
        className={classes.button}
        type="submit"
        variant="contained"
        color="primary"
      >
        Translate
      </Button>
    </form>
  );
};

const App = () => {
  const classes = useStyles();

  const [translations, setTranslations] = useState<{ [key: string]: string }>({
    sindarin: "",
    quenya: "",
    elvish: "",
    khuzdul: "",
    adunaic: "",
    blackSpeech: "",
    rohirric: "",
    telerin: "",
    westron: "",
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
              role: "system",
              content: `Translate the following English text into ${language}: ${text}`,
            },
          ],
          model: "gpt-3.5-turbo",
          temperature: 0,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log(data);

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
    <div className={classes.root}>
      <h1>Lord of the Rings Language Translator</h1>
      <TranslationForm
        onTranslate={handleTranslate}
        onLanguageChange={handleLanguageChange}
      />
      <div>
        <h2>{selectedDisplayLanguage}: </h2>
        <p>{translations[selectedDisplayLanguage.toLowerCase()]}</p>
      </div>
    </div>
  );
};

export default App;
