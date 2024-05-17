import React from "react";
import { CardProps } from "@mui/material";
import FoodPostViewerIdHigherContextProvider from "../post/FoodPostViewerIdHigherContext";
import { useFoodPostViewerIdHigherContext } from "../../../hooks";
import FoodPostViewerContextProvider from "../post/FoodPostViewerContext";
import PageNotFound from "../../common/PageNotFound";
import HomeFoodItemData from "../../home/HomeFoodItemData";
import NoAccess from "../../common/NoAccess";

type IViewItemProps = CardProps & {
  onExpandFood?: (id: string) => void;
  onExpandAuthor?: (id: string) => void;
  onExpandPlace?: (id: string) => void;
  foodId: string;
};

interface IHomeFoodItemDataProvider extends IViewItemProps {
  ref: React.ForwardedRef<HTMLDivElement>;
  foodId: string;
}

function HomeFoodItemDataProvider(props: IHomeFoodItemDataProvider) {
  const context = useFoodPostViewerIdHigherContext();
  const { found, accessable, isLoading, data } = context;

  return (
    <>
      {accessable && data != null && (
        <FoodPostViewerContextProvider foodPost={data}>
          <HomeFoodItemData
            isLoading={isLoading}
            item={{ ...data, tags: [] }}
            onExpandAuthor={props.onExpandAuthor}
            onExpandFood={props.onExpandFood}
            onExpandPlace={props.onExpandPlace}
          />
        </FoodPostViewerContextProvider>
      )}
      {data && !accessable && <NoAccess />}
      {!found && <PageNotFound />}
    </>
  );
}

const ViewItem = React.forwardRef<HTMLDivElement, IViewItemProps>(
  (props, ref) => {
    return (
      <FoodPostViewerIdHigherContextProvider id={props.foodId}>
        <HomeFoodItemDataProvider {...props} ref={ref} />
      </FoodPostViewerIdHigherContextProvider>
    );
  }
);

export default ViewItem;
