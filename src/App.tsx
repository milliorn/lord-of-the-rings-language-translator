import React, { ChangeEvent, FormEvent, useState } from "react";

// Material UI imports
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";
const IMG_URL = "/background.avif";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundImage: `url(${IMG_URL})`,
    backgroundSize: "cover",
    color: theme.palette.primary.contrastText,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh",
    padding: theme.spacing(2),
    textAlign: "center",
  },
  form: {
    alignItems: "center",
    borderRadius: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(2),
    padding: theme.spacing(3),
  },
  input: {
    color: "white",
    margin: theme.spacing(2),
    width: "100%",
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& input": {
      textAlign: "center", // Center the text input
    },
  },
  inputUnderline: {
    "&:before": {
      borderBottomColor: "white",
    },
  },
  button: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(2),
  },
  select: {
    color: theme.palette.primary.contrastText,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    "&:before": {
      borderColor: theme.palette.primary.contrastText,
    },
    "&:after": {
      borderColor: theme.palette.primary.contrastText,
    },
  },
  typography: {
    fontFamily: "IMFellDWPica, serif",
    marginBottom: theme.spacing(1),
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
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("sindarin");

  const classes = useStyles();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleLanguageChange = (e: ChangeEvent<{ value: unknown }>) => {
    const newLanguage = e.target.value as string;
    onLanguageChange(newLanguage);
    setSelectedLanguage(newLanguage);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onTranslate(inputText, selectedLanguage);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography variant="h3" style={{ fontFamily: "IMFellDWPica, serif" }}>
        Enter your text
      </Typography>
      <TextField
        className={classes.input}
        onChange={handleInputChange}
        type="text"
        value={inputText}
        InputProps={{
          classes: {
            underline: classes.inputUnderline, // Use inputUnderline instead of underline
          },
          style: { color: "white" },
        }}
      />
      <FormControl className={classes.input}>
        <Typography variant="h3" className={classes.typography}>
          Choose language
        </Typography>
        <Select
          className={classes.select}
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
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
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        style={{ fontFamily: "GaramondRegular, serif" }}
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
          max_tokens: 100,
          model: "gpt-3.5-turbo",
          temperature: 0,
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
    <div className={classes.root}>
      <Typography
        variant="subtitle2"
        style={{
          fontFamily: "GaramondRegular, serif",
          fontSize: "2rem",
          marginBottom: "-2rem",
        }}
      >
        The
      </Typography>
      <Typography variant="h1" style={{ fontFamily: "GaramondRegular, serif" }}>
        Lord
      </Typography>
      <Typography
        variant="subtitle2"
        style={{
          fontFamily: "GaramondRegular, serif",
          fontSize: "2rem",
          marginBottom: "-2rem",
        }}
      >
        of the
      </Typography>
      <Typography variant="h1" style={{ fontFamily: "GaramondRegular, serif" }}>
        Rings
      </Typography>

      <TranslationForm
        onTranslate={handleTranslate}
        onLanguageChange={handleLanguageChange}
      />

      <Typography variant="h3" style={{ fontFamily: "IMFellDWPica, serif" }}>
        {translations[selectedDisplayLanguage.toLowerCase()]}
      </Typography>
    </div>
  );
};

export default App;
