import { useCallback, useEffect, useState } from "react";
import { IUserExposedWithFollower } from "../../../data";
import {
  useAuthContext,
  useLoader,
  usePageProgessContext,
} from "../../../hooks";
import { userFetcher } from "../../../api";
import PageNotFound from "../../common/PageNotFound";
import UserViewerData from "./UserViewerData";
import UserViewerHolder from "./UserViewerHolder";
import UserViewerRetry from "./UserViewerRetry";
import UserViewerContextProvider from "./UserViewerContext";

interface IUserViewerIdProps {
  id?: string;
}

export default function UserViewerId({ id }: IUserViewerIdProps) {
  const [data, setData] = useState<IUserExposedWithFollower>();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const loader = useLoader();

  const progressContext = usePageProgessContext();

  const doLoadUser = useCallback(() => {
    if (loader.isFetching || isNotFound) return;
    if (auth == null) return;
    if (id == null) return;

    loader.setIsError(false);
    loader.setIsFetching(true);

    progressContext.start();
    userFetcher
      .getDetailUser(id, auth)
      .then((res) => {
        const datas = res.data;
        if (datas != null) {
          setData(datas);
        } else {
          setIsNotFound(true);
        }
      })
      .catch((error) => {
        const target = error?.data?.target as string | undefined;
        if (target != null) {
          const reason = error.data.reason as string;
          if (reason === "not-found") {
            setIsNotFound(true);
          } else {
            loader.setIsError(true);
          }
        }
        loader.setIsError(true);
      })
      .finally(() => {
        progressContext.end();
        loader.setIsFetching(false);
      });
  }, [auth, id, isNotFound, loader, progressContext]);

  useEffect(() => {
    if (data == null && !loader.isError) {
      doLoadUser();
    }
  }, [data, doLoadUser, loader.isError]);

  if (typeof id !== "string" || isNotFound) {
    return <PageNotFound />;
  }

  return (
    <>
      {data && !loader.isError && !loader.isFetching && (
        <UserViewerContextProvider user={data}>
          <UserViewerData />
        </UserViewerContextProvider>
      )}
      {loader.isFetching && <UserViewerHolder />}
      {loader.isError && <UserViewerRetry onRetry={doLoadUser} />}
    </>
  );
}
