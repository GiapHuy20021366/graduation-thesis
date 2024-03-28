import { Stack } from "@mui/material";
import SignInForm from "./SignInForm";
import { useI18nContext } from "../../hooks";

export default function SignInPage() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(SignInPage);
  return (
    <Stack
      sx={{
        alignItems: "center",
        padding: "1rem",
        textAlign: "center",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Stack>
        <h1>{lang("signin")}</h1>
      </Stack>
      <SignInForm />
    </Stack>
  );
}
