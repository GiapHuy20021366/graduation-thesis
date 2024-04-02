import PageNotFound from "../../common/PageNotFound";
import { useParams } from "react-router";
import { useAuthContext, useLoading } from "../../../hooks";
import { useEffect, useState } from "react";
import { foodFetcher } from "../../../api";
import FoodPostViewerData from "./FoodPostViewerData";
import FoodPostViewerHolder from "./FoodPostViewerHolder";
import { IFoodPostExposedWithLike } from "../../../data";

interface IFoodPostInfoProps {
  id?: string;
}

export default function FoodPostViewerId({ id }: IFoodPostInfoProps) {
  const params = useParams();
  const authContext = useAuthContext();
  const loading = useLoading();
  const [data, setData] = useState<IFoodPostExposedWithLike>();
  const [found, setFound] = useState<boolean>(true);

  const fetchingFood = (id: string) => {
    const auth = authContext.auth;
    if (auth != null) {
      loading.active();
      foodFetcher
        .findFoodPost(id, auth)
        .then((data) => {
          setFound(true);
          setData(data.data);
        })
        .catch((err) => {
          setFound(false);
          console.log(err);
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

  return (
    <>
      {params.id == null || (params.id === "" && <PageNotFound />)}
      {loading.isActice && <FoodPostViewerHolder />}
      {data && <FoodPostViewerData data={data} />}
      {!found && <PageNotFound />}
    </>
  );
}
