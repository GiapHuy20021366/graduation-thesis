import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  BoxProps,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useI18nContext, usePlaceEditContext } from "../../../hooks";
import CategoryPiece from "../../food/sharing/CategoryPiece";
import { FoodCategory } from "../../../data";

type PlaceCategoriesProps = BoxProps;

const PlaceCategories = React.forwardRef<HTMLDivElement, PlaceCategoriesProps>(
  (props, ref) => {
    const editContext = usePlaceEditContext();
    const { categories, setCategories } = editContext;

    const i18nContext = useI18nContext();
    const lang = i18nContext.of("PlaceCategories", "Categories");

    const options = Object.values(FoodCategory);
    const [categoryValue, setCategoryValue] = useState<string>(
      lang(FoodCategory.EMPTY)
    );
    const [inputCategory, setInputCategory] = useState<string>("");

    const handleCategoryChange = (
      _event: React.SyntheticEvent<Element, Event>,
      value: FoodCategory | null
    ) => {
      if (value != null && value !== FoodCategory.EMPTY) {
        if (!categories.includes(value)) {
          setCategories([...categories, value]);
        }
      }
      setInputCategory("");
      setCategoryValue(lang(FoodCategory.EMPTY));
    };

    const handleRemoveCategory = (index: number) => {
      if (0 <= index && index <= categories.length) {
        const nCategories = [...categories];
        nCategories.splice(index, 1);
        setCategories(nCategories);
      }
    };

    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <h4>Loại thực phẩm</h4>
        <Typography>
          Giúp mọi người tìm hiểu về loại thực phẩm mà địa điểm này cung cấp
        </Typography>
        <Divider />
        <Box padding={"1rem 0"}>
          {categories.map((category, index) => {
            return (
              <CategoryPiece
                text={lang(category)}
                onRemove={() => handleRemoveCategory(index)}
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
);

export default PlaceCategories;
