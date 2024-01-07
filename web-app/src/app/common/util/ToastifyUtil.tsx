import { useMediaQuery, useTheme } from "@mui/material";
import { ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { breakPoints } from "../../../themes";
import { useEffect, useState } from "react";

export default function ToastifyUtil() {
  const [pos, setPos] = useState<ToastPosition>("bottom-right");
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up(breakPoints.tablet));
  useEffect(() => {
    if (isNotMobile) {
      setPos("top-right");
    } else {
      setPos("bottom-right");
    }
  }, [isNotMobile]);

  return (
    <ToastContainer
      position={pos}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
