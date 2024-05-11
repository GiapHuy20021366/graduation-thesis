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
import {
  FollowRole,
  FollowType,
  IFollowerSearchParams,
  IPlaceExposed,
  IPlaceFollowerExposed,
} from "../../../data";
import {
  useAuthContext,
  useComponentLanguage,
  useFoodSharingFormContext,
  useLoader,
} from "../../../hooks";
import { userFetcher } from "../../../api";

type FoodPlacePickerProps = StackProps & {
  disabled?: boolean;
};

const PERSONAL_PAGE = "PERSONAL_PAGE";

const FoodPlacePicker = React.forwardRef<HTMLDivElement, FoodPlacePickerProps>(
  (props, ref) => {
    const { disabled, ...rest } = props;
    const [places, setPlaces] = useState<IPlaceExposed[]>([]);
    const sharingContext = useFoodSharingFormContext();
    const { place, setPlace } = sharingContext;

    const authContext = useAuthContext();
    const { auth, account } = authContext;
    const loader = useLoader();
    const dirtyRef = useRef<boolean>(true);
    const lang = useComponentLanguage();

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
      const params: IFollowerSearchParams = {
        pagination: {
          skip: 0,
          limit: Number.MAX_SAFE_INTEGER,
        },
        type: [FollowType.ADMIN, FollowType.SUB_ADMIN],
        role: [FollowRole.PLACE],
        populate: {
          place: true,
        },
      };
      userFetcher
        .getUsersAndPlacesFollowed(account._id, params, auth)
        .then((res) => {
          const data = res.data;
          if (data != null) {
            const places = data
              .filter((d) => d.role === FollowRole.PLACE)
              .map((d): IPlaceExposed => {
                const place = (d as IPlaceFollowerExposed).place;
                return place as IPlaceExposed;
              });
            setPlaces(places);
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
        <Box component="h4">{lang("post-on")}</Box>
        <Typography>{lang("want-share-on")}</Typography>
        <Divider />
        <Select
          label={lang("l-place")}
          variant="standard"
          disableUnderline={true}
          displayEmpty={true}
          value={place ?? PERSONAL_PAGE}
          onChange={onPlaceChanged}
          sx={{
            flex: 1,
            mt: 1,
          }}
          disabled={disabled}
        >
          <MenuItem value={PERSONAL_PAGE}>
            {lang("your-personal-page")}
          </MenuItem>
          {places.map((place) => {
            return (
              <MenuItem value={place._id} key={place._id}>
                {place.exposedName}
              </MenuItem>
            );
          })}
        </Select>
      </Stack>
    );
  }
);

export default FoodPlacePicker;
