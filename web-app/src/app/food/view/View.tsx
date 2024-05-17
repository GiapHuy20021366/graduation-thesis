import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useComponentLanguage, useQueryDevice } from "../../../hooks";
import FoodViewerDialog from "../../common/viewer/dialog/FoodViewerDialog";
import PlaceViewerDialog from "../../common/viewer/dialog/PlaceViewerDialog";
import UserViewerDialog from "../../common/viewer/dialog/UserViewerDialog";
import { Box, Divider, Stack } from "@mui/material";
import LazyLoad from "react-lazy-load";
import ViewItem from "./ViewItem";
import NoAccess from "../../common/NoAccess";

export default function View() {
  const location = useLocation();
  const foodIds = (location.state?.foodIds || []) as string[];
  const [openFood, setOpenFood] = useState<string | undefined>();
  const [openAuthor, setOpenAuthor] = useState<string | undefined>();
  const [openPlace, setOpenPlace] = useState<string | undefined>();
  const device = useQueryDevice();
  const lang = useComponentLanguage();

  return (
    <Stack
      sx={{
        width: "100%",
        mt: 2,
        gap: 1,
        position: "relative",
        pt: 2,
      }}
    >
      <Box component={"h2"} sx={{ fontWeight: 500, fontSize: "2rem" }}>
        {lang("food-view")}
      </Box>
      <Divider />

      {foodIds.map((id) => {
        return (
          <LazyLoad key={id} height={"380px"}>
            <ViewItem
              foodId={id}
              onExpandFood={() => setOpenFood(id)}
              onExpandAuthor={(authorId) => {
                setOpenAuthor(authorId);
              }}
              onExpandPlace={(placeId) => {
                setOpenPlace(placeId);
              }}
            />
          </LazyLoad>
        );
      })}

      {foodIds.length === 0 && <NoAccess />}

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
    </Stack>
  );
}
