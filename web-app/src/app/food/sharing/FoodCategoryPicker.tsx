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
import { I18Resolver } from "../../I18nContext";

export interface IFoodCategoryPicker {
  categories: FoodCategory[];
  onPicked?: (category: FoodCategory) => void;
  onRemoved?: (index: number) => void;
}

interface CategoryOption {
  key: FoodCategory;
  value: string;
}

const toCategoryOption = (
  category: FoodCategory,
  lang: I18Resolver
): CategoryOption => {
  return {
    key: category,
    value: lang(category),
  };
};

const toCategoryOptions = (
  categories: FoodCategory[],
  lang: I18Resolver
): CategoryOption[] => {
  return categories.map((category) => toCategoryOption(category, lang));
};

export default function FoodCategoryPicker({
  categories,
  onPicked,
  onRemoved,
}: IFoodCategoryPicker) {
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(FoodCategoryPicker, "Categories");
  const displayCategories = toCategoryOptions(categories, lang);
  const options = toCategoryOptions(Object.values(FoodCategory), lang);
  const [valueCategory, setValueCategory] = useState<CategoryOption>(
    toCategoryOption(FoodCategory.EMPTY, lang)
  );
  const [inputCategory, setInputCategory] = useState<string>(
    FoodCategory.EMPTY
  );

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: FoodCategory | undefined
  ) => {
    if (value != null && value !== FoodCategory.EMPTY) {
      !categories.includes(value) && onPicked && onPicked(value);
    }
    setInputCategory(FoodCategory.EMPTY);
    setValueCategory(toCategoryOption(FoodCategory.EMPTY, lang));
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
        value={valueCategory}
        onChange={(event, value) => handleChange(event, value?.key)}
        openOnFocus={true}
        inputValue={inputCategory}
        onInputChange={(_event, value) => setInputCategory(value)}
        filterOptions={(options, state) => {
          state.inputValue;
          return options.filter(
            (option) =>
              option.value.indexOf(inputCategory) >= 0 &&
              option.key !== FoodCategory.EMPTY
          );
        }}
        isOptionEqualToValue={(option, value) => option.key === value.key}
        getOptionLabel={(option) => option.value}
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
