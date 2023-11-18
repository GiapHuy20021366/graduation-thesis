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
import { useAuthenticationContext } from "../../contexts";

interface FormValues {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function SignInForm() {
  const auth = useAuthenticationContext();

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
    <Box>
      <Container>
        <div>Back</div>
        <h1>Login F4U</h1>
      </Container>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
      >
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Container>
            <div>Or</div>
            <Grid>
              <div id="google-oauth" />
            </Grid>
          </Container>
          <Button type="submit" variant="contained">
            Login now
          </Button>
          <Container>
            <span>Not have a account yet, </span>
            <MuiLink to="/login?q=register" component={ReactRouterLink}>
              Register
            </MuiLink>
          </Container>
        </Stack>
      </Box>
    </Box>
  );
}
