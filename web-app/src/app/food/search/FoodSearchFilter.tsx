import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Rating,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import ToggleChip from "../../common/custom/ToggleChip";
import {
  FoodCategory,
  ItemAddedBy,
  ItemAvailable,
  toQuantityType,
} from "../../../data";
import CategoryPiece from "../sharing/CategoryPiece";
import { useFoodSearchContext, useI18nContext } from "../../../hooks";
import { IFoodSearchPrice } from "../../../api";

const PriceOptions = {
  FREE: "FREE",
  ALL: "ALL",
  CUSTOM: "CUSTOM",
} as const;

interface IFoodSearchCondition {
  isActive: boolean;
  onClose: () => void;
  onApply: (params: IFilterParams) => void;
}

interface PriceRange {
  min: number;
  max: number;
}

export interface IFilterParams {
  addedBy: ItemAddedBy;
  available: ItemAvailable;
  maxDistance: number;
  maxDuration: number;
  categories: FoodCategory[];
  minQuantity: number;
  price: IFoodSearchPrice;
}

export default function FoodSearchFilter({
  isActive,
  onClose,
  onApply,
}: IFoodSearchCondition) {
  const searchContext = useFoodSearchContext();
  const [addedBy, setAddedBy] = useState<ItemAddedBy>(searchContext.addedBy);
  const [available, setAvailable] = useState<ItemAvailable>(
    searchContext.available
  );
  const [maxDistance, setMaxDistance] = useState<number>(
    searchContext.maxDistance
  );
  const [categories, setCategories] = useState<FoodCategory[]>(
    searchContext.categories
  );
  const [categoryActive, setCategoryActive] = useState<boolean>(
    searchContext.categories.length !== 0
  );
  const [minQuantity, setMinQuantity] = useState<number>(
    searchContext.minQuantity
  );
  const [quantityHover, setQuantityHover] = useState<number>(-1);
  const [maxDuration, setMaxDuration] = useState<number>(
    searchContext.maxDuration
  );
  const [priceOption, setPriceOption] = useState<string>(
    searchContext.price.active ? PriceOptions.CUSTOM : PriceOptions.ALL
  );
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: searchContext.price.min,
    max: searchContext.price.max,
  });

  const i18nContext = useI18nContext();
  const lang = i18nContext.of("Categories", "Quantities");

  const handleReset = () => {
    setAddedBy(ItemAddedBy.ALL);
    setAvailable(ItemAvailable.AVAILABLE_ONLY);
    setMaxDistance(-1);
    setCategories([]);
    setCategoryActive(false);
    setMinQuantity(1);
    setQuantityHover(-1);
    setPriceOption(PriceOptions.ALL);
    setMaxDuration(-1);
  };

  const handleApply = () => {
    const price: IFoodSearchPrice = {
      active: priceOption !== PriceOptions.ALL,
      min: priceOption === PriceOptions.FREE ? 0 : priceRange.min,
      max: priceOption === PriceOptions.FREE ? 0 : priceRange.max,
    };
    const params: IFilterParams = {
      addedBy: addedBy,
      available: available,
      maxDistance: maxDistance,
      maxDuration: maxDuration,
      categories: categories,
      minQuantity: minQuantity,
      price: price
    };
    onApply(params);
  };

  const handleCategoryPicked = (category: FoodCategory | null): void => {
    console.log(category);
    if (category && !categories.includes(category)) {
      const newCategories = categories.slice();
      newCategories.push(category);
      setCategories(newCategories);
    }
  };

  const handleCategoryRemoved = (index: number): void => {
    if (index > -1 && index < categories.length) {
      const newCategories = categories.slice();
      newCategories.splice(index, 1);
      setCategories(newCategories);
    }
  };

  const toQuantityLang = (quantity: number, hover: number) => {
    if (hover < 0) {
      return quantity ? lang(toQuantityType(quantity)) : lang("ALL");
    }
    return lang(toQuantityType(hover));
  };

  const onPriceRangeClick = (value: PriceRange): void => {
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

  return (
    <Container>
      <Drawer anchor="right" open={isActive} onClose={onClose}>
        <Stack
          sx={{
            width: ["80vw", "50vw", "40vw", "30vw"],
            height: "100vh",
            padding: "4px",
            boxSizing: "border-box",
          }}
        >
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
            Bộ lọc tìm kiếm
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
              <Typography sx={{ fontWeight: 600 }}>Item Added By:</Typography>
              <ToggleChipGroup
                value={addedBy}
                onValueChange={(value) => setAddedBy(value)}
                exclusive
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <ToggleChip
                  variant="outlined"
                  label={"All"}
                  value={ItemAddedBy.ALL}
                />
                <ToggleChip
                  variant="outlined"
                  label={"Personal"}
                  value={ItemAddedBy.PERSONAL}
                />
                <ToggleChip
                  variant="outlined"
                  label={"Volunteer"}
                  value={ItemAddedBy.VOLUNTEER}
                />
              </ToggleChipGroup>
            </Box>
            <Divider variant="inset" />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                Item Availability:
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
                  label={"All"}
                  value={ItemAvailable.ALL}
                />
                <ToggleChip
                  variant="outlined"
                  label={"Available only"}
                  value={ItemAvailable.AVAILABLE_ONLY}
                />
                <ToggleChip
                  variant="outlined"
                  label={"Just gone"}
                  value={ItemAvailable.JUST_GONE}
                />
              </ToggleChipGroup>
            </Box>
            <Divider variant="inset" />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Max Distance:</Typography>
              <ToggleChipGroup
                value={maxDistance}
                onValueChange={(value) => setMaxDistance(value)}
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
                <ToggleChip variant="outlined" label={"All"} value={-1} />
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
              <Typography sx={{ fontWeight: 600 }}>Max Duration:</Typography>
              <ToggleChipGroup
                value={maxDuration}
                onValueChange={(value) => setMaxDuration(value)}
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
                <ToggleChip variant="outlined" label={"All"} value={-1} />
                <ToggleChip variant="outlined" label={"12 hours"} value={0.5} />
                <ToggleChip variant="outlined" label={"1 day"} value={1} />
                <ToggleChip variant="outlined" label={"2 days"} value={2} />
                <ToggleChip variant="outlined" label={"5 days"} value={3} />
              </ToggleChipGroup>
            </Box>
            <Divider variant="inset" />
            <Box>
              <Stack direction={"row"} gap={1} alignItems={"center"}>
                <Typography sx={{ fontWeight: 600 }}>Categories:</Typography>
                <Switch
                  color="secondary"
                  onChange={(_event, checked) => setCategoryActive(checked)}
                  checked={categoryActive}
                />
                <Typography>{categoryActive ? "Custom" : "All"}</Typography>
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
                  {categories.map((category, index) => {
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
              <Typography sx={{ fontWeight: 600 }}>Min Quantity:</Typography>
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
                  {toQuantityLang(minQuantity, quantityHover)}
                </Box>
              </Stack>
            </Box>
            <Divider variant="inset" />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Price Range:</Typography>
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
                  label={"All"}
                  value={PriceOptions.ALL}
                />
                <ToggleChip
                  variant="outlined"
                  label={"Free"}
                  value={PriceOptions.FREE}
                />
                <ToggleChip
                  variant="outlined"
                  label={"Custom"}
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
                      value={priceRange.min}
                      label={"Min"}
                      inputProps={{
                        min: 0,
                        step: 1000,
                      }}
                      onChange={handleMinPriceChange}
                    />
                    <TextField
                      type="number"
                      value={priceRange.max}
                      label={"Max"}
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
              Reset
            </Button>
            <Button variant="contained" sx={{ flex: 1 }} onClick={handleApply}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Container>
  );
}
