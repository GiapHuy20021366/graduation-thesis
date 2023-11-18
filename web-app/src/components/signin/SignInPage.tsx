import { Container, Stack } from "@mui/material";
import SignInForm from "./SignInForm";
import { useLanguageContext } from "../../contexts";

export default function SignInPage() {
  const languageContext = useLanguageContext();
  const lang = languageContext.of(SignInPage);
  return (
    <Container>
      <Stack>
        <h1>{lang("signin")}</h1>
      </Stack>
      <SignInForm />
    </Container>
  );
}
