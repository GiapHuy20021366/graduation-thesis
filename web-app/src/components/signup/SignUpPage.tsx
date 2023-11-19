import { Container, Stack } from "@mui/material";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import BeforeJoin from "./BeforeJoin";
import { useLanguageContext } from "../../contexts";

export default function SignUpPage() {
  const [accepted, setAccepted] = useState<boolean>(false);
  const languageContext = useLanguageContext();
  const lang = languageContext.of(SignUpPage);

  return (
    <>
      {accepted ? (
        <Container>
          <Stack>
            <h1>{lang("join", "F4U")}</h1>
          </Stack>
          <SignUpForm />
        </Container>
      ) : (
        <BeforeJoin setAccepted={setAccepted} />
      )}
    </>
  );
}