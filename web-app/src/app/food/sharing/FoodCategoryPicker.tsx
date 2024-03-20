import {
  Autocomplete,
  Box,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CategoryPiece from "./CategoryPiece";
import { FoodCategory } from "../../../data";
import { useI18nContext } from "../../../hooks";

export interface IFoodCategoryPicker {
  categories: FoodCategory[];
  onPicked?: (category: FoodCategory) => void;
  onRemoved?: (index: number) => void;
}

export default function FoodCategoryPicker({
  categories,
  onPicked,
  onRemoved,
}: IFoodCategoryPicker) {
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(FoodCategoryPicker, "Categories");
  const options = Object.values(FoodCategory);
  const [categoryValue, setCategoryValue] = useState<string>(
    lang(FoodCategory.EMPTY)
  );
  const [inputCategory, setInputCategory] = useState<string>(
    FoodCategory.EMPTY
  );

  const handleCategoryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: FoodCategory | null
  ) => {
    if (value != null && value !== FoodCategory.EMPTY) {
      onPicked && onPicked(value);
    }
    setInputCategory("");
    setCategoryValue(lang(FoodCategory.EMPTY));
  };

  return (
    <Box
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box component="h4">{lang("category")}</Box>
      <Typography>{lang("category-body")}</Typography>
      <Divider />
      <Box padding={"1rem 0"}>
        {categories.map((category, index) => {
          return (
            <CategoryPiece
              text={lang(category)}
              onRemove={() => onRemoved && onRemoved(index)}
              key={index}
            />
          );
        })}
      </Box>
      <Autocomplete
        options={options}
        value={categoryValue}
        onChange={(event, value) => handleCategoryChange(event, value)}
        openOnFocus={true}
        inputValue={inputCategory}
        onInputChange={(_event, value) => setInputCategory(value)}
        filterOptions={(options, state) => {
          state.inputValue;
          return options.filter(
            (option) =>
              lang(option).indexOf(inputCategory) >= 0 &&
              option !== FoodCategory.EMPTY
          );
        }}
        getOptionLabel={(option) => lang(option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={lang("l-search")}
            placeholder={lang("search-placeholder")}
            variant="standard"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
      />
    </Box>
  );
}
