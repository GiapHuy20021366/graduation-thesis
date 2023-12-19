import { Autocomplete, Box, Divider, TextField } from "@mui/material";
import { useRef } from "react";
import CategoryPiece from "./CategoryPiece";
import { FoodCategory } from "../../../data";
import { I18Resolver, useI18nContext } from "../../../contexts";

export interface IFoodCategoryPicker {
  categories: FoodCategory[];
  onPicked?: (category: FoodCategory) => void;
  onRemoved?: (index: number) => void;
}

interface CategoryOption {
  key: FoodCategory;
  value: string;
}

const toCategoryOptions = (
  categories: FoodCategory[],
  lang: I18Resolver
): CategoryOption[] => {
  return categories.map((category) => ({
    key: category,
    value: lang(category),
  }));
};

export default function FoodCategoryPicker({
  categories,
  onPicked,
  onRemoved,
}: IFoodCategoryPicker) {
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(FoodCategoryPicker);
  const displayCategories = toCategoryOptions(categories, lang);
  const options = toCategoryOptions(Object.keys(FoodCategory), lang);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: FoodCategory | undefined
  ) => {
    if (value != null) {
      !categories.includes(value) && onPicked && onPicked(value);
    }
    console.log(value);
    const input = inputRef.current;
    if (input) {
      input.value = "";
      console.log(input);
    }
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
      <Box component="h4">Category</Box>
      <Divider />
      <Box padding={"1rem 0"}>
        {displayCategories.map((category, index) => {
          return (
            <CategoryPiece
              text={category.value}
              onRemove={() => onRemoved && onRemoved(index)}
              key={index}
            />
          );
        })}
      </Box>
      <Autocomplete
        options={options}
        onChange={(event, value) => handleChange(event, value?.key)}
        openOnFocus={true}
        filterOptions={(options) =>
          options.filter(
            (option) => option.value.indexOf(inputRef.current?.value ?? "") >= 0
          )
        }
        isOptionEqualToValue={(option, value) => option.key === value.key}
        getOptionLabel={(option) => option.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            fullWidth
            inputRef={inputRef}
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
