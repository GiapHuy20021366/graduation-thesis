import { usePlaceEditContext } from "../../../hooks";
import DescriptionEditor from "../../common/custom/DescriptionEditor";

export default function PlaceDescriptionEditor() {
  const form = usePlaceEditContext();
  const { description, setDescription } = form;

  return (
    <DescriptionEditor
      description={description ?? ""}
      setDescription={(html) => setDescription(html)}
    />
  );
}
