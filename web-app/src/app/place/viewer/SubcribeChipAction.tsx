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
  IAccountExposed,
  IPlaceExposedWithRatingAndFollow,
  IFoodPostExposedUser,
} from "../../../data";
import {
  useAuthContext,
  useComponentLanguage,
  useToastContext,
} from "../../../hooks";
import { DoneOutlined } from "@mui/icons-material";
import { userFetcher } from "../../../api";

type SubcribeChipActionProps = ChipProps & {
  data: IPlaceExposedWithRatingAndFollow;
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
  place: IPlaceExposedWithRatingAndFollow,
  account?: IAccountExposed
): boolean => {
  if (account == null) return false;
  if (place.userFollow == null) return false;
  if (place.userFollow.subcriber !== account._id) return false;
  return true;
};

const toUserId = (value: string | IFoodPostExposedUser): string => {
  return typeof value === "string" ? value : value._id;
};

const isPermitSubcribe = (
  place: IPlaceExposedWithRatingAndFollow,
  account?: IAccountExposed
): boolean => {
  if (account == null) return false;
  const authorId = toUserId(place.author);
  if (authorId === account._id) {
    return false;
  }
  if (place.userFollow != null) {
    return (
      place.userFollow.subcriber === account._id &&
      place.userFollow.type !== FollowType.ADMIN
    );
  }
  return true;
};

const toSubcribed = (data: IPlaceExposedWithRatingAndFollow): boolean => {
  const follow = data.userFollow;
  if (follow == null) return false;
  return true;
};

const SubcribeChipAction = React.forwardRef<
  HTMLDivElement,
  SubcribeChipActionProps
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
  const lang = useComponentLanguage();

  const canSubcribe = isPermitSubcribe(data, account);

  useEffect(() => {
    if (subcribed == null) {
      if (account != null) {
        setSubcribed(isSubcribed(data, account));
      }
    }
  }, [account, data, subcribed]);

  const followPlace = () => {
    if (auth == null) return;
    userFetcher
      .followPlace(data._id, FollowType.SUBCRIBER, auth)
      .then(() => {
        setSubcribed(true);
        onFollowed && onFollowed();
      })
      .catch(() => {
        toastContext.error(lang("cannot-subcribe-place-now"));
      });
  };

  const unfollowPlace = () => {
    if (auth == null) return;
    userFetcher
      .unFollowPlace(data._id, auth)
      .then(() => {
        setSubcribed(false);
        onUnFollowed && onUnFollowed();
      })
      .catch(() => {
        toastContext.error(lang("cannot-unsubcribe-place-now"));
      });
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
        label={subcribed ? lang("subcribed") : lang("subcribe")}
        color={subcribed ? "info" : "default"}
        {...rest}
        sx={{
          ...(props.sx ?? {}),
          cursor: canSubcribe ? "pointer" : "unset",
        }}
        onClick={handleChipClick}
      />
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>{lang("confirm-unsubcribed")}</DialogTitle>
        <DialogActions>
          <Button variant="contained">{lang("not-agree")}</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenConfirm(false);
              unfollowPlace();
            }}
          >
            {lang("agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default SubcribeChipAction;
