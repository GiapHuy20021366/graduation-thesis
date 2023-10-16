import { useEffect } from 'react'
import 'styles/App.css'
import {
  GOOGLE_CLIENT_ID
} from "./env";
import { GoogleOAuthResponse } from './types/GoogleOAuthResponse';
import jwtDecode from 'jwt-decode';
import "./types/declare";

function App() {

  console.log("asasd".format(true, false, 1, "huy"));

  const handleCallbackResponse = (response: GoogleOAuthResponse) => {
    console.log(response);
    console.log(jwtDecode(response.credential));
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-oauth"),
      { theme: "outline", size: "large"}
    );
    window.google.accounts.id.prompt();
  }, []);

  return (
    <>
      <div className='App'>
        <div id="google-oauth">
        </div>
      </div>
    </>
  )
}

export default App
