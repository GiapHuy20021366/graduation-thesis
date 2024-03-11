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
import {
  FollowType,
  IAccount,
  IUserExposedWithFollower,
} from "../../../data";
import { useAuthContext, useToastContext } from "../../../hooks";
import { DoneOutlined } from "@mui/icons-material";
import { userFetcher } from "../../../api";

type UserSubcribeChipActionProps = ChipProps & {
  data: IUserExposedWithFollower;
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
  user: IUserExposedWithFollower,
  account?: IAccount
): boolean => {
  if (account == null) return false;
  if (user._id === account.id_) return true;
  if (user.userFollow != null) {
    const followerId = user.userFollow.subcriber;
    if (followerId === account.id_) return true;
  }
  return false;
};

const isPermitSubcribe = (
  user: IUserExposedWithFollower,
  account?: IAccount
): boolean => {
  if (account == null) return false;
  if (account.id_ === user._id) {
    return false;
  }
  return true;
};

const toSubcribed = (data: IUserExposedWithFollower): boolean => {
  const follow = data.userFollow;
  if (follow == null) return false;
  return true;
};

const UserSubcribeChipAction = React.forwardRef<
  HTMLDivElement,
  UserSubcribeChipActionProps
>((props, ref) => {
  const {
    data,
    subcribedIcon,
    unSubcribedIcon,
    onFollowed,
    onUnFollowed,
    ...rest
  } = props;

  const [subcribed, setSubcribed] = useState<boolean>(toSubcribed(data));
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const authContext = useAuthContext();
  const { account, auth } = authContext;
  const toastContext = useToastContext();

  const canSubcribe = isPermitSubcribe(data, account);

  useEffect(() => {
    if (subcribed == null) {
      if (account != null) {
        setSubcribed(isSubcribed(data, account));
      }
    }
  }, [account, data, subcribed]);

  const followUser = () => {
    if (auth == null) return;
    userFetcher
      .followPlace(data._id, FollowType.SUBCRIBER, auth)
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
      .unFollowPlace(data._id, auth)
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
