import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
// import { useI18nContext } from "../../../contexts";
import FoodImagesContainer from "./FoodImagesContainer";
import { useState } from "react";
import { foodFetcher } from "../../../api";
import { useAuthContext } from "../../../contexts";
import { IImageExposed, duration } from "../../../data";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface FoodValues {
  title: string;
  description: string;
  duration: number;
  quantity: number;
}

export default function FoodSharingForm() {
  // const languageContext = useI18nContext();
  // const lang = languageContext.of(FoodSharingForm);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const [images, setImages] = useState<(IImageExposed | null)[]>([]);

  const foodSchema = yup.object({
    title: yup.string().required("Title can not be empty"),
    description: yup.string().required("Description can not be empty"),
    duration: yup.number().required("Duration is required"),
    quantity: yup.number().required("Quantity is required"),
  });

  const form = useForm<FoodValues>({
    defaultValues: {
      description: "",
      duration: 0,
      quantity: 0,
      title: "",
    },
    resolver: yupResolver(foodSchema),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleRemoved = (index: number): void => {
    if (0 <= index && index < images.length) {
      const cpyImages = [...images];
      cpyImages.splice(index, 1);
      setImages(cpyImages);
    }
  };

  const handlePicked = (image: string): void => {
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
          handleRemoved(index);
        });
    }
  };

  const onSubmit = (data: FoodValues) => {
    if (auth) {
      const food = {
        images: images.map(image => image?._id ?? ""),
        categories: [],
        cost: 0,
        description: data.description,
        duration: data.duration,
        location: {
          lat: 0,
          lng: 0,
        },
        pickUpTimes: 0,
        quantity: data.quantity,
        title: data.title,
      };
      foodFetcher.uploadFood(food, auth).then((data) => console.log(data));
    }
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{
        mt: 3,
        width: ["100%", "60%", "50%", "40%"],
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2}>
        <FormControl variant="outlined" fullWidth>
          <Stack>
            <Box component="h3">Images</Box>
            <FoodImagesContainer
              images={images}
              onPicked={handlePicked}
              onRemoved={handleRemoved}
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
        <TextField
          label="Description"
          type="text"
          multiline
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <FormControl variant="outlined" fullWidth {...register("duration")}>
          <InputLabel id="select-duration-label">Duration</InputLabel>
          <Select
            label="Select duration"
            labelId="select-duration-label"
            value={duration.ONE_DAYS}
          >
            <MenuItem value="" disabled>
              Select an Option
            </MenuItem>
            <MenuItem value={duration.ONE_DAYS}>1 day</MenuItem>
            <MenuItem value={duration.TWO_DAYS}>2 days</MenuItem>
            <MenuItem value={duration.THREE_DAYS}>3 days</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          {...register("quantity")}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
          InputProps={{
            endAdornment: <InputAdornment position="end">Good</InputAdornment>,
            inputProps: { min: 1, max: 5 },
            type: "number",
            value: 1,
          }}
        />
        <Button type="submit" variant="contained">
          Share now!
        </Button>
      </Stack>
    </Box>
  );
}
