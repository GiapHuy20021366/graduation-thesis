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
  Checkbox,
  FormControlLabel,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLanguageContext } from "../../contexts";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function SignUpForm() {
  const languageContext = useLanguageContext();
  const lang = languageContext.of(SignUpForm);

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

  const onSubmit = (data: FormValues) => {
    console.log(data);
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
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Grid container spacing={2}>
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
        <Container>
          <div>{lang("or")}</div>
          <Grid>
            <div id="google-oauth" />
          </Grid>
        </Container>
        <Button type="submit" variant="contained">
          {lang("join-now")}
        </Button>
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
