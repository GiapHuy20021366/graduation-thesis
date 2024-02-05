import { useEffect, useState } from "react";
import { IPlaceExposed } from "../../../data";
import PlaceViewerHolder from "./PlaceViewerHolder";
import PlaceViewerRetry from "./PlaceViewerRetry";
import { useAuthContext, usePageProgessContext } from "../../../hooks";
import PageNotFound from "../../common/PageNotFound";
import { userFetcher } from "../../../api";
import PlaceViewerData from "./PlaceViewerData";

interface PlaceViewerProps {
  id?: string;
}

export default function PlaceViewer({ id }: PlaceViewerProps) {
  const [data, setData] = useState<IPlaceExposed>();
  const [isError, setIsError] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const authContext = useAuthContext();
  const auth = authContext.auth;

  const progressContext = usePageProgessContext();

  const fetchPlace = () => {
    if (auth == null) return;
    if (id == null) return;
    progressContext.start();
    setIsError(false);
    userFetcher
      .getPlace(id, auth)
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
            setIsError(true);
          }
        }
        setIsError(true);
      })
      .finally(() => {
        progressContext.end();
      });
  };

  useEffect(() => {
    if (data == null && !progressContext.isLoading) {
      fetchPlace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (typeof id !== "string" || id.length !== 24 || isNotFound) {
    return <PageNotFound />;
  }

  return (
    <>
      {data && <PlaceViewerData data={data} />}
      {data == null && !isError && <PlaceViewerHolder />}
      {isError && <PlaceViewerRetry />}
    </>
  );
}
