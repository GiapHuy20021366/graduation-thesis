import React, { useState } from "react";
import { Stack, StackProps } from "@mui/material";
import { useQueryDevice } from "../../hooks";
import ListEnd from "../common/viewer/data/ListEnd";
import { IFoodPostTagged } from "./HomeViewerContext";
import { FoodCategory } from "../../data";
import HomeFoodItem from "./HomeFoodItem";
import LazyLoad from "react-lazy-load";
import FoodViewerDialog from "../common/viewer/dialog/FoodViewerDialog";
import PlaceViewerDialog from "../common/viewer/dialog/PlaceViewerDialog";
import UserViewerDialog from "../common/viewer/dialog/UserViewerDialog";

type HomeContentProps = StackProps;

const sample: IFoodPostTagged = {
  _id: "65e464e35b41520a0eb2e1b1",
  active: true,
  categories: [FoodCategory.BEVERAGES],
  createdAt: new Date(),
  duration: new Date(),
  images: [
    "http://res.cloudinary.com/dalvsnhwg/image/upload/v1702987092/jjbixsc6hf1ojhltvlwb.jpg",
  ],
  isEdited: true,
  likeCount: 4,
  location: {
    name: "Địa điểm",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
  price: 0,
  quantity: 5,
  tags: ["AROUND", "REGISTED", "SUGGESTED"],
  title: "Thực phẩm sạch cho mọi nhà",
  updatedAt: new Date(),
  user: "6560def1a9bedeba29494e76",
  description: "123",
  place: "65c23fe0e1108a5e08d91acb",
};

const samples: IFoodPostTagged[] = [];
for (let i = 0; i < 100; ++i) {
  samples.push({
    ...sample,
  });
}

const HomeContent = React.forwardRef<HTMLDivElement, HomeContentProps>(
  (props, ref) => {
    const [openFood, setOpenFood] = useState<string | undefined>();
    const [openAuthor, setOpenAuthor] = useState<string | undefined>();
    const [openPlace, setOpenPlace] = useState<string | undefined>();

    const device = useQueryDevice();

    return (
      <Stack
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          mt: 2,
          gap: 1,
          position: "relative",
          ...(props.sx ?? {}),
        }}
      >
        {samples.map((sample, index) => {
          return (
            <LazyLoad key={index} height={"380px"}>
              <HomeFoodItem
                item={sample}
                onExpandFood={() => setOpenFood(sample._id)}
                onExpandAuthor={() => {
                  const author = sample.user;
                  if (typeof author === "object") {
                    setOpenAuthor(author._id);
                  } else {
                    setOpenAuthor(author);
                  }
                }}
                onExpandPlace={() => {
                  const place = sample.place;
                  if (typeof place === "object") {
                    setOpenPlace(place._id);
                  } else {
                    setOpenPlace(place);
                  }
                }}
              />
            </LazyLoad>
          );
        })}
        {openFood != null && (
          <FoodViewerDialog
            id={openFood}
            open={true}
            onClose={() => setOpenFood(undefined)}
            onCloseClick={() => setOpenFood(undefined)}
            fullScreen={device === "MOBILE"}
          />
        )}
        {openAuthor != null && (
          <UserViewerDialog
            id={openAuthor}
            open={true}
            onClose={() => setOpenAuthor(undefined)}
            onCloseClick={() => setOpenAuthor(undefined)}
            fullScreen={device === "MOBILE"}
          />
        )}
        {openPlace != null && (
          <PlaceViewerDialog
            id={openPlace}
            open={true}
            onClose={() => setOpenPlace(undefined)}
            onCloseClick={() => setOpenPlace(undefined)}
            fullScreen={device === "MOBILE"}
          />
        )}

        <ListEnd active={true} onRetry={() => {}} mt={3} />
      </Stack>
    );
  }
);

export default HomeContent;
