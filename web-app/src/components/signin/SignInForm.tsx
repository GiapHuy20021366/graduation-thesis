import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../../env";
import { GoogleOAuthResponse } from "../../types/GoogleOAuthResponse";
import {
  Box,
  Container,
  TextField,
  Stack,
  Grid,
  Button,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthenticationContext, useLanguageContext } from "../../contexts";
import { userErrorReasons, userErrorTargets, userFetcher } from "../../api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const auth = useAuthenticationContext();
  const languageContext = useLanguageContext();
  const lang = languageContext.of(SignInForm);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const signInSchema = yup.object({
    email: yup
      .string()
      .required(lang("require-email"))
      .email(lang("invalid-email")),
    password: yup
      .string()
      .required(lang("require-password"))
      .matches(/[a-z]/, lang("at-least-one-lower-case"))
      .matches(/[A-Z]/, lang("at-least-one-upper-case"))
      .matches(/[0-9]/, lang("at-least-one-digit"))
      .matches(/[!@#$%^&*(),.?":{}|<>]/, lang("at-least-one-special"))
      .matches(/^\S*$/, lang("no-white-space"))
      .min(8, lang("invalid-length-password")),
  });

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signInSchema),
  });

  const { register, handleSubmit, formState, setError } = form;
  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    userFetcher
      .manualLogin(data.email, data.password)
      .then((response) => {
        const account = response.data;
        auth.setAccount(account);
        auth.setToken(account?.token);
      })
      .catch((error) => {
        const target = error?.data?.target as string | undefined;
        if (target != null) {
          const reason = error.data.reason as string;
          switch (target) {
            case userErrorTargets.EMAIL:
              if (reason === userErrorReasons.NO_EMAIL_FOUND) {
                setError("email", {
                  message: lang("no-email-found"),
                });
              }
              break;
            case userErrorTargets.PASSWORD:
              if (reason === userErrorReasons.INCORRECT_PASSWORD) {
                setError("password", {
                  message: lang("incorrect-password"),
                });
              }
              break;
          }
        }
      });
  };

  const handleCallbackResponse = (response: GoogleOAuthResponse) => {
    userFetcher
      .googleOAuthLogin(response.credential)
      .then((response) => {
        const account = response.data;
        console.log(account);
        auth.setAccount(account);
        auth.setToken(account?.token);
      })
      .catch((error) => console.log(error));
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
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
