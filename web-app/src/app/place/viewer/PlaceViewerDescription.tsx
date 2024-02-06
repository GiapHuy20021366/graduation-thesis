import React from "react";
import { Box, BoxProps, Button, Stack, Typography } from "@mui/material";
import { useAuthContext } from "../../../hooks";
import { FollowType, IAccount, IPlaceExposed } from "../../../data";
import { RichTextReadOnly } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";

type PlaceViewerDescriptionProps = BoxProps & {
  data: IPlaceExposed;
};

const isEditPermit = (data: IPlaceExposed, account?: IAccount): boolean => {
  if (account == null) return false;

  const follower = data.userFollow;
  if (follower == null) return false;

  if (
    follower.type !== FollowType.ADMIN ||
    follower.subcriber !== account.id_
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

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <h4>Mô tả</h4>
      {(data.description == null || data.description === "") && (
        <Stack alignItems={"center"} flex={1}>
          <Typography>Trang này hiện chưa được mô tả</Typography>
          {editable && (
            <Stack gap={1}>
              <Button>Chỉnh sửa ngay</Button>
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
