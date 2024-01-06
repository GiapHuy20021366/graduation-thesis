import { Container, Drawer, Stack } from "@mui/material";

interface IFoodSearchCondition {
  isActive: boolean;
  onClose: () => void;
}

export default function FoodSearchFilter({
  isActive,
  onClose,
}: IFoodSearchCondition) {
  return (
    <Container>
      <Drawer anchor="right" open={isActive} onClose={onClose}>
        <Container
          sx={{
            width: ["80vw", "40vw", "30vw", "20vw"],
            height: "100vh",
          }}
        >
          <Stack direction="row">
            Filter
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}
