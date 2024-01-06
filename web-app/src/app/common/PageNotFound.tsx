import "../../styles/PageNotFound.scss";
import { Link as MuiLink } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="page-not-found-container">
      <h1>Maybe you go to lost page</h1>
      <div className="link-container">
        <MuiLink component={ReactRouterLink} to={"/"}>
          Turn back to Home
        </MuiLink>
      </div>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
    </div>
  );
}
