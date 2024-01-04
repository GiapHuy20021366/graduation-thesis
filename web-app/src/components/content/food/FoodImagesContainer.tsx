import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import ImagePicker from "./ImagePicker";
import { ClearOutlined } from "@mui/icons-material";
import { IImageExposed } from "../../../data";
import { useAuthContext, useFoodSharingFormContext } from "../../../contexts";
import { foodFetcher } from "../../../api";

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

  const handleImageRemoved = (index: number): void => {
    if (0 <= index && index < images.length) {
      const cpyImages = images.slice();
      cpyImages.splice(index, 1);
      setImages(cpyImages);
    }
  };

  return (
    <Box>
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
                // border: "1px solid black",
              }}
              onPicked={handlePicked}
            />
          </ImageListItem>
        )}
      </ImageList>
      {images.length === 0 && (
        <Typography component="legend">
          You need to pick at least one image
        </Typography>
      )}
    </Box>
  );
}
