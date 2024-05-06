import React from "react";
import { CardProps } from "@mui/material";
import { IFoodPostTagged } from "./HomeViewerContext";
import HomeFoodItemData from "./HomeFoodItemData";
import { useFoodPostViewerIdHigherContext } from "../../hooks";
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
  item: IFoodPostTagged;
}

function HomeFoodItemDataProvider(props: IHomeFoodItemDataProvider) {
  const context = useFoodPostViewerIdHigherContext();
  const { found, accessable, isLoading, data } = context;

  return (
    <>
      {accessable && (
        <FoodPostViewerContextProvider
          foodPost={found && data != null ? data : props.item}
        >
          <HomeFoodItemData {...props} isLoading={isLoading} />
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
