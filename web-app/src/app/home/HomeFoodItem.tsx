import React from "react";
import { CardProps } from "@mui/material";
import { IFoodPostTagged } from "./HomeViewerContext";
import HomeFoodItemData from "./HomeFoodItemData";
import { useFoodPostViewerIdHigherContext } from "../../hooks";
import FoodPostViewerHolder from "../food/post/FoodPostViewerHolder";
import FoodPostViewerContextProvider from "../food/post/FoodPostViewerContext";
import NoAccess from "../common/NoAccess";
import PageNotFound from "../common/PageNotFound";
import FoodPostViewerIdHigherContextProvider from "../food/post/FoodPostViewerIdHigherContext";

type IHomeFoodItemProps = CardProps & {
  onExpandFood?: () => void;
  onExpandAuthor?: () => void;
  onExpandPlace?: () => void;
  item: IFoodPostTagged;
};

interface IHomeFoodItemDataProvider extends IHomeFoodItemProps {
  ref: React.ForwardedRef<HTMLDivElement>;
}

function HomeFoodItemDataProvider(props: IHomeFoodItemDataProvider) {
  const context = useFoodPostViewerIdHigherContext();
  const { found, accessable, isLoading, data } = context;

  return (
    <>
      {isLoading && <FoodPostViewerHolder />}
      {data && accessable && (
        <FoodPostViewerContextProvider foodPost={data}>
          <HomeFoodItemData {...props} />
        </FoodPostViewerContextProvider>
      )}
      {data && !accessable && <NoAccess />}
      {!found && <PageNotFound />}
    </>
  );
}

const HomeFoodItem = React.forwardRef<HTMLDivElement, IHomeFoodItemProps>(
  (props, ref) => {
    return (
      <FoodPostViewerIdHigherContextProvider id={props.item._id}>
        <HomeFoodItemDataProvider {...props} ref={ref} />
      </FoodPostViewerIdHigherContextProvider>
    );
  }
);

export default HomeFoodItem;
