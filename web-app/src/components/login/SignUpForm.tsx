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
import {Link as ReactRouterLink} from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const signUpSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
});

export default function SignUpForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    resolver: yupResolver(signUpSchema)
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
    <Box>
      <Container>
        <div>Back</div>
        <h1>Join F4U</h1>
      </Container>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
      >
        <Stack spacing={2}>
          <TextField
            label="First name"
            type="text"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last name"
            type="text"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
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
          <Grid container spacing={2}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
          </Grid>
          <Container>
            <div>Or</div>
            <Grid>
              <div id="google-oauth" />
            </Grid>
          </Container>
          <Button type="submit" variant="contained">
            Join now
          </Button>
          <Container>
            <span>Already have a account yet, </span>
            <MuiLink to="/login" component={ReactRouterLink}>
              Login
            </MuiLink>
          </Container>
        </Stack>
      </Box>
    </Box>
  );
}
