import { useCallback, useEffect, useState } from "react";
import {
  FollowRole,
  IAccountExposed,
  IPlaceExposedWithRatingAndFollow,
} from "../../../data";
import PlaceViewerHolder from "./PlaceViewerHolder";
import PlaceViewerRetry from "./PlaceViewerRetry";
import {
  useAuthContext,
  useLoader,
  usePageProgessContext,
} from "../../../hooks";
import PageNotFound from "../../common/PageNotFound";
import { userFetcher } from "../../../api";
import PlaceViewerData from "./PlaceViewerData";
import NoAccess from "../../common/NoAccess";

interface PlaceViewerProps {
  id?: string;
}

const isAccessable = (
  data?: IPlaceExposedWithRatingAndFollow,
  account?: IAccountExposed
) => {
  if (account == null || data == null) return false;
  if (data.active) return true;
  const follow = data.userFollow;
  if (follow == null) return false;
  return follow.role === FollowRole.PLACE && follow.subcriber === account._id;
};

export default function PlaceViewerId({ id }: PlaceViewerProps) {
  const [data, setData] = useState<IPlaceExposedWithRatingAndFollow>();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const authContext = useAuthContext();
  const { auth, account } = authContext;

  const progressContext = usePageProgessContext();
  const loader = useLoader();

  const doLoadPlace = useCallback(() => {
    if (loader.isFetching || isNotFound) return;
    if (auth == null) return;
    if (id == null) return;

    loader.setIsError(false);
    loader.setIsFetching(true);

    progressContext.start();
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
      doLoadPlace();
    }
  }, [data, doLoadPlace, loader.isError]);

  if (typeof id !== "string" || id.length !== 24 || isNotFound) {
    return <PageNotFound />;
  }

  const accessable = isAccessable(data, account);

  if (data && !accessable) {
    return <NoAccess />;
  }

  return (
    <>
      {data && accessable && <PlaceViewerData data={data} />}
      {loader.isFetching && <PlaceViewerHolder />}
      {loader.isError && <PlaceViewerRetry onRetry={doLoadPlace} />}
    </>
  );
}
