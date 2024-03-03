import PageNotFound from "../../common/PageNotFound";
import { useParams } from "react-router";
import { useAuthContext, useLoading } from "../../../hooks";
import { useEffect, useState } from "react";
import { foodFetcher } from "../../../api";
import FoodPostInfoDataDisplay from "./FoodPostInfoDataDisplay";
import FoodPostInfoReplacer from "./FoodPostInfoReplacer";
import { IFoodPostExposedWithLike } from "../../../data";

interface IFoodPostInfoProps {
  foodId?: string;
}

export default function FoodPostInfo({ foodId }: IFoodPostInfoProps) {
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
    const foodPostId = foodId ?? params.id;
    if (foodPostId != null) {
      fetchingFood(foodPostId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {params.id == null || (params.id === "" && <PageNotFound />)}
      {loading.isActice && <FoodPostInfoReplacer />}
      {data && <FoodPostInfoDataDisplay data={data} />}
      {!found && <PageNotFound />}
    </>
  );
}
