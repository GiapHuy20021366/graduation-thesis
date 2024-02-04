import React, { useRef, useState } from "react";
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
import {
  useAuthContext,
  usePlaceEditContext,
  useSaveImage,
  useToastContext,
} from "../../../hooks";
import { AddOutlined, CloseOutlined, EditOutlined } from "@mui/icons-material";
import { BASE64 } from "../../../data";

type PlaceAvartarAndImagesProps = BoxProps;

const PlaceAvartarAndImages = React.forwardRef<
  HTMLDivElement,
  PlaceAvartarAndImagesProps
>((props, ref) => {
  const editContext = usePlaceEditContext();
  const { images, setImages, avartar, setAvartar, exposeName } = editContext;
  const [index, setIndex] = useState<number>(0);

  const inputImageAddRef = useRef<HTMLInputElement>(null);
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputImageUpdateRef = useRef<HTMLInputElement>(null);

  const authContext = useAuthContext();
  const auth = authContext.auth;
  const saveImage = useSaveImage();
  const toast = useToastContext();

  const handleClickAvartar = () => {
    inputAvatarRef.current?.click();
  };

  const handleImageUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (index < 0 || index >= images.length) return;

    const files = event.target.files;
    if (files == null || files.length === 0) return;
    const file = files[0];

    if (auth == null) return;

    BASE64.from(file, (result) => {
      if (typeof result !== "string") return;

      saveImage.doSave(
        result,
        {
          onSuccess: (image) => {
            const nImages = [...images];
            nImages[index] = image.url;
            setImages(nImages);
          },
          onError: () => {
            toast.error("Không thể thực hiện hành động bây giờ");
          },
        },
        auth
      );
    });
  };

  const handleImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files == null) return;
    const file = files[0];
    if (file == null) return;

    if (auth == null) return;

    BASE64.from(file, (result) => {
      if (typeof result !== "string") return;

      saveImage.doSave(
        result,
        {
          onSuccess: (image) => {
            const nImages = [...images, image.url];
            setImages(nImages);
            setIndex(nImages.length);
          },
          onError: () => {
            toast.error("Không thể thực hiện hành động bây giờ");
          },
        },
        auth
      );
    });
  };

  const handleImageRemove = () => {
    const newImages = images.slice();
    newImages.splice(index, 1);
    setImages(newImages);
    setIndex(Math.max(0, index - 1));
  };

  const handleAvartarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (auth == null) return;

    const files = event.target.files;
    if (files == null) return;
    const file = files[0];
    if (file == null) return;

    BASE64.from(file, (result) => {
      if (typeof result !== "string") return;

      saveImage.doSave(
        result,
        {
          onSuccess: (image) => {
            setAvartar(image.url);
          },
          onError: () => {
            toast.error("Không thể thực hiện hành động bây giờ");
          },
        },
        auth
      );
    });
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
            width: "100%",
            height: "230px",
          }}
          index={index}
          onChange={(now) => setIndex(now ?? 0)}
        >
          {images.map((url) => {
            return (
              <PlaceImageHolder
                sx={{
                  width: "100%",
                }}
                key={url}
                imgSrc={url}
              />
            );
          })}
        </Carousel>

        {/* Add */}
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
          onClick={() => inputImageAddRef.current?.click()}
        />

        <input
          type="file"
          ref={inputImageUpdateRef}
          hidden
          accept="image/*"
          onChange={handleImageUpdate}
        />

        {images.length > 0 && (
          <>
            <SpeedDial
              icon={<EditOutlined />}
              sx={{ position: "absolute", bottom: 16, right: 76 }}
              ariaLabel={"Add"}
              onClick={() => inputImageUpdateRef.current?.click()}
            />

            <SpeedDial
              icon={<CloseOutlined />}
              sx={{ position: "absolute", bottom: 16, right: 136 }}
              ariaLabel={"Add"}
              onClick={handleImageRemove}
            />
          </>
        )}
      </Box>

      <Stack direction={"row"} gap={1}>
        <input
          type="file"
          ref={inputAvatarRef}
          hidden
          accept="image/*"
          onChange={handleAvartarChange}
        />
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
        <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>
          {exposeName ? exposeName : "Nhập tên địa điểm của bạn"}
        </Typography>
      </Stack>
    </Box>
  );
});

export default PlaceAvartarAndImages;
