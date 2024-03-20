import {
  Box,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFoodSharingFormContext, useI18nContext } from "../../../hooks";
import { useRef, useState } from "react";

const priceOptions = {
  OTHER: -1,
  FREE: 0,
  TEN_THOUSANDS: 9999,
  THIRTY_THOUSANDS: 29999,
  FIFTY_THOUSANDS: 49999,
  ONE_HUNDRED: 99999,
  TWO_HUNDREDS: 199999,
} as const;

type PriceOption = (typeof priceOptions)[keyof typeof priceOptions];

export default function FoodPrice() {
  const formContext = useFoodSharingFormContext();
  const { price, setPrice } = formContext;
  const languageContext = useI18nContext();
  const lang = languageContext.of(FoodPrice);
  const [priceOption, setPriceOption] = useState<PriceOption>(
    Object.values(priceOptions).includes(price as PriceOption)
      ? (price as PriceOption)
      : priceOptions.OTHER
  );

  const selectRef = useRef<HTMLSelectElement>(null);

  const onPriceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newPrice = +event.target.value;
    if (isNaN(newPrice)) {
      return;
    }
    const rounded = Math.round(newPrice);

    if (rounded >= 0) {
      if (rounded === 0) {
        const select = selectRef.current;
        if (select != null) {
          select.value = "0";
        }
      }
      setPrice(rounded);
    }
  };

  const onSelectPriceChange = (event: SelectChangeEvent): void => {
    const value = +event.target.value;
    if (Object.values(priceOptions).includes(value as PriceOption)) {
      setPriceOption(value as PriceOption);
    } else {
      setPriceOption(priceOptions.OTHER);
    }
    value >= 0 && setPrice(value);
  };

  return (
    <Stack
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box component="h4">{lang("price")}</Box>
      <Typography>{lang("price-description")}</Typography>
      <Divider />
      <Stack direction="row" alignItems="center" gap={1} mt={1}>
        <Select
          label={lang("l-price")}
          variant="standard"
          disableUnderline={true}
          displayEmpty={true}
          value={String(priceOption)}
          onChange={onSelectPriceChange}
          sx={{
            flex: 1,
          }}
          ref={selectRef}
        >
          <MenuItem value={priceOptions.FREE}>{lang("FREE")}</MenuItem>
          <MenuItem value={priceOptions.TEN_THOUSANDS}>
            {lang("9 999 VNĐ")}
          </MenuItem>
          <MenuItem value={priceOptions.THIRTY_THOUSANDS}>
            {lang("29 999 VNĐ")}
          </MenuItem>
          <MenuItem value={priceOptions.FIFTY_THOUSANDS}>
            {lang("49 999 VNĐ")}
          </MenuItem>
          <MenuItem value={priceOptions.ONE_HUNDRED}>
            {lang("99 999 VNĐ")}
          </MenuItem>
          <MenuItem value={priceOptions.TWO_HUNDREDS}>
            {lang("199 999 VNĐ")}
          </MenuItem>
          <MenuItem value={-1}>{lang("CUSTOM")}</MenuItem>
        </Select>
        <TextField
          type="number"
          variant="standard"
          value={price}
          onChange={onPriceChange}
          fullWidth
          sx={{
            display: priceOption === priceOptions.OTHER ? "block" : "none",
            flex: 1,
          }}
          InputProps={{
            endAdornment: <Box>VNĐ</Box>,
          }}
          inputProps={{
            min: 0,
            step: 1000,
          }}
        />
      </Stack>
    </Stack>
  );
}
