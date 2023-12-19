import { SearchOutlined, TuneOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IFoodSearchInfo } from "../../../data";
import FoodSearchItem from "./FoodSearchItem";
import { foodFetcher } from "../../../api";

export default function FoodSearchBody() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [openOptions, setOpenOptions] = useState<boolean>(true);
  const [result, setResult] = useState<IFoodSearchInfo[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFocus = () => {
    setOpenOptions(true);
  };
  const handleClick = () => {
    setOpenOptions(true);
  };
  const handleBlur = () => {
    setOpenOptions(false);
  };
  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setOpenOptions(false);
    foodFetcher.searchFood().then((result) => setResult(result.data ?? []));
    console.log(value);
  };
  const handleInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setOpenOptions(true);
    console.log(value);
  };
  return (
    <Box width="100%">
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Autocomplete
          freeSolo
          fullWidth
          options={["Option 1", "Option 2", "Option 3"]}
          open={openOptions}
          onChange={handleChange}
          onFocus={handleFocus}
          onClick={handleClick}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
          renderInput={(params) => (
            <TextField
              inputRef={inputRef}
              {...params}
              margin="normal"
              variant="outlined"
              placeholder="Search your food"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <TuneOutlined
                      sx={{
                        cursor: "pointer",
                        padding: "0 0.5em",
                        height: "auto",
                        width: "1.3em",
                      }}
                    />
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Stack>
      <Divider/>
      <Stack>
        {result.map((food, index) => {
          return <FoodSearchItem item={food} key={index} />;
        })}
      </Stack>
    </Box>
  );
}
