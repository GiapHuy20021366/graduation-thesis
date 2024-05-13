import { Stack } from "@mui/material";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import BeforeJoin from "./BeforeJoin";
import { useI18nContext } from "../../hooks";

export default function SignUpPage() {
  const [accepted, setAccepted] = useState<boolean>(true);
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
            <h1>{lang("join", "CommuniFood")}</h1>
          </Stack>
          <SignUpForm />
        </Stack>
      ) : (
        <BeforeJoin setAccepted={setAccepted} />
      )}
    </>
  );
}
