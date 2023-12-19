import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import FoodImagesContainer from "./FoodImagesContainer";
import { useEffect, useRef, useState } from "react";
import { foodFetcher } from "../../../api";
import { useAuthContext } from "../../../contexts";
import {
  IImageExposed,
  DurationType,
  UnitType,
  QuantityType,
  FoodCategory,
  toQuantityType,
  toQuantityLevel,
  ICoordinates,
  IFoodUploadData,
} from "../../../data";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import DescriptionEditor from "./DescriptionEditor";
import { RichTextEditorRef } from "mui-tiptap";
import FoodCategoryPicker from "./FoodCategoryPicker";
import FoodMapPicker from "./FoodMapPicker";

interface FoodValues {
  title: string;
  duration: number;
  count: number;
}

export default function FoodSharingForm() {
  const [images, setImages] = useState<(IImageExposed | null)[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const descriptionEditorRef = useRef<RichTextEditorRef>(null);
  const [quantity, setQuantity] = useState<number>(5);
  const [cost, setCost] = useState<number>(0);
  const unitRef = useRef<HTMLSelectElement>(null);
  const durationTypeRef = useRef<HTMLSelectElement>(null);
  const [location, setLocation] = useState<ICoordinates>({ lat: 0, lng: 0 });
  // const languageContext = useI18nContext();
  // const lang = languageContext.of(FoodSharingForm);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const navigate = useNavigate();

  const foodSchema = yup.object({
    title: yup.string().required("Title can not be empty"),
    duration: yup.number().required("Duration can not be empty"),
    count: yup.number().required("Count can not be empty"),
  });

  const form = useForm<FoodValues>({
    defaultValues: {
      title: "",
      duration: 1,
      count: 1,
    },
    resolver: yupResolver(foodSchema),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleImageRemoved = (index: number): void => {
    if (0 <= index && index < images.length) {
      const cpyImages = images.slice();
      cpyImages.splice(index, 1);
      setImages(cpyImages);
    }
  };

  const handleImagePicked = (image: string): void => {
    const index = images.length;
    const newImages = [...images, null];
    setImages(newImages);
    if (auth) {
      foodFetcher
        .uploadImage("", image, auth)
        .then((result) => {
          const _images = result.data;
          if (_images) {
            const image = _images[0];
            if (image) {
              const cpyImages = [...images];
              cpyImages[index] = image;
              setImages(cpyImages);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          const imgsToSet = newImages.slice(0, -1);
          setImages(imgsToSet);
        });
    }
  };

  const handleCategoryPicked = (category: FoodCategory) => {
    const newCategories = [...categories, category];
    setCategories(newCategories);
  };

  const handleCategoryRemoved = (index: number) => {
    if (0 <= index && index < categories.length) {
      const cpyCategories = categories.slice();
      cpyCategories.splice(index, 1);
      setCategories(cpyCategories);
    }
  };

  const onSubmit = (data: FoodValues) => {
    const imgs = images.filter((img) => img != null).map((img) => img!._id);
    const description = descriptionEditorRef.current?.editor?.getHTML() ?? "";
    const durationType =
      (durationTypeRef.current?.value as DurationType | undefined) ??
      DurationType.UNKNOWN;
    const countUnit =
      (unitRef.current?.value as UnitType | undefined) ?? UnitType.UNKNOWN;
    const foodUploadData: IFoodUploadData = {
      images: imgs,
      title: data.title,
      description: description,
      categories: categories,
      location: location,
      duration: {
        value: data.duration,
        unit: durationType,
      },
      count: {
        value: data.count,
        unit: countUnit,
      },
      quantity: quantity,
      cost: {
        value: cost,
      },
    };
    if (auth) {
      console.log(foodUploadData);
      foodFetcher
        .uploadFood(foodUploadData, auth)
        .then((data) => navigate(`/food/${data.data?._id}`, { replace: true }));
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(pos);
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    }
  }, []);

  return (
    <Box
      component="form"
      noValidate
      sx={{
        mt: 3,
        width: ["100%", "80%", "60%", "50%"],
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2}>
        <FormControl
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #bdbdbd",
            borderRadius: "4px",
            padding: "8px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack>
            <Box component="h4">Images</Box>
            <Divider />
            <FoodImagesContainer
              images={images}
              onPicked={handleImagePicked}
              onRemoved={handleImageRemoved}
              maxPicked={5}
            />
          </Stack>
        </FormControl>
        <TextField
          label="Title"
          type="text"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <DescriptionEditor editorRef={descriptionEditorRef} />
        <FoodCategoryPicker
          categories={categories}
          onPicked={handleCategoryPicked}
          onRemoved={handleCategoryRemoved}
        />
        <FormControl
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #bdbdbd",
            borderRadius: "4px",
            padding: "8px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack>
            <Box component="h4">Location</Box>
            <Divider />
            <FoodMapPicker onPicked={(location) => setLocation(location)} />
          </Stack>
        </FormControl>
        <TextField
          label="Duration"
          type="number"
          variant="outlined"
          {...register("duration")}
          error={!!errors.duration}
          helperText={errors.duration?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  variant="standard"
                  disableUnderline={true}
                  displayEmpty={true}
                  defaultValue={DurationType.DAY}
                  ref={durationTypeRef}
                >
                  <MenuItem value={DurationType.DAY}>Day</MenuItem>
                  <MenuItem value={DurationType.HOUR}>Hour</MenuItem>
                </Select>
              </InputAdornment>
            ),
            inputProps: { min: 1, max: 5 },
            type: "number",
            defaultValue: 1,
          }}
        />
        <TextField
          label="Count"
          type="number"
          {...register("count")}
          error={!!errors.count}
          helperText={errors.count?.message}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  defaultValue={UnitType.PIECE}
                  variant="standard"
                  disableUnderline={true}
                  displayEmpty={true}
                  ref={unitRef}
                >
                  <MenuItem value={UnitType.PIECE}>Piece</MenuItem>
                  <MenuItem value={UnitType.KILOGAM}>Kilogam</MenuItem>
                  <MenuItem value={UnitType.GAM}>Gam</MenuItem>
                  <MenuItem value={UnitType.POUND}>Pouce</MenuItem>
                  <MenuItem value={UnitType.METER}>Meter</MenuItem>
                  <MenuItem value={UnitType.CENTIMETER}>Centimeter</MenuItem>
                </Select>
              </InputAdornment>
            ),
            inputProps: { min: 1, max: 5 },
            type: "number",
            defaultValue: 1,
          }}
        />
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  value={toQuantityType(quantity)}
                  onChange={(event) =>
                    setQuantity(toQuantityLevel(event.target.value))
                  }
                  variant="standard"
                  disableUnderline={true}
                  displayEmpty={true}
                >
                  <MenuItem value={QuantityType.PRETTY_GOOD}>
                    Pretty good
                  </MenuItem>
                  <MenuItem value={QuantityType.TOTAL_GOOD}>
                    Total good
                  </MenuItem>
                  <MenuItem value={QuantityType.SEEM_GOOD}>Seem good</MenuItem>
                  <MenuItem value={QuantityType.USABLE}>Usage</MenuItem>
                  <MenuItem value={QuantityType.SEEM_USABLE}>
                    Seem usage
                  </MenuItem>
                </Select>
              </InputAdornment>
            ),
            inputProps: { min: 1, max: 5 },
            type: "number",
            value: quantity,
            onChange: (event) =>
              setQuantity(
                Math.max(0, Math.min(5, Math.round(+event.target.value)))
              ),
          }}
        />
        <TextField
          label="Cost"
          type="number"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {cost ? "VNĐ" : "Free"}
              </InputAdornment>
            ),
            inputProps: { min: 0 },
            type: "number",
            value: cost,
            onChange: (event) => setCost(+event.target.value),
          }}
        />
        <Button type="submit" variant="contained">
          Share now!
        </Button>
      </Stack>
    </Box>
  );
}
