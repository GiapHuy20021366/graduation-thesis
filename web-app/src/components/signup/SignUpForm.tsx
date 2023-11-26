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
  Checkbox,
  FormControlLabel,
  Button,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthenticationContext, useLanguageContext } from "../../contexts";
import { userFetcher } from "../../api";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const languageContext = useLanguageContext();
  const lang = languageContext.of(SignUpForm);

  const auth = useAuthenticationContext();

  const signUpSchema = yup.object({
    firstName: yup.string().required(lang("require-firstname")),
    lastName: yup.string().required(lang("require-lastname")),
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
      firstName: "",
      lastName: "",
    },
    resolver: yupResolver(signUpSchema),
  });

  const { register, handleSubmit, formState, setError } = form;
  const { errors } = formState;

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

  const onSubmit = (data: FormValues) => {
    userFetcher
      .manualRegister(data)
      .then(() => navigate("/signup/verify", { state: data }))
      .catch((error) => {
        const target = error?.data?.target;
        const reason = error?.data?.reason;
        if (target === "email") {
          if (reason === "EMAIL_EXISTED") {
            setError("email", {
              message: lang("email-existed"),
            });
          }
        }
      });
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
      sx={{
        mt: 3,
        width: ["100%", "60%", "50%", "40%"],
      }}
    >
      <Stack spacing={2}>
        <TextField
          label={lang("l-firstname")}
          type="text"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          label={lang("l-lastname")}
          type="text"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
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
        <Grid container spacing={2} textAlign="left">
          <FormControlLabel
            control={
              <Checkbox
                value="allowExtraEmails"
                color="primary"
                defaultChecked
              />
            }
            label={lang("l-allow-email")}
          />
        </Grid>
        <Button type="submit" variant="contained">
          {lang("join-now")}
        </Button>
        <Container>
          <Box
            sx={{
              textAlign: "center",
              margin: "0 0 0.8rem 0",
            }}
          >
            <b>{lang("or")}</b>
          </Box>
          <Stack>
            <div id="google-oauth" />
          </Stack>
        </Container>
        <Container>
          <span>{lang("have-account-yet")}</span>
          <MuiLink to="/signin" component={ReactRouterLink}>
            {lang("signin")}
          </MuiLink>
        </Container>
      </Stack>
    </Box>
  );
}
