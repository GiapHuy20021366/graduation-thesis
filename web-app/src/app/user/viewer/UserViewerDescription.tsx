import React from "react";
import { Box, BoxProps, Button, Stack, Typography } from "@mui/material";
import { useAuthContext } from "../../../hooks";
import { IAccount, IUserExposedWithFollower } from "../../../data";
import { RichTextReadOnly } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate } from "react-router";

type UserViewerDescriptionProps = BoxProps & {
  data: IUserExposedWithFollower;
};

const isEditPermit = (
  data: IUserExposedWithFollower,
  account?: IAccount
): boolean => {
  if (account == null) return false;
  if (data._id !== account.id_) return false;
  return true;
};

const UserViewerDescription = React.forwardRef<
  HTMLDivElement,
  UserViewerDescriptionProps
>((props, ref) => {
  const { data, ...rest } = props;
  const authContext = useAuthContext();
  const account = authContext.account;

  const editable = isEditPermit(data, account);

  const navigate = useNavigate();

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
          <Typography>Người dùng chưa mô tả</Typography>
          {editable && (
            <Stack gap={1}>
              <Button
                onClick={() => navigate("/place/update", { state: data })}
              >
                Chỉnh sửa ngay
              </Button>
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

export default UserViewerDescription;
