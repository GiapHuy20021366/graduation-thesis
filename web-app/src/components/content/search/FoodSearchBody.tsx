import { SearchOutlined, TuneOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IFoodSearchInfo } from "../../../data";
import FoodSearchItem from "./FoodSearchItem";
import { foodFetcher } from "../../../api";
import FoodSearchFilter from "./FoodSearchCondition";

export default function FoodSearchBody() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [openOptions, setOpenOptions] = useState<boolean>(true);
  const [result, setResult] = useState<IFoodSearchInfo[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

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
    <Stack height="100%" width="100%" direction="column">
      <Stack
        direction="row"
        sx={{ alignItems: "center", position: "relative" }}
      >
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
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <TuneOutlined
          sx={{
            cursor: "pointer",
            padding: "0 0.5em",
            height: "auto",
            width: "1.3em",
            position: "absolute",
            right: 0,
          }}
          onClick={() => setOpenFilter(true)}
        />
      </Stack>
      <Divider />
      <FoodSearchFilter
        isActive={openFilter}
        onClose={() => setOpenFilter(false)}
      />
      <Stack
        flex={1}
        sx={{
          overflowY: "auto",
        }}
      >
        {result.map((food, index) => {
          return <FoodSearchItem item={food} key={index} />;
        })}
      </Stack>
    </Stack>
  );
}
