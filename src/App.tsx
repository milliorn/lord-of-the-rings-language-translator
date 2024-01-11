// React imports
import React, { ChangeEvent, FormEvent, useState } from "react";

// Material UI imports
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel } from "@material-ui/core";

/**
 * The endpoint for the chat completions API.
 */
const ENDPOINT = "https://api.openai.com/v1/chat/completions";

/**
 * The URL for the background image.
 */
// const IMG_URL = "/background.avif";

/**
 * The URL for the source code repository.
 */
const SOURCE_CODE_URL =
  "https://github.com/milliorn/lord-of-the-rings-language-translator";

/**
 * Custom hook to generate styles using Material-UI's makeStyles function.
 * @param {Theme} theme - The theme object provided by Material-UI.
 * @returns {Object} - The generated styles object.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    // backgroundImage: `url(${IMG_URL})`,
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
  footer: {
    marginTop: theme.spacing(6),
  },
}));

/**
 * Props for the TranslationForm component.
 */
interface TranslationFormProps {
  /**
   * Callback function to handle translation.
   * @param text - The text to be translated.
   * @param language - The target language for translation.
   */
  onTranslate: (text: string, language: string) => void;

  /**
   * Callback function to handle language change.
   * @param language - The selected language.
   */
  onLanguageChange: (language: string) => void;
}

/**
 * TranslationForm component.
 *
 * @component
 * @param {TranslationFormProps} props - The props for the TranslationForm component.
 * @returns {React.ReactElement} The rendered TranslationForm component.
 */
const TranslationForm: React.FC<TranslationFormProps> = ({
  onTranslate,
  onLanguageChange,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("sindarin");
  const [labelVisible, setLabelVisible] = useState(true); // State to control label visibility

  /**
   * The CSS classes for the component.
   */
  const classes = useStyles();

  /**
   * Handles the change event of the input element.
   * @param e The change event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (labelVisible) setLabelVisible(false); // Hide label when typing starts
  };

  /**
   * Handles the change event of the select element.
   * @param e The change event object.
   */
  const handleLanguageChange = (e: ChangeEvent<{ value: unknown }>) => {
    const newLanguage = e.target.value as string;
    onLanguageChange(newLanguage);
    setSelectedLanguage(newLanguage);
  };

  /**
   * Handles the submit event of the form element.
   * @param e The submit event object.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onTranslate(inputText, selectedLanguage);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography variant="h2" id="iIMFellDWPica-h2">
        Enter your text
      </Typography>

      <FormControl className={classes.input}>
        <InputLabel
          htmlFor="text-input"
          style={{
            color: "white",
            display: labelVisible ? "block" : "none", // Control visibility based on state
          }}
        ></InputLabel>

        <TextField
          id="text-input"
          name="text" // Add this line
          placeholder="Click and type here"
          className={classes.input}
          onChange={handleInputChange}
          type="text"
          value={inputText}
        />
      </FormControl>

      <FormControl className={classes.input}>
        <Typography variant="h3" className={classes.typography}>
          Choose language
        </Typography>

        <Select
          id="language-select"
          name="language" // Add this line
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
        id="font-garamondRegular"
      >
        Translate
      </Button>
    </form>
  );
};

/**
 * The App component.
 *
 * @component
 * @returns {React.ReactElement} The rendered App component.
 */
const App = () => {
  /**
   * The CSS classes for the component.
   */
  const classes = useStyles();

  /**
   * The translations state.
   */
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

  /**
   * The selected display language state.
   */
  const [selectedDisplayLanguage, setSelectedDisplayLanguage] =
    useState("Sindarin");

  /**
   * Translates the given text to the specified language.
   *
   * @param text The text to be translated.
   * @param language The target language for translation.
   * @returns A Promise that resolves to the translated text.
   */
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

      /**
       * Checks if the response is not ok and throws an error with the status text.
       * @param {Response} response - The response object from the translation request.
       * @throws {Error} - Throws an error with the status text if the response is not ok.
       */
      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.statusText}`);
      }

      /**
       * Parses the response body as JSON and assigns it to the 'data' variable.
       * @returns {Promise<any>} A promise that resolves to the parsed JSON data.
       */
      const data = await response.json();

      /**
       * Checks if the response contains an error and throws an error with the error message.
       * @param {any} data - The parsed JSON data from the translation request.
       * @throws {Error} - Throws an error with the error message if the response contains an error.
       * @returns {Promise<any>} A promise that resolves to the parsed JSON data.
       */
      if (data.error) {
        throw new Error(`Translation request failed: ${data.error.message}`);
      }

      /**
       * Checks if the response contains any choices and throws an error if it doesn't.
       * @param {any} data - The parsed JSON data from the translation request.
       * @throws {Error} - Throws an error if the response contains no choices.
       * @returns {Promise<any>} A promise that resolves to the parsed JSON data.
       */
      setTranslations((prevTranslations) => ({
        ...prevTranslations,
        [language]:
          data.choices[0]?.message?.content ||
          `No ${language} translation available`,
      }));

      /**
       * Sets the selected display language.
       * @param {string} language - The language to set as the selected display language.
       */
      setSelectedDisplayLanguage(
        language.charAt(0).toUpperCase() + language.slice(1)
      );
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  /**
   * Handles the change event of the select element.
   * @param {string} language - The selected language.
   */
  const handleLanguageChange = (language: string) => {
    setSelectedDisplayLanguage(
      language.charAt(0).toUpperCase() + language.slice(1)
    );
  };

  return (
    <div className={classes.root}>
      <Typography variant="h1" id="garamondRegular-title">
        The
      </Typography>
      <Typography variant="h1" id="font-garamondRegularLord">
        Lord
      </Typography>
      <Typography variant="h1" id="garamondRegular-title2">
        of the
      </Typography>
      <Typography variant="h1" id="font-garamondRegularRings">
        Rings
      </Typography>

      <TranslationForm
        onTranslate={handleTranslate}
        onLanguageChange={handleLanguageChange}
      />

      <Typography variant="h3" id="iIMFellDWPica-h3">
        {translations[selectedDisplayLanguage.toLowerCase()]}
      </Typography>

      <div className={classes.footer}>
        <Typography variant="body2">
          Powered by{" "}
          <a
            href="https://www.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            id="garamondRegular-whiteAI"
          >
            OpenAI
          </a>
        </Typography>

        <Typography variant="body2">
          Souce code @{" "}
          <a
            href={SOURCE_CODE_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="garamondRegular-whiteGithub"
          >
            Github
          </a>
        </Typography>
      </div>
    </div>
  );
};

export default App;
