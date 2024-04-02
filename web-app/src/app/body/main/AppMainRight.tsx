import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function AppMainRight() {
  return (
    <Grid2
      mobile
      tablet
      laptop
      desktop
      display={["none", "block"]}
      sx={{ height: "100%" }}
      boxSizing={"border-box"}
    ></Grid2>
  );
}
