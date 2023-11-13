import { useForm } from "react-hook-form";
import { useEffect } from "react";
import "styles/App.css";
import { GOOGLE_CLIENT_ID } from "../env";
import { GoogleOAuthResponse } from "../types/GoogleOAuthResponse";
import jwtDecode from "jwt-decode";


interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function LoginForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
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
    <div className="form-container">
      <h1 className="Register">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="firstName">FirstName</label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", {
              required: {
                value: true,
                message: "FirstName is required",
              },
            })}
          />
          <p className="error">{errors.firstName?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="lastName">LastName</label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", {
              required: {
                value: true,
                message: "LastName is required",
              },
            })}
          />
          <p className="error">{errors.lastName?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />
          <p className="error">{errors.password?.message}</p>
        </div>
        <div className="form-control">
            <div id="google-oauth"></div>
        </div>
        <button>Join</button>
      </form>
    </div>
  );
}
