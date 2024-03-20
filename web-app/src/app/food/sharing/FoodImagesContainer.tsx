import {
  Box,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import ImagePicker from "./ImagePicker";
import { ClearOutlined } from "@mui/icons-material";
import { IImageExposed } from "../../../data";
import {
  useAuthContext,
  useFoodSharingFormContext,
  useI18nContext,
  useSaveImage,
  useToastContext,
} from "../../../hooks";

interface IFoodImagesContainerProps {
  maxPicked: number;
}

export default function FoodImagesContainer({
  maxPicked,
}: IFoodImagesContainerProps) {
  const formContext = useFoodSharingFormContext();
  const authContext = useAuthContext();
  const { auth } = authContext;
  const { images, setImages } = formContext;
  const saveImage = useSaveImage(auth);

  const handlePicked = (image: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result != null) {
        handleImagePicked(result.toString());
      }
    };

    reader.readAsDataURL(image);
  };
  const i18n = useI18nContext();
  const lang = i18n.of(FoodImagesContainer);
  const toast = useToastContext();

  const handleImagePicked = (image: string): void => {
    const index = images.length;
    const newImages = [...images, null];
    setImages(newImages);
    saveImage.doSave(image, {
      onSuccess: (image) => {
        const cpyImages = [...images];
        cpyImages[index] = image;
        setImages(cpyImages);
      },
      onError: () => {
        const imgsToSet = newImages.slice(0, -1);
        setImages(imgsToSet);
        toast.error(lang("error-retry"));
      },
    });
  };

  const handleImageRemoved = (index: number): void => {
    if (0 <= index && index < images.length) {
      const cpyImages = images.slice();
      cpyImages.splice(index, 1);
      setImages(cpyImages);
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
      <Box component="h4">{lang("images")}</Box>
      <Divider />
      <ImageList cols={4} rowHeight={164}>
        {images.map((image: IImageExposed | null, index: number) => {
          return (
            <ImageListItem
              sx={{
                position: "relative",
              }}
              key={index}
            >
              {image != null ? (
                <img src={image.url} />
              ) : (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              )}
              {image != null && (
                <IconButton
                  color="error"
                  onClick={() => handleImageRemoved(index)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                    padding: 0,
                    backgroundColor: "black",
                    borderRadius: 0,
                  }}
                >
                  <ClearOutlined />
                </IconButton>
              )}
            </ImageListItem>
          );
        })}
        {images.length < maxPicked && (
          <ImageListItem>
            <ImagePicker
              sx={{
                width: "100%",
                height: "100%",
              }}
              onPicked={handlePicked}
            />
          </ImageListItem>
        )}
      </ImageList>
      {images.length === 0 && (
        <Typography component="legend">{lang("at-least-message")}</Typography>
      )}
    </Box>
  );
}
