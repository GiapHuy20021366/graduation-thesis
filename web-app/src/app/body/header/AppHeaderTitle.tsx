import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { I18Resolver } from "../../I18nContext";
import { useComponentLanguage } from "../../../hooks";

interface ILanguageProps {
  lang: I18Resolver;
}

function HomeTitle({ lang }: ILanguageProps) {
  return <span>{lang("home")}</span>;
}

function AccountTitle({ lang }: ILanguageProps) {
  return <span>{lang("account")}</span>;
}

function LocationTitle({ lang }: ILanguageProps) {
  return <span>{lang("location")}</span>;
}

function SettingTitle({ lang }: ILanguageProps) {
  return <span>{lang("setting")}</span>;
}

function FoodTitle({ lang }: ILanguageProps) {
  return <span>{lang("food")}</span>;
}

function SearchTitle({ lang }: ILanguageProps) {
  return <span>{lang("search")}</span>;
}

export default function AppHeaderTitle() {
  const lang = useComponentLanguage("AppHeaderTitle");
  return (
    <Box
      sx={{
        fontWeight: 600,
        fontSize: "1.5rem",
      }}
    >
      <Routes>
        <Route path="/" element={<HomeTitle lang={lang} />} />
        <Route path="/home/*" element={<HomeTitle lang={lang} />} />
        <Route path="/account/*" element={<AccountTitle lang={lang} />} />
        <Route path="/location/*" element={<LocationTitle lang={lang} />} />
        <Route path="/setting/*" element={<SettingTitle lang={lang} />} />
        <Route path="/food/*" element={<FoodTitle lang={lang} />} />
        <Route path="/search/*" element={<SearchTitle lang={lang} />} />
      </Routes>
    </Box>
  );
}
