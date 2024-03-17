import { Modal, ModalProps } from "@mui/material";
import React from "react";

type UserViewerAvatarEditorProps = ModalProps & {
};

const UserViewerAvatarEditor = React.forwardRef<HTMLDivElement, UserViewerAvatarEditorProps>((props, ref) => {
  const { ...rest } = props;
  return (
    <Modal
      ref={ref}
      {...rest}
    >
     
    </Modal>
  );
});

export default UserViewerAvatarEditor;
