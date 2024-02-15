import React, { useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { useI18nContext, usePlaceSearchContext } from "../../../hooks";
import { PlaceType } from "../../../data";
import ToggleChip from "../../common/custom/ToggleChip";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";

type PlaceSearchFilterProps = BoxProps & {
  openFilter: boolean;
  onCloseFilter: () => void;
  onApply?: (value: any) => void;
};

const PlaceSearchFilter = React.forwardRef<
  HTMLDivElement,
  PlaceSearchFilterProps
>((props, ref) => {
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(PlaceSearchFilter);

  const searchContext = usePlaceSearchContext();

  const { openFilter, onCloseFilter, onApply, ...rest } = props;

  const [types, setTypes] = useState<PlaceType[]>(searchContext.types ?? []);
  const [maxDistance, setMaxDistance] = useState<number>(
    searchContext.maxDistance ?? -1
  );

  const handleApply = () => {
    onApply && onApply({});
    onCloseFilter();
  };
  const handleReset = () => {};

  return (
    <Box ref={ref} {...rest}>
      <Drawer anchor="right" open={openFilter} onClose={onCloseFilter}>
        <Stack
          sx={{
            width: ["80vw", "50vw", "40vw", "30vw"],
            height: "100svh",
            padding: "4px",
            boxSizing: "border-box",
          }}
        >
          <Box
            component="h4"
            sx={{
              fontWeight: 600,
              fontSize: "1.3rem",
              textAlign: "center",
              marginBottom: "8px",
              position: "sticky",
              top: 0,
            }}
          >
            {lang("search-filter")}
          </Box>
          <Divider />
          <Stack flex={1} gap={2} p={1}>
            <Box width={"100%"}>
              <Typography sx={{ fontWeight: 600 }}>
                {lang("place-type")}:
              </Typography>
              <ToggleChipGroup
                value={types}
                onValueChange={(value) => setTypes(value)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  width: "100%",
                  overflowY: "auto",
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <ToggleChip
                  variant="outlined"
                  label={lang("l-personal")}
                  value={PlaceType.PERSONAL}
                />
                <ToggleChip
                  variant="outlined"
                  label={lang("l-volunteer")}
                  value={PlaceType.VOLUNTEER}
                />
                <ToggleChip
                  variant="outlined"
                  label={lang("l-eatery")}
                  value={PlaceType.EATERY}
                />
                <ToggleChip
                  variant="outlined"
                  label={lang("l-grocery")}
                  value={PlaceType.GROCERY}
                />
                <ToggleChip
                  variant="outlined"
                  label={lang("l-restaurant")}
                  value={PlaceType.RESTAURANT}
                />
                <ToggleChip
                  variant="outlined"
                  label={lang("l-supermarket")}
                  value={PlaceType.SUPERMARKET}
                />
              </ToggleChipGroup>
            </Box>
            <Divider variant="inset" />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                {lang("max-distance")}:
              </Typography>
              <ToggleChipGroup
                value={maxDistance}
                onValueChange={(value) => setMaxDistance(value)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  overflowY: "auto",
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                exclusive
              >
                <ToggleChip
                  variant="outlined"
                  label={lang("l-all")}
                  value={-1}
                />
                <ToggleChip variant="outlined" label={"0.5 km"} value={0.5} />
                <ToggleChip variant="outlined" label={"1 km"} value={1} />
                <ToggleChip variant="outlined" label={"2 km"} value={2} />
                <ToggleChip variant="outlined" label={"5 km"} value={5} />
                <ToggleChip variant="outlined" label={"10 km"} value={10} />
                <ToggleChip variant="outlined" label={"25 km"} value={25} />
                <ToggleChip variant="outlined" label={"50 km"} value={50} />
              </ToggleChipGroup>
            </Box>
          </Stack>
          <Divider />
          <Stack direction={"row"} gap={1} justifyContent={"center"} p={3}>
            <Button variant="outlined" sx={{ flex: 1 }} onClick={handleReset}>
              {lang("reset")}
            </Button>
            <Button variant="contained" sx={{ flex: 1 }} onClick={handleApply}>
              {lang("apply")}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
});

export default PlaceSearchFilter;
