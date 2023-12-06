import { Box, Button, Container, FormHelperText, ImageList, ImageListItem, Stack, TextField } from "@mui/material";
import { useI18nContext } from "../../../contexts";
import { Image } from "@mui/icons-material";

export default function FoodSharingForm() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(FoodSharingForm);

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
          <ImageList cols={4} rowHeight={164}>
            <ImageListItem>
              <img src="/imgs/sample.png" alt="" />
              <img src="/imgs/sample.png" alt="" />
              <img src="/imgs/sample.png" alt="" />
            </ImageListItem>
          </ImageList>
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
