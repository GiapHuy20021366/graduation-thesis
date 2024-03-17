import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Chip,
  ChipProps,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { IAccountExposed, IUserExposedFollower } from "../../../data";
import {
  useAuthContext,
  useToastContext,
  useUserViewerContext,
} from "../../../hooks";
import { DoneOutlined } from "@mui/icons-material";
import { userFetcher } from "../../../api";

type UserSubcribeChipActionProps = ChipProps & {
  subcribedIcon?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | undefined;
  unSubcribedIcon?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | undefined;
  onFollowed?: () => void;
  onUnFollowed?: () => void;
};

const isSubcribed = (
  userId: string,
  userFollow?: IUserExposedFollower,
  account?: IAccountExposed
): boolean => {
  if (account == null) return false;
  if (userId === account._id) return true;
  if (userFollow != null) {
    const followerId = userFollow.subcriber;
    if (followerId === account._id) return true;
  }
  return false;
};

const isPermitSubcribe = (
  userId: string,
  account?: IAccountExposed
): boolean => {
  if (account == null) return false;
  if (account._id === userId) {
    return false;
  }
  return true;
};

const UserSubcribeChipAction = React.forwardRef<
  HTMLDivElement,
  UserSubcribeChipActionProps
>((props, ref) => {
  const { subcribedIcon, unSubcribedIcon, onFollowed, onUnFollowed, ...rest } =
    props;

  const viewerContext = useUserViewerContext();
  const { userFollow, _id } = viewerContext;

  const [subcribed, setSubcribed] = useState<boolean>(userFollow != null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const authContext = useAuthContext();
  const { account, auth } = authContext;
  const toastContext = useToastContext();

  const canSubcribe = isPermitSubcribe(_id, account);

  useEffect(() => {
    if (subcribed == null) {
      if (account != null) {
        setSubcribed(isSubcribed(_id, userFollow, account));
      }
    }
  }, [_id, account, subcribed, userFollow]);

  const followUser = () => {
    if (auth == null) return;
    userFetcher
      .followUser(_id, auth)
      .then(() => {
        setSubcribed(true);
        onFollowed && onFollowed();
      })
      .catch(() => {
        toastContext.error("Không thể theo dõi vào lúc này");
      });
  };

  const unfollowUser = () => {
    if (auth == null) return;
    userFetcher
      .unFollowUser(_id, auth)
      .then(() => {
        setSubcribed(false);
        onUnFollowed && onUnFollowed();
      })
      .catch(() => {
        toastContext.error("Không thể hủy theo dõi vào lúc này");
      });
  };

  const handleChipClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (canSubcribe) {
      if (subcribed) {
        setOpenConfirm(true);
      } else {
        followUser();
      }
    }

    props.onClick && props.onClick(event);
  };

  return (
    <>
      <Chip
        ref={ref}
        icon={subcribed ? subcribedIcon ?? <DoneOutlined /> : unSubcribedIcon}
        label={subcribed ? "Đã theo dõi" : "Theo dõi"}
        color={subcribed ? "info" : "default"}
        {...rest}
        sx={{
          ...(props.sx ?? {}),
          cursor: canSubcribe ? "pointer" : "unset",
        }}
        onClick={handleChipClick}
        disabled={!canSubcribe}
      />
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Bạn chắc chắn muốn hủy theo dõi trang này</DialogTitle>
        <DialogActions>
          <Button variant="contained">Không đồng ý</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenConfirm(false);
              unfollowUser();
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default UserSubcribeChipAction;
