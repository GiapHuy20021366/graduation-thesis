import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "../../env";
import { GoogleOAuthResponse } from "../../types/GoogleOAuthResponse";
import jwtDecode from "jwt-decode";
import {
  Box,
  Container,
  TextField,
  Stack,
  Grid,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthenticationContext, useLanguageContext } from "../../contexts";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const auth = useAuthenticationContext();
  const languageContext = useLanguageContext();
  const lang = languageContext.of(SignInForm);

  const signInSchema = yup.object({
    email: yup
      .string()
      .email(lang("invalid-email"))
      .required(lang("require-email")),
    password: yup
      .string()
      .required(lang("require-password"))
      .min(8, lang("invalid-length-password", 8)),
  });

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    auth.setAccount({
      isAuthenticated: true,
      ...data
    })
  };

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const handleCallbackResponse = (response: GoogleOAuthResponse) => {
    console.log(response);
    console.log(jwtDecode(response.credential));
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-oauth"),
      { theme: "outline", size: "large" }
    );
    window.google.accounts.id.prompt();
  }, []);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 3 }}
    >
      <Stack spacing={2}>
        <TextField
          label={lang("l-email")}
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label={lang("l-password")}
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Container>
          <div>{lang("or")}</div>
          <Grid>
            <div id="google-oauth" />
          </Grid>
        </Container>
        <Button type="submit" variant="contained">
          {lang("login-now")}
        </Button>
        <Container>
          <span>{lang("not-account-yet")}</span>
          <MuiLink to="/signup" component={ReactRouterLink}>
            {lang("signup")}
          </MuiLink>
        </Container>
      </Stack>
    </Box>
  );
}
