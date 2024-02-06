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
import { FollowType, IAccount, IPlaceExposed } from "../../../data";
import { useAuthContext } from "../../../hooks";
import { DoneOutlined } from "@mui/icons-material";

type SubcribeChipActionProps = ChipProps & {
  data: IPlaceExposed;
  subcribedIcon?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | undefined;
  unSubcribedIcon?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | undefined;
};

const isSubcribed = (place: IPlaceExposed, account?: IAccount): boolean => {
  if (account == null) return false;
  if (place.userFollow == null) return false;
  if (place.userFollow.subcriber !== account.id_) return false;
  return true;
};

const isPermitSubcribe = (
  place: IPlaceExposed,
  account?: IAccount
): boolean => {
  if (account == null) return false;
  if (place.userFollow == null) return false;
  return (
    place.userFollow.subcriber === account.id_ &&
    place.userFollow.type !== FollowType.ADMIN
  );
};

const SubcribeChipAction = React.forwardRef<
  HTMLDivElement,
  SubcribeChipActionProps
>((props, ref) => {
  const { data, subcribedIcon, unSubcribedIcon, ...rest } = props;

  const [subcribed, setSubcribed] = useState<boolean>();
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const authContext = useAuthContext();
  const account = authContext.account;

  const canSubcribe = isPermitSubcribe(data, account);

  useEffect(() => {
    if (subcribed == null) {
      if (account != null) {
        setSubcribed(isSubcribed(data, account));
      }
    }
  }, [account, data, subcribed]);

  const followPlace = () => {
    console.log("Follow");
  };

  const unfollowPlace = () => {
    console.log("Unfollow");
  };

  const handleChipClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (canSubcribe) {
      if (subcribed) {
        setOpenConfirm(true);
      } else {
        followPlace();
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
              unfollowPlace();
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default SubcribeChipAction;
