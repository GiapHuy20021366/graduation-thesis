import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Rating,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import ToggleChip from "../../common/custom/ToggleChip";
import {
  FoodCategory,
  IFoodSearchPrice,
  ItemAddedBy,
  ItemAvailable,
  PlaceType,
  loadFromSessionStorage,
  saveToSessionStorage,
  toItemAddedBy,
  toPlaceTypes,
  toQuantityType,
} from "../../../data";
import { useFoodSearchContext, useI18nContext } from "../../../hooks";
import CategoryPiece from "../sharing/CategoryPiece";
import { CloseOutlined } from "@mui/icons-material";

const PriceOptions = {
  FREE: "FREE",
  ALL: "ALL",
  CUSTOM: "CUSTOM",
} as const;

export interface IFilterParams {
  addedBy?: PlaceType[];
  available: ItemAvailable;
  maxDistance?: number;
  maxDuration?: number;
  categories?: FoodCategory[];
  minQuantity?: number;
  price?: IFoodSearchPrice;
}

interface IFoodSearchCondition {
  onApply?: (params: IFilterParams) => void;
  onCloseClick?: () => void;
}

interface IFoodAroundFilterSnapshotData {
  addedBy: ItemAddedBy;
  available: ItemAvailable;
  maxDistance?: number;
  categories?: FoodCategory[];
  minQuantity?: number;
  maxDuration?: number;
  priceOption?: string;
  priceRange?: IFoodSearchPrice;
}

const FOOD_AROUND_FILTER_STORAGE_KEY = "food.around.filter";

export default function FoodAroundFilter({
  onApply,
  onCloseClick,
}: IFoodSearchCondition) {
  const searchContext = useFoodSearchContext();
  const [addedBy, setAddedBy] = useState<ItemAddedBy>(
    toItemAddedBy(searchContext.addedBy)
  );
  const [available, setAvailable] = useState<ItemAvailable>(
    searchContext.available
  );
  const [maxDistance, setMaxDistance] = useState<number | undefined>(
    searchContext.maxDistance
  );
  const [categories, setCategories] = useState<FoodCategory[] | undefined>(
    searchContext.categories
  );
  const [categoryActive, setCategoryActive] = useState<boolean>(
    searchContext.categories?.length === 0
  );
  const [minQuantity, setMinQuantity] = useState<number | undefined>(
    searchContext.minQuantity
  );
  const [quantityHover, setQuantityHover] = useState<number>(-1);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(
    searchContext.maxDuration
  );
  const [priceOption, setPriceOption] = useState<string | undefined>(
    searchContext.price ? PriceOptions.CUSTOM : PriceOptions.ALL
  );
  const [priceRange, setPriceRange] = useState<IFoodSearchPrice | undefined>({
    min: searchContext?.price?.min,
    max: searchContext?.price?.max,
  });

  const i18nContext = useI18nContext();
  const lang = i18nContext.of(
    "FoodSearchFilter",
    "Categories",
    "Quantities",
    "DayValues"
  );

  const dirtyRef = useRef<boolean>(true);

  const handleReset = () => {
    setAddedBy(ItemAddedBy.ALL);
    setAvailable(ItemAvailable.AVAILABLE_ONLY);
    setMaxDistance(undefined);
    setCategories(undefined);
    setCategoryActive(false);
    setMinQuantity(undefined);
    setQuantityHover(-1);
    setPriceOption(PriceOptions.ALL);
    setMaxDuration(undefined);
  };

  const handleApply = () => {
    const price: IFoodSearchPrice = {
      min: priceOption === PriceOptions.FREE ? 0 : priceRange?.min,
      max: priceOption === PriceOptions.FREE ? 0 : priceRange?.max,
    };
    const params: IFilterParams = {
      addedBy: toPlaceTypes(addedBy),
      available: available,
      maxDistance: maxDistance,
      maxDuration: maxDuration,
      categories: categoryActive ? categories : undefined,
      minQuantity: minQuantity,
      price: price,
    };
    onApply && onApply(params);
    doSaveStorage();
  };

  const handleCategoryPicked = (category: FoodCategory | null): void => {
    if (category) {
      if (categories == null) {
        setCategories([category]);
      } else {
        const newCategories = categories.slice();
        newCategories.push(category);
        setCategories(newCategories);
      }
    }
  };

  const handleCategoryRemoved = (index: number): void => {
    if (categories != null) {
      if (index > -1 && index < categories.length) {
        const newCategories = categories.slice();
        newCategories.splice(index, 1);
        setCategories(newCategories);
      }
    }
  };

  const toQuantityLang = (hover: number, quantity?: number) => {
    if (hover < 0) {
      return quantity ? lang(toQuantityType(quantity)) : lang("l-all");
    }
    return lang(toQuantityType(hover));
  };

  const onPriceRangeClick = (value: IFoodSearchPrice): void => {
    setPriceRange(value);
  };

  const handleMinPriceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPriceRange({
      ...priceRange,
      min: +event.target.value,
    });
  };

  const handleMaxPriceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPriceRange({
      ...priceRange,
      max: +event.target.value,
    });
  };

  const doSaveStorage = () => {
    const snapshot: IFoodAroundFilterSnapshotData = {
      addedBy,
      available,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      priceOption,
      priceRange,
    };
    saveToSessionStorage(snapshot, {
      key: FOOD_AROUND_FILTER_STORAGE_KEY,
    });
  };

  useEffect(() => {
    if (dirtyRef.current) {
      dirtyRef.current = false;
      const snapshot = loadFromSessionStorage<IFoodAroundFilterSnapshotData>({
        key: FOOD_AROUND_FILTER_STORAGE_KEY,
        maxDuration: 1 * 24 * 60 * 60 * 1000,
      });
      if (snapshot) {
        setAddedBy(snapshot.addedBy);
        setAvailable(snapshot.available);
        setMaxDistance(snapshot.maxDistance);
        setCategories(snapshot.categories);
        setMinQuantity(snapshot.minQuantity);
        setMaxDuration(snapshot.maxDuration);
        setPriceOption(snapshot.priceOption);
        setPriceRange(snapshot.priceRange);
      }
    }
  }, []);

  const onItemAddedByChange = (value: string) => {
    setAddedBy(value as ItemAddedBy);
    const placeTypes = toPlaceTypes(value as ItemAddedBy);
    searchContext.setAddedBy(placeTypes);
  };

  return (
    <Stack
      sx={{
        width: ["80vw", "50vw", "40vw", "30vw"],
        height: "100%",
        padding: "4px",
        boxSizing: "border-box",
        position: "absolute",
        right: 0,
        zIndex: 1200,
        backgroundColor: "background.default",
      }}
    >
      <Tooltip
        arrow
        children={
          <IconButton
            sx={{ position: "absolute", left: 5, top: 5 }}
            onClick={() => onCloseClick && onCloseClick()}
          >
            <CloseOutlined />
          </IconButton>
        }
        title={"Close"}
      />
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
      <Stack
        flex={1}
        gap={2}
        sx={{
          overflowY: "auto",
        }}
        p={1}
      >
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {lang("item-added-by")}:
          </Typography>
          <ToggleChipGroup
            value={addedBy ?? ItemAddedBy.ALL}
            onValueChange={(value) => onItemAddedByChange(value)}
            exclusive
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              overflowY: "auto",
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <ToggleChip
              variant="outlined"
              label={lang("l-all")}
              value={ItemAddedBy.ALL}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-personal")}
              value={ItemAddedBy.PERSONAL}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-volunteer")}
              value={ItemAddedBy.VOLUNTEER}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-place")}
              value={ItemAddedBy.PLACE}
            />
          </ToggleChipGroup>
        </Box>
        <Divider variant="inset" />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {lang("item-available")}:
          </Typography>
          <ToggleChipGroup
            value={available}
            onValueChange={(value) => setAvailable(value)}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
            exclusive
          >
            <ToggleChip
              variant="outlined"
              label={lang("l-all")}
              value={ItemAvailable.ALL}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-available-only")}
              value={ItemAvailable.AVAILABLE_ONLY}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-just-gone")}
              value={ItemAvailable.JUST_GONE}
            />
          </ToggleChipGroup>
        </Box>
        <Divider variant="inset" />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {lang("max-distance")}:
          </Typography>
          <ToggleChipGroup
            value={maxDistance ?? -1}
            onValueChange={(value) =>
              setMaxDistance(value === -1 ? undefined : value)
            }
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
            <ToggleChip variant="outlined" label={lang("l-all")} value={-1} />
            <ToggleChip variant="outlined" label={"0.5 km"} value={0.5} />
            <ToggleChip variant="outlined" label={"1 km"} value={1} />
            <ToggleChip variant="outlined" label={"2 km"} value={2} />
            <ToggleChip variant="outlined" label={"5 km"} value={5} />
            <ToggleChip variant="outlined" label={"10 km"} value={10} />
            <ToggleChip variant="outlined" label={"25 km"} value={25} />
            <ToggleChip variant="outlined" label={"50 km"} value={50} />
          </ToggleChipGroup>
        </Box>
        <Divider variant="inset" />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {lang("max-duration")}:
          </Typography>
          <ToggleChipGroup
            value={maxDuration ?? -1}
            onValueChange={(value) =>
              setMaxDuration(value === -1 ? undefined : value)
            }
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
            <ToggleChip variant="outlined" label={lang("l-all")} value={-1} />
            <ToggleChip
              variant="outlined"
              label={lang("12-hours")}
              value={0.5}
            />
            <ToggleChip variant="outlined" label={lang("1-day")} value={1} />
            <ToggleChip variant="outlined" label={lang("2-days")} value={2} />
            <ToggleChip variant="outlined" label={lang("3-days")} value={3} />
          </ToggleChipGroup>
        </Box>
        <Divider variant="inset" />
        <Box>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Typography sx={{ fontWeight: 600 }}>
              {lang("category")}:
            </Typography>
            <Switch
              color="secondary"
              onChange={(_event, checked) => setCategoryActive(checked)}
              checked={categoryActive}
            />
            <Typography>
              {categoryActive ? lang("l-custom") : lang("l-all")}
            </Typography>
          </Stack>
          <Stack
            sx={{
              display: categoryActive ? "block" : "none",
            }}
          >
            <Autocomplete
              options={Object.keys(FoodCategory)}
              openOnFocus={true}
              getOptionLabel={(option) => lang(option)}
              onChange={(_event, value) => handleCategoryPicked(value)}
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
            <Stack
              direction={"row"}
              gap={0.2}
              width={"100%"}
              flexWrap={"wrap"}
              sx={{
                maxHeight: "15vh",
                overflowY: "auto",
              }}
            >
              {categories &&
                categories.map((category, index) => {
                  return (
                    <CategoryPiece
                      text={lang(category)}
                      onRemove={() => handleCategoryRemoved(index)}
                      key={index}
                    />
                  );
                })}
            </Stack>
          </Stack>
        </Box>
        <Divider variant="inset" />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {lang("min-quantity")}:
          </Typography>
          <Stack direction="row" alignItems={"center"}>
            <Rating
              value={minQuantity}
              onChange={(_event, value) =>
                setMinQuantity(Math.max(value ?? 0, 0))
              }
              onChangeActive={(_event, newHover) => {
                setQuantityHover(newHover);
              }}
            />
            <Box sx={{ ml: 2 }}>
              {toQuantityLang(quantityHover, minQuantity)}
            </Box>
          </Stack>
        </Box>
        <Divider variant="inset" />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {lang("price-range")}:
          </Typography>
          <ToggleChipGroup
            value={priceOption}
            onValueChange={(value) => setPriceOption(value)}
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
              value={PriceOptions.ALL}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-free")}
              value={PriceOptions.FREE}
            />
            <ToggleChip
              variant="outlined"
              label={lang("l-custom")}
              value={PriceOptions.CUSTOM}
            />
          </ToggleChipGroup>
          {priceOption === PriceOptions.CUSTOM && (
            <Box>
              <Stack
                direction={"row"}
                gap={1}
                my={1.5}
                boxSizing={"border-box"}
              >
                <TextField
                  type="number"
                  value={priceRange?.min}
                  label={lang("l-min")}
                  inputProps={{
                    min: 0,
                    step: 1000,
                  }}
                  onChange={handleMinPriceChange}
                />
                <TextField
                  type="number"
                  value={priceRange?.max}
                  label={lang("l-max")}
                  inputProps={{
                    min: 0,
                    step: 1000,
                  }}
                  onChange={handleMaxPriceChange}
                />
              </Stack>
              <ToggleChipGroup
                value={""}
                onValueChange={(value) => onPriceRangeClick(value)}
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
                  label={"10 000 - 30 000"}
                  value={{ min: 10000, max: 30000 }}
                />
                <ToggleChip
                  variant="outlined"
                  label={"30 000 - 50 000"}
                  value={{ min: 30000, max: 50000 }}
                />
                <ToggleChip
                  variant="outlined"
                  label={"50 000 - 100 000"}
                  value={{ min: 50000, max: 100000 }}
                />
                <ToggleChip
                  variant="outlined"
                  label={"100 000 - 200 000"}
                  value={{ min: 100000, max: 200000 }}
                />
                <ToggleChip
                  variant="outlined"
                  label={"200 000 - 500 000"}
                  value={{ min: 200000, max: 500000 }}
                />
              </ToggleChipGroup>
            </Box>
          )}
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
  );
}
