import { useFoodSharingFormContext } from "../../../hooks";
import DescriptionEditor from "../../common/custom/DescriptionEditor";

export default function FoodDescriptionEditor() {
  const form = useFoodSharingFormContext();
  const { description, setDescription } = form;

  return (
    <DescriptionEditor
      description={description}
      setDescription={(html) => setDescription(html)}
    />
  );
}
