import PageNotFound from "../../common/PageNotFound";
import { useParams } from "react-router";
import { useAuthContext, useLoading } from "../../../hooks";
import { useEffect, useState } from "react";
import { foodFetcher } from "../../../api";
import FoodPostViewerData from "./FoodPostViewerData";
import FoodPostViewerHolder from "./FoodPostViewerHolder";
import { IFoodPostExposed, IFoodPostExposedWithLike } from "../../../data";
import FoodPostViewerContextProvider from "./FoodPostViewerContext";
import NoAccess from "../../common/NoAccess";

interface IFoodPostInfoProps {
  id?: string;
}

const toUserId = (food: IFoodPostExposed): string => {
  const user = food.user;
  return typeof user === "string" ? user : user._id;
};

export default function FoodPostViewerId({ id }: IFoodPostInfoProps) {
  const params = useParams();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const loading = useLoading();
  const [data, setData] = useState<IFoodPostExposedWithLike>();
  const [found, setFound] = useState<boolean>(true);

  const fetchingFood = (id: string) => {
    if (auth != null) {
      loading.active();
      foodFetcher
        .getFoodPost(id, auth)
        .then((data) => {
          setFound(true);
          setData(data.data);
        })
        .catch(() => {
          setFound(false);
        })
        .finally(() => {
          loading.deactive();
        });
    }
  };

  useEffect(() => {
    const foodPostId = id ?? params.id;
    if (foodPostId != null) {
      fetchingFood(foodPostId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accessable = data && (data.active || toUserId(data) === account?._id);

  return (
    <>
      {params.id == null || (params.id === "" && <PageNotFound />)}
      {loading.isActice && <FoodPostViewerHolder />}
      {data && accessable && (
        <FoodPostViewerContextProvider foodPost={data}>
          <FoodPostViewerData />
        </FoodPostViewerContextProvider>
      )}
      {data && !accessable && <NoAccess />}
      {!found && <PageNotFound />}
    </>
  );
}
