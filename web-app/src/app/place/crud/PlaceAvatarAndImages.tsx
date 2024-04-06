import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  BoxProps,
  SpeedDial,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import PlaceImageHolder from "./PlaceImageHolder";
import {
  useAuthContext,
  useComponentLanguage,
  usePlaceEditContext,
  useSaveImage,
  useToastContext,
} from "../../../hooks";
import { AddOutlined, CloseOutlined, EditOutlined } from "@mui/icons-material";
import { BASE64 } from "../../../data";

type PlaceavatarAndImagesProps = BoxProps;

const PlaceavatarAndImages = React.forwardRef<
  HTMLDivElement,
  PlaceavatarAndImagesProps
>((props, ref) => {
  const editContext = usePlaceEditContext();
  const { images, setImages, avatar, setavatar, exposeName } = editContext;
  const [index, setIndex] = useState<number>(0);
  const lang = useComponentLanguage();

  const inputImageAddRef = useRef<HTMLInputElement>(null);
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputImageUpdateRef = useRef<HTMLInputElement>(null);

  const authContext = useAuthContext();
  const auth = authContext.auth;
  const saveImage = useSaveImage();
  const toast = useToastContext();

  const handleClickAvatar = () => {
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
            toast.error(lang("can-not-upload-image-now"));
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
            toast.error(lang("can-not-upload-image-now"));
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            setavatar(image.url);
          },
          onError: () => {
            toast.error(lang("can-not-upload-image-now"));
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
            backgroundColor: "background.default",
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
            <Tooltip arrow title={lang("add-label")} placement="bottom">
              <SpeedDial
                icon={<EditOutlined />}
                sx={{ position: "absolute", bottom: 16, right: 76 }}
                ariaLabel={lang("add-label")}
                onClick={() => inputImageUpdateRef.current?.click()}
              />
            </Tooltip>

            <Tooltip arrow title={lang("remove-label")}>
              <SpeedDial
                icon={<CloseOutlined />}
                sx={{ position: "absolute", bottom: 16, right: 136 }}
                ariaLabel={lang("remove-label")}
                onClick={handleImageRemove}
              />
            </Tooltip>
          </>
        )}
      </Box>

      <Stack direction={"row"} gap={1}>
        <input
          type="file"
          ref={inputAvatarRef}
          hidden
          accept="image/*"
          onChange={handleAvatarChange}
        />
        <Avatar
          sx={{
            width: [90, 120, 150, 180],
            height: [90, 120, 150, 180],
            transform: "translateY(-50%)",
            zIndex: 1000,
            cursor: "pointer",
            boxShadow: 5,
            ml: 1,
          }}
          onClick={() => handleClickAvatar()}
          src={avatar}
        >
          H
        </Avatar>
        <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>
          {exposeName ? exposeName : lang("input-your-place-name")}
        </Typography>
      </Stack>
    </Box>
  );
});

export default PlaceavatarAndImages;
