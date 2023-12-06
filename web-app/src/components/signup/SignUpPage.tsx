import { Stack } from "@mui/material";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import BeforeJoin from "./BeforeJoin";
import { useI18nContext } from "../../contexts";

export default function SignUpPage() {
  const [accepted, setAccepted] = useState<boolean>(false);
  const languageContext = useI18nContext();
  const lang = languageContext.of(SignUpPage);

  return (
    <>
      {accepted ? (
        <Stack sx={{
          padding: "1rem",
          alignItems: "center",
          textAlign: "center"
        }}>
          <Stack>
            <h1>{lang("join", "F4U")}</h1>
          </Stack>
          <SignUpForm />
        </Stack>
      ) : (
        <BeforeJoin setAccepted={setAccepted} />
      )}
    </>
  );
}
