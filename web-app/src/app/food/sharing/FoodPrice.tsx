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

export default function FoodPrice() {
  const formContext = useFoodSharingFormContext();
  const { price, setPrice } = formContext;
  const languageContext = useI18nContext();
  const lang = languageContext.of(FoodPrice);

  const selectRef = useRef<HTMLSelectElement>(null);

  const [custom, setCustom] = useState<boolean>(false);

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
    setCustom(value === -1);
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
      <Box component="h4">Price</Box>
      <Typography>
        Help every body known the price of your sharing food!
      </Typography>
      <Divider />
      <Stack direction="row" alignItems="center" gap={1} mt={1}>
        <Select
          label={lang("l-cost")}
          variant="standard"
          disableUnderline={true}
          displayEmpty={true}
          defaultValue={String(price)}
          onChange={onSelectPriceChange}
          sx={{
            flex: 1,
          }}
          ref={selectRef}
        >
          <MenuItem value={0}>FREE</MenuItem>
          <MenuItem value={9999}>{lang("9 999 VNĐ")}</MenuItem>
          <MenuItem value={29999}>{lang("29 999 VNĐ")}</MenuItem>
          <MenuItem value={49999}>{lang("49 999 VNĐ")}</MenuItem>
          <MenuItem value={99999}>{lang("99 999 VNĐ")}</MenuItem>
          <MenuItem value={199999}>{lang("199 999 VNĐ")}</MenuItem>
          <MenuItem value={-1}>{lang("CUSTOM")}</MenuItem>
        </Select>
        <TextField
          type="number"
          variant="standard"
          value={price}
          onChange={onPriceChange}
          fullWidth
          sx={{
            display: custom ? "block" : "none",
            flex: 1,
          }}
          InputProps={{
            endAdornment: <Box>VNĐ</Box>,
          }}
        />
      </Stack>
    </Stack>
  );
}
