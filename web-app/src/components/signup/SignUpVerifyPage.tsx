import { Container, Link, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LoadingButton } from "@mui/lab";
import { userFetcher } from "../../api";
import { useAuthContext } from "../../contexts";

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

  return (
    <Container>
      <Stack>
        <h1>Verify your account</h1>
        <p>All done, we sent active to your email</p>
        <Link href={`https://${account.email}`}>{account.email}</Link>
      </Stack>
      <Stack>
        <p>Don't recieve email,</p>
        <LoadingButton loading={loading} onClick={handleClick}>
          Try again
        </LoadingButton>
      </Stack>
    </Container>
  );
}

function AccountTokenVerify() {
  const navigate = useNavigate();
  const auth = useAuthContext();

  useEffect(() => {
    const location = window.location;
    const token = new URLSearchParams(location.search).get("token") as
      | string
      | undefined;
    if (token == null) {
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
  }, []);

  return <div>Verifying...</div>;
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
