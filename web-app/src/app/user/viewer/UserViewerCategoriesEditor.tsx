import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FoodCategory } from "../../../data";
import CategoryPiece from "../../food/sharing/CategoryPiece";
import {
  useAuthContext,
  useI18nContext,
  useLoader,
  useToastContext,
  useUserViewerContext,
} from "../../../hooks";
import { userFetcher } from "../../../api";

type UserViewerCategoriesEditorProps = Omit<DialogProps, "children"> & {
  onCancel: () => void;
  onSuccess: (categories: FoodCategory[]) => void;
};

const UserViewerCategoriesEditor = React.forwardRef<
  HTMLDivElement,
  UserViewerCategoriesEditorProps
>((props, ref) => {
  const { onCancel, onSuccess, ...rest } = props;
  const viewerContext = useUserViewerContext();
  const {
    _id,
    categories: viewerCategories,
    setCategories: setViewerCategories,
  } = viewerContext;
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const i18nContext = useI18nContext();
  const lang = i18nContext.of("PlaceCategories", "Categories");
  const options = Object.values(FoodCategory);
  const [categoryValue, setCategoryValue] = useState<string>(
    lang(FoodCategory.EMPTY)
  );
  const [inputCategory, setInputCategory] = useState<string>("");
  const authContext = useAuthContext();
  const { auth } = authContext;
  const loader = useLoader();
  const toast = useToastContext();

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

  const handleOnClickOk = () => {
    if (JSON.stringify(categories) === JSON.stringify(viewerCategories)) {
      onSuccess && onSuccess(categories);
      return;
    }
    if (auth == null) return;

    loader.setIsError(false);
    loader.setIsFetching(true);

    userFetcher
      .updatePersonalData(
        _id,
        {
          updated: {
            categories: categories,
          },
        },
        auth
      )
      .then(() => {
        onSuccess && onSuccess(categories);
        setViewerCategories(categories);
      })
      .catch(() => {
        loader.setIsError(true);
        toast.error("Không thể thực hiện hành động bây giờ");
      })
      .finally(() => {
        loader.setIsFetching(false);
      });
  };

  const handleOnClickCancel = () => {
    onCancel && onCancel();
  };

  useEffect(() => {
    if (props.open) {
      setCategories(viewerCategories?.slice() ?? []);
    }
  }, [viewerCategories, props.open]);

  return (
    <Dialog ref={ref} {...rest}>
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent>
        <Stack
          gap={1}
          flex={1}
          sx={{
            width: ["100vw", "60vw", "50vw", "40vw"],
          }}
        >
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleOnClickCancel}
          disabled={loader.isFetching}
        >
          Hủy bỏ
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={handleOnClickOk}
          disabled={loader.isFetching}
        >
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserViewerCategoriesEditor;
