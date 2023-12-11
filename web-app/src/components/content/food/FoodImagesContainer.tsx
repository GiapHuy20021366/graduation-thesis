import { Box, ImageList, ImageListItem, Skeleton } from "@mui/material";
import ImagePicker from "./ImagePicker";
import { ClearOutlined } from "@mui/icons-material";
import { IImageExposed } from "../../../data";

interface IFoodImagesContainerProps {
  onPicked?: (image: string) => void;
  onRemoved?: (index: number) => void;
  images: (IImageExposed | null)[];
  maxPicked: number;
}

export default function FoodImagesContainer({
  onPicked,
  onRemoved,
  images,
  maxPicked
}: IFoodImagesContainerProps) {
  const handlePicked = (image: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result != null) {
        onPicked && onPicked(result.toString());
      }
    };

    reader.readAsDataURL(image);
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
                <ClearOutlined
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                    color: "red",
                    backgroundColor: "yellow",
                  }}
                  onClick={() => onRemoved && onRemoved(index)}
                />
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
                border: "1px solid black",
              }}
              onPicked={handlePicked}
            />
          </ImageListItem>
        )}
      </ImageList>
    </Box>
  );
}
