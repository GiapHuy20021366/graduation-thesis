import { Box, Button, Stack, TextField } from "@mui/material";
// import { useI18nContext } from "../../../contexts";
import FoodImagesContainer from "./FoodImagesContainer";
import { useState } from "react";
import { foodFetcher } from "../../../api";
import { useAuthContext } from "../../../contexts";

export default function FoodSharingForm() {
  // const languageContext = useI18nContext();
  // const lang = languageContext.of(FoodSharingForm);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const [images, setImages] = useState<(string | null)[]>([]);

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
              cpyImages[index] = image.url;
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

  return (
    <Box
      component="form"
      noValidate
      sx={{
        mt: 3,
        width: ["100%", "60%", "50%", "40%"],
      }}
    >
      <Stack spacing={2}>
        <Stack>
          <Box component="h3">Images</Box>
          <FoodImagesContainer
            images={images}
            onPicked={handlePicked}
            onRemoved={handleRemoved}
          />
        </Stack>
        <TextField label="Title" type="text" />
        <TextField label="Description" type="text" />
        <TextField label="Pick-up times" type="number" />
        <Button type="submit" variant="contained">
          Share now!
        </Button>
      </Stack>
    </Box>
  );
}
