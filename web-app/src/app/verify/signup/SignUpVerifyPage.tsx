import { Container, Link, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LoadingButton } from "@mui/lab";
import { userFetcher } from "../../../api";
import { useAuthContext, useComponentLanguage, useDirty } from "../../../hooks";

interface IAccountInfo {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface IWaitingEmailVerify {
  account: IAccountInfo;
}

function WaitingEmailVerify({ account }: IWaitingEmailVerify) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    userFetcher
      .manualRegister(account)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setTimeout(() => {
      setLoading(false);
    }, 10000);
  };

  const lang = useComponentLanguage();

  return (
    <Container>
      <Stack>
        <h1>{lang("verify-your-account")}</h1>
        <p>{lang("all-done-sent-active")}</p>
        <Link
          href={`https://${account.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {account.email}
        </Link>
      </Stack>
      <Stack
        direction={"row"}
        sx={{
          alignContent: "center",
        }}
      >
        <p>{lang("not-recieved-email")}?</p>
        <LoadingButton
          loading={loading}
          onClick={handleClick}
          sx={{ width: "fit-content", textTransform: "none" }}
        >
          {lang("try-again")}
        </LoadingButton>
      </Stack>
    </Container>
  );
}

function AccountTokenVerify() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const lang = useComponentLanguage();
  const location = window.location;
  const token = new URLSearchParams(location.search).get("token") as
    | string
    | undefined;

  const dirty = useDirty();
  useEffect(() => {
    dirty.perform(() => {
      if (token == null) {
        console.log("Token not found");
        navigate("/error/page-wrong", { replace: true });
      } else {
        userFetcher
          .activeMannualAccount(token)
          .then((response) => {
            const account = response.data;
            auth.setAccount(account);
            auth.setToken(account?.token);
          })
          .catch((error) => {
            console.error(error);
            navigate("/error/page-wrong", { replace: true });
          });
      }
    });
  }, [auth, dirty, navigate, token]);

  return <div>{lang("verifying")}...</div>;
}

export default function SignUpVerifyPage() {
  const location = useLocation();
  const account = location.state as IAccountInfo | undefined;

  return (
    <>
      {account != null ? (
        <WaitingEmailVerify account={account} />
      ) : (
        <AccountTokenVerify />
      )}
    </>
  );
}
