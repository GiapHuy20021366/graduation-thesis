import React, { useRef } from "react";
import {
  Avatar,
  Box,
  BoxProps,
  SpeedDial,
  Stack,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import PlaceImageHolder from "./PlaceImageHolder";
import { usePlaceEditContext } from "../../../hooks";
import { AddOutlined } from "@mui/icons-material";

type PlaceAvartarAndImagesProps = BoxProps;

const PlaceAvartarAndImages = React.forwardRef<
  HTMLDivElement,
  PlaceAvartarAndImagesProps
>((props, ref) => {
  const editContext = usePlaceEditContext();
  const { images, setImages, avartar, exposeName } = editContext;
  const inputImageAddRef = useRef<HTMLInputElement>(null);
  const inputAvatarRef = useRef<HTMLInputElement>(null);

  const handleClickAdd = () => {
    inputImageAddRef.current?.click();
  };

  const handleClickAvartar = () => {
    inputAvatarRef.current?.click();
  };

  const handleImageUpdate = (index: number, file: File) => {
    console.log(index, file);
  };

  const handleImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.slice();
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAvartarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
  };

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        position: "relative",
        ...(props.sx ?? {}),
      }}
    >
      <Box width={"100%"} position={"relative"}>
        <Carousel
          autoPlay={false}
          animation="slide"
          cycleNavigation
          fullHeightHover
          navButtonsAlwaysVisible
          sx={{
            backgroundColor: "white",
          }}
        >
          {images.length > 0 &&
            images.map((url, index) => {
              return (
                <PlaceImageHolder
                  sx={{
                    width: "100%",
                    height: "220px",
                  }}
                  key={url}
                  imgSrc={url}
                  onImageUpdate={(file) => handleImageUpdate(index, file)}
                  onImageRemove={() => handleImageRemove(index)}
                />
              );
            })}
        </Carousel>
        <input
          type="file"
          ref={inputImageAddRef}
          hidden
          accept="image/*"
          onChange={handleImageAdd}
        />
        <SpeedDial
          icon={<AddOutlined />}
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          ariaLabel={"Add"}
          onClick={handleClickAdd}
        />
      </Box>

      <input
        type="file"
        ref={inputAvatarRef}
        hidden
        accept="image/*"
        onChange={handleAvartarChange}
      />
      <Stack direction={"row"} gap={1}>
        <Avatar
          sx={{
            width: [90, 120, 150, 180],
            height: [90, 120, 150, 180],
            transform: "translateY(-50%)",
            zIndex: 1000,
            cursor: "pointer",
            boxShadow: 5,
          }}
          onClick={() => handleClickAvartar()}
          src={avartar}
        >
          H
        </Avatar>
        <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>{exposeName}</Typography>
      </Stack>
    </Box>
  );
});

export default PlaceAvartarAndImages;
