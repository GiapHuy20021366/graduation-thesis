import {
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
  useLoader,
  useToastContext,
  useUserViewerContext,
} from "../../../hooks";
import StarterKitEditor from "../../common/custom/StarterKitEditor";
import { RichTextEditorRef } from "mui-tiptap";

type UserViewerDescriptionEditorProps = DialogProps & {
  onCancel: () => void;
  onSuccess: (description?: string) => void;
};

const UserViewerDescriptionEditor = React.forwardRef<
  HTMLDivElement,
  UserViewerDescriptionEditorProps
>((props, ref) => {
  const { onCancel, onSuccess, ...rest } = props;
  const authContext = useAuthContext();
  const { auth } = authContext;
  const loader = useLoader();
  const viewerContext = useUserViewerContext();
  const {
    _id,
    description: viewerDescription,
    setDescription: setViewerDescription,
  } = viewerContext;
  const [description, setDescription] = useState<string | undefined>();
  const editorRef = useRef<RichTextEditorRef>(null);
  const toast = useToastContext();

  const dirtyRef = useRef<boolean>(false);

  useEffect(() => {
    if (props.open) {
      if (dirtyRef.current === true) {
        return;
      } else {
        setDescription(viewerDescription);
        const editor = editorRef.current?.editor;
        if (editor != null) {
          dirtyRef.current = true;
          editor.commands.setContent(description ?? "");
        }
      }
    } else {
      dirtyRef.current = false;
    }
  }, [props.open, viewerDescription, description]);

  const handleOnClickOk = () => {
    if (description === viewerDescription) {
      onSuccess && onSuccess(description);
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
            description: description ? description : undefined,
          },
          deleted: {
            description: description ? undefined : true,
          },
        },
        auth
      )
      .then(() => {
        onSuccess && onSuccess(description);
        setViewerDescription(description);
      })
      .catch(() => {
        loader.setIsError(true);
        toast.error("Không thể thực hiện hành động bây giờ");
      })
      .finally(() => {
        loader.setIsFetching(false);
      });
  };

  const handleOnClickCancel = () => {
    onCancel && onCancel();
  };
  return (
    <Dialog ref={ref} {...rest}>
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent>
        <Stack
          gap={1}
          flex={1}
          sx={{
            width: ["100vw", "60vw", "50vw", "40vw"],
          }}
        >
          <StarterKitEditor
            editorRef={editorRef}
            onUpdate={({ editor }) => setDescription(editor.getHTML())}
            content={description}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleOnClickCancel}
          disabled={loader.isFetching}
        >
          Hủy bỏ
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={handleOnClickOk}
          disabled={loader.isFetching}
        >
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserViewerDescriptionEditor;
