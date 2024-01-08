import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import FoodImagesContainer from "./FoodImagesContainer";
import { useState } from "react";
import { foodFetcher, FoodResponseError } from "../../../api";
import {
  useAuthContext,
  useFoodSharingFormContext,
  useI18nContext,
  useLoading,
  usePageProgessContext,
  useToastContext,
} from "../../../hooks";
import {
  DurationType,
  FoodCategory,
  toQuantityType,
  IFoodUploadData,
  convertDateToString,
  toTime,
  convertStringToDate,
} from "../../../data";
import { useNavigate } from "react-router";
import DescriptionEditor from "./DescriptionEditor";
import FoodCategoryPicker from "./FoodCategoryPicker";
import FoodMapPicker from "./FoodMapPicker";
import FoodSharingNavigator from "./FoodSharingNavigator";
import FoodPrice from "./FoodPrice";

const FormPage = {
  PAGE_FIRST: 0,
  PAGE_SECOND: 1,
  PAGE_SUBMIT: 2,
} as const;

const FormStepLable = {
  FIRST: "LABLE_FIRST",
  SECOND: "LABLE_SECOND",
  LAST: "LABLE_LAST",
} as const;

type FormStepLable = (typeof FormStepLable)[keyof typeof FormStepLable];

const steps: FormStepLable[] = [
  FormStepLable.FIRST,
  FormStepLable.SECOND,
  // FormStepLable.LAST,
];

export default function FoodSharingForm() {
  const formContext = useFoodSharingFormContext();
  const {
    images,
    categories,
    setCategories,
    duration,
    setDuration,
    location,
    price,
    quantity,
    setQuantity,
    title,
    setTitle,
    description,
  } = formContext;

  const [hover, setHover] = useState<number>(-1);
  const [durationType, setDurationType] = useState<DurationType>(
    DurationType.UNTIL_MIDNIGHT
  );
  const languageContext = useI18nContext();
  const lang = languageContext.of(FoodSharingForm, "Quantities", "Durations");
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const navigate = useNavigate();

  const callingApi = useLoading();
  const progess = usePageProgessContext();
  const toast = useToastContext();

  const handleCategoryPicked = (category: FoodCategory) => {
    const newCategories = [...categories, category];
    setCategories(newCategories);
  };

  const handleCategoryRemoved = (index: number) => {
    if (0 <= index && index < categories.length) {
      const cpyCategories = categories.slice();
      cpyCategories.splice(index, 1);
      setCategories(cpyCategories);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (callingApi.isActice) return;

    const imageUrls = images
      .filter((img) => img != null)
      .map((img) => img!.url);
    const durationInDate = convertStringToDate(duration);

    const foodUploadData: IFoodUploadData = {
      images: imageUrls,
      categories: categories,
      description: description,
      duration: durationInDate.getTime(),
      price: price,
      quantity: quantity,
      title: title,
      location: location,
    };
    console.log(foodUploadData);
    if (auth) {
      console.log(foodUploadData);
      callingApi.active();
      progess.start();

      foodFetcher
        .uploadFood(foodUploadData, auth)
        .then((data) => navigate(`/food/${data.data?._id}`, { replace: true }))
        .catch((error) => {
          const data = error?.data;
          if (data != null) {
            const foodErr = error as FoodResponseError;
            toast.error(foodErr.message);
          } else {
            toast.error("Server not response");
          }
        })
        .finally(() => {
          callingApi.deactive();
          progess.end();
        });
    }
  };

  const onDurationTypeSelectChange = (
    event: SelectChangeEvent<DurationType>
  ): void => {
    const type = event.target.value as DurationType;
    setDurationType(type);
    const time = toTime(type);
    setDuration(convertDateToString(time));
  };

  const onDurationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const value = event.target.value;
    setDuration(value);
    setDurationType(DurationType.CUSTOM);
  };

  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <Box
      component="form"
      noValidate
      sx={{
        mt: 3,
        width: ["100%", "80%", "60%", "50%"],
      }}
      onSubmit={(event) => onSubmit(event)}
    >
      <Box
        width="100%"
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 100,
          marginBottom: "1em",
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            width: "100%",
          }}
        >
          {steps.map((label, index) => {
            let mobileDisplay = "none";
            if (index === activeStep || index === activeStep + 1) {
              mobileDisplay = "block";
            }
            if (index === activeStep - 1 && activeStep === steps.length - 1) {
              mobileDisplay = "block";
            }
            return (
              <Step
                key={label}
                sx={{
                  display: [mobileDisplay, "block", "block", "block"],
                  cursor: "pointer",
                }}
                onClick={() => index < activeStep && setActiveStep(index)}
              >
                <StepLabel>{lang(label)}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <FoodSharingNavigator
          prev={{
            active: activeStep !== FormPage.PAGE_FIRST,
            onClick: () => setActiveStep(activeStep - 1),
          }}
          next={{
            active: activeStep !== FormPage.PAGE_SECOND,
            onClick: () => setActiveStep(activeStep + 1),
          }}
        />
      </Box>
      {activeStep === FormPage.PAGE_FIRST && (
        <Stack spacing={2}>
          <FoodImagesContainer maxPicked={8} />

          <TextField
            label={lang("l-title")}
            type="text"
            variant="standard"
            value={title}
            placeholder={lang("title-placeholder")}
            onChange={(event) => setTitle(event.target.value)}
          />

          <DescriptionEditor />

          <FoodMapPicker />

          <TextField
            label={lang("l-duration")}
            variant="standard"
            type="datetime-local"
            value={duration}
            onChange={(event) => onDurationChange(event)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Select
                    variant="standard"
                    disableUnderline={true}
                    displayEmpty={true}
                    fullWidth
                    value={durationType}
                    onChange={(event) => onDurationTypeSelectChange(event)}
                  >
                    <MenuItem value={DurationType.UNTIL_LUNCH}>
                      {lang("UNTIL_LUNCH")}
                    </MenuItem>
                    <MenuItem value={DurationType.UNTIL_MIDNIGHT}>
                      {lang("UNTIL_MIDNIGHT")}
                    </MenuItem>
                    <MenuItem value={DurationType.ONE_DAY}>
                      {lang("ONE_DAY")}
                    </MenuItem>
                    <MenuItem value={DurationType.TWO_DAYS}>
                      {lang("TWO_DAYS")}
                    </MenuItem>
                    <MenuItem value={DurationType.THREE_DAYS}>
                      {lang("THREE_DAYS")}
                    </MenuItem>
                    <MenuItem value={DurationType.CUSTOM}>
                      {lang("CUSTOM")}
                    </MenuItem>
                  </Select>
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            sx={{
              borderBottom: "1px solid #bdbdbd",
              borderRadius: "4px",
              width: "100%",
              boxSizing: "border-box",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <Box component="h4" mr={1}>
              {lang("l-quantity")}:
            </Box>
            <Stack direction="row" alignItems="center">
              <Rating
                value={quantity}
                onChange={(_event, newValue) => {
                  setQuantity(newValue || 1);
                }}
                onChangeActive={(_event, newHover) => {
                  setHover(newHover);
                }}
                sx={{
                  width: "fit-content",
                }}
                size="medium"
              />
              <Box sx={{ ml: 2 }}>
                {lang(toQuantityType(hover !== -1 ? hover : quantity))}
              </Box>
            </Stack>
          </Stack>
        </Stack>
      )}

      {activeStep === FormPage.PAGE_SECOND && (
        <Stack spacing={2}>
          <FoodCategoryPicker
            categories={categories}
            onPicked={handleCategoryPicked}
            onRemoved={handleCategoryRemoved}
          />

          <FoodPrice />

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginBottom: "1em",
            }}
            fullWidth
          >
            {lang("share-now")}
          </Button>
        </Stack>
      )}

      {/* {activeStep === FormPage.PAGE_SUBMIT && (
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginBottom: "1em",
          }}
          fullWidth
        >
          Share now!
        </Button>
      )} */}
    </Box>
  );
}
