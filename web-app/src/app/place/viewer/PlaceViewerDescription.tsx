import React from "react";
import { Box, BoxProps, Button, Stack, Typography } from "@mui/material";
import {
  applicationPages,
  useAuthContext,
  useComponentLanguage,
} from "../../../hooks";
import {
  FollowType,
  IAccountExposed,
  IPlaceExposedWithRatingAndFollow,
} from "../../../data";
import { RichTextReadOnly } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import StyledLink from "../../common/navigate/StyledLink";

type PlaceViewerDescriptionProps = BoxProps & {
  data: IPlaceExposedWithRatingAndFollow;
};

const isEditPermit = (
  data: IPlaceExposedWithRatingAndFollow,
  account?: IAccountExposed
): boolean => {
  if (account == null) return false;

  const follower = data.userFollow;
  if (follower == null) return false;

  if (
    follower.type !== FollowType.ADMIN ||
    follower.subcriber !== account._id
  ) {
    return false;
  }

  return true;
};

const PlaceViewerDescription = React.forwardRef<
  HTMLDivElement,
  PlaceViewerDescriptionProps
>((props, ref) => {
  const { data, ...rest } = props;
  const authContext = useAuthContext();
  const account = authContext.account;

  const editable = isEditPermit(data, account);
  const lang = useComponentLanguage();

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <h4>{lang("description")}</h4>
      {(data.description == null || data.description === "") && (
        <Stack alignItems={"center"} flex={1}>
          <Typography>{lang("place-no-description")}</Typography>
          {editable && (
            <Stack gap={1}>
              <StyledLink to={applicationPages.PLACE_UPDATE} state={data}>
                <Button>{lang("edit")}</Button>
              </StyledLink>
            </Stack>
          )}
        </Stack>
      )}
      {data.description && (
        <RichTextReadOnly
          extensions={[StarterKit]}
          spell-check={false}
          content={data.description}
        />
      )}
    </Box>
  );
});

export default PlaceViewerDescription;
