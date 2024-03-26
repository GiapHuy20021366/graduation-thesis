import "../../styles/PageNotFound.scss";
import { Link as MuiLink } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { useComponentLanguage } from "../../hooks";

export default function PageNotFound() {
  const lang = useComponentLanguage("ViewerData");
  return (
    <div className="page-not-found-container">
      <h1>{lang("lost-page")}</h1>
      <div className="link-container">
        <MuiLink component={ReactRouterLink} to={"/"}>
          {lang("turn-back-home")}
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
