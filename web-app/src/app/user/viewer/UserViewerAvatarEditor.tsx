import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { userFetcher } from "../../../api";
import {
  useAuthContext,
  useComponentLanguage,
  useLoader,
  useSaveImage,
  useToastContext,
  useUserViewerContext,
} from "../../../hooks";
import { BASE64 } from "../../../data";

type UserViewerAvatarEditorProps = DialogProps & {
  onCancel?: () => void;
  onSuccess?: (avatar?: string) => void;
};

const UserViewerAvatarEditor = React.forwardRef<
  HTMLDivElement,
  UserViewerAvatarEditorProps
>((props, ref) => {
  const { onCancel, onSuccess, ...rest } = props;
  const authContext = useAuthContext();
  const { auth } = authContext;
  const loader = useLoader();
  const viewerContext = useUserViewerContext();
  const {
    _id,
    avatar: viewerAvatar,
    setAvatar: setViewerAvatar,
    firstName,
  } = viewerContext;
  const [avatar, setAvatar] = useState<string | undefined>();
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const saveImage = useSaveImage();
  const toast = useToastContext();
  const lang = useComponentLanguage();

  const dirtyRef = useRef<boolean>(false);

  useEffect(() => {
    if (props.open) {
      if (dirtyRef.current === true) {
        return;
      } else {
        setAvatar(viewerAvatar);
        setTimeout(() => {
          const input = inputAvatarRef.current;
          if (input) {
            input.click();
            dirtyRef.current = true;
          }
        }, 0);
      }
    } else {
      dirtyRef.current = false;
    }
  }, [props.open, viewerAvatar]);

  const handleOnClickOk = () => {
    if (avatar === viewerAvatar) {
      onSuccess && onSuccess(avatar);
      return;
    }
    if (auth == null) return;

    loader.setIsError(false);
    loader.setIsFetching(true);

    userFetcher
      .updatePersonalData(
        _id,
        {
          updated: {
            avatar: avatar ? avatar : undefined,
          },
          deleted: {
            avatar: avatar ? undefined : true,
          },
        },
        auth
      )
      .then(() => {
        onSuccess && onSuccess(avatar);
        setViewerAvatar(avatar);
      })
      .catch(() => {
        loader.setIsError(true);
      })
      .finally(() => {
        loader.setIsFetching(false);
      });
  };

  const handleOnClickCancel = () => {
    onCancel && onCancel();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (auth == null) return;

    const files = event.target.files;
    if (files == null) return;
    const file = files[0];
    if (file == null) return;

    BASE64.from(file, (result) => {
      if (typeof result !== "string") return;

      saveImage.doSave(
        result,
        {
          onSuccess: (image) => {
            setAvatar(image.url);
          },
          onError: () => {
            toast.error(lang("can-not-upload-image-now"));
          },
        },
        auth
      );
    });
  };

  const handleAvatarClick = () => {
    inputAvatarRef.current?.click();
  };

  return (
    <Dialog ref={ref} {...rest}>
      <DialogTitle>Chỉnh sửa</DialogTitle>

      <DialogContent>
        <input
          type="file"
          ref={inputAvatarRef}
          hidden
          accept="image/*"
          onChange={handleAvatarChange}
        />
        <Stack
          gap={1}
          flex={1}
          sx={{
            width: ["100vw", "60vw", "50vw", "40vw"],
          }}
          alignItems={"center"}
        >
          <Avatar
            sx={{
              width: [90, 100, 110, 120],
              height: [90, 100, 110, 120],
              boxShadow: 5,
              cursor: "pointer",
            }}
            src={avatar}
            onClick={handleAvatarClick}
          >
            {firstName.charAt(0)}
          </Avatar>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleOnClickCancel}
          disabled={loader.isFetching}
        >
          {lang("cancel")}
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={handleOnClickOk}
          disabled={loader.isFetching}
        >
          {lang("agree")}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserViewerAvatarEditor;
