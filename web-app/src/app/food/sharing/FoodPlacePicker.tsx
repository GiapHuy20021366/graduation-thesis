import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { FollowType, IPlaceExposed } from "../../../data";
import {
  useAuthContext,
  useFoodSharingFormContext,
  useLoader,
} from "../../../hooks";
import { userFetcher } from "../../../api";

type FoodPlacePickerProps = StackProps;

const PERSONAL_PAGE = "PERSONAL_PAGE";

const FoodPlacePicker = React.forwardRef<HTMLDivElement, FoodPlacePickerProps>(
  (props, ref) => {
    const { ...rest } = props;
    const [places, setPlaces] = useState<IPlaceExposed[]>([]);
    const sharingContext = useFoodSharingFormContext();
    const { place, setPlace } = sharingContext;

    const authContext = useAuthContext();
    const { auth, account } = authContext;
    const loader = useLoader();
    const dirtyRef = useRef<boolean>(true);

    const onPlaceChanged = (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      if (value == "PERSONAL_PAGE") {
        setPlace(undefined);
      } else {
        setPlace(value);
      }
    };

    useEffect(() => {
      if (auth == null || account == null) return;
      if (loader.isFetching || !dirtyRef.current) return;
      dirtyRef.current = false;

      loader.setIsFetching(true);
      userFetcher
        .getPlacesByFollow(
          account.id_,
          {
            pagination: {
              skip: 0,
              limit: Number.MAX_SAFE_INTEGER,
            },
            followTypes: [FollowType.ADMIN, FollowType.SUB_ADMIN],
          },
          auth
        )
        .then((res) => {
          const data = res.data;
          if (data != null) {
            setPlaces(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          loader.setIsFetching(false);
        });
    }, [account, auth, loader, loader.isFetching]);

    return (
      <Stack
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          border: "1px solid #bdbdbd",
          borderRadius: "4px",
          padding: "8px",
          boxSizing: "border-box",
          gap: 1,
          ...(props.sx ?? {}),
        }}
      >
        <Box component="h4">Đăng trên</Box>
        <Typography>Bạn muốn chia sẻ thực phẩm này trên</Typography>
        <Divider />
        <Select
          label={"Địa điểm"}
          variant="standard"
          disableUnderline={true}
          displayEmpty={true}
          value={place ?? PERSONAL_PAGE}
          onChange={onPlaceChanged}
          sx={{
            flex: 1,
            mt: 1
          }}
        >
          <MenuItem value={PERSONAL_PAGE}>Trang cá nhân của bạn</MenuItem>
          {places.map((place) => {
            return (
              <MenuItem value={place._id} key={place._id}>
                {place.exposeName}
              </MenuItem>
            );
          })}
        </Select>
      </Stack>
    );
  }
);

export default FoodPlacePicker;
