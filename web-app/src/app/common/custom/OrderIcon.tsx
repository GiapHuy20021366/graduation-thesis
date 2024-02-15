import { ArrowUpward, ArrowDownward, ImportExport } from "@mui/icons-material";
import { OrderState } from "../../../data";

interface IOrderIconProps {
  order?: OrderState;
}

export default function OrderIcon({ order }: IOrderIconProps) {
  if (order === OrderState.INCREASE) return <ArrowUpward />;
  if (order === OrderState.DECREASE) return <ArrowDownward />;
  if (order === OrderState.NONE) return <ImportExport />;
  return <ImportExport />;
}
