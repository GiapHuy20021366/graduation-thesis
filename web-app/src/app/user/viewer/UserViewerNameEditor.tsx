import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { userFetcher } from "../../../api";
import {
  useAuthContext,
  useI18nContext,
  useLoader,
  useToastContext,
  useUserViewerContext,
} from "../../../hooks";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormValues {
  firstName: string;
  lastName: string;
  exposedName: string;
}

type UserViewerNameEditorProps = DialogProps & {
  onCancel?: () => void;
  onSuccess?: (avatar: IFormValues) => void;
};

const UserViewerNameEditor = React.forwardRef<
  HTMLDivElement,
  UserViewerNameEditorProps
>((props, ref) => {
  const { onCancel, onSuccess, ...rest } = props;
  const authContext = useAuthContext();
  const { auth } = authContext;
  const loader = useLoader();
  const viewerContext = useUserViewerContext();
  const {
    _id,
    firstName: viewerFirstName,
    lastName: viewerLastName,
    exposedName: viewerExposedName,
    setFirstName: setViewerFirstName,
    setLastName: setViewerLastName,
    setExposedName: setViewerExposedName,
  } = viewerContext;

  const languageContext = useI18nContext();
  const lang = languageContext.of("SignUpForm");
  const toast = useToastContext();

  const dirtyRef = useRef<boolean>(false);

  const formSchema = yup.object({
    firstName: yup.string().required(lang("require-firstname")),
    lastName: yup.string().required(lang("require-lastname")),
    exposedName: yup.string().required(lang("require-exposedName")),
  });

  const form = useForm<IFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      exposedName: "",
    },
    resolver: yupResolver(formSchema),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    if (props.open) {
      if (dirtyRef.current === true) {
        return;
      } else {
        form.setValue("firstName", viewerFirstName);
        form.setValue("lastName", viewerLastName);
        form.setValue("exposedName", viewerExposedName);
      }
    } else {
      dirtyRef.current = false;
    }
  }, [form, props.open, viewerExposedName, viewerFirstName, viewerLastName]);

  const handleOnClickCancel = () => {
    onCancel && onCancel();
  };

  const onSubmit = (values: IFormValues) => {
    const { firstName, lastName, exposedName } = values;
    const isFirstNameChanged = firstName !== viewerFirstName;
    const isLastNameChanged = lastName !== viewerLastName;
    const isExposedNameChanged = exposedName !== viewerLastName;
    if (!isFirstNameChanged && !isLastNameChanged && !isExposedNameChanged) {
      onSuccess &&
        onSuccess({
          firstName,
          lastName,
          exposedName,
        });
      return;
    }
    if (auth == null) return;

    loader.setIsError(false);
    loader.setIsFetching(true);

    userFetcher
      .updatePersonalData(
        _id,
        {
          updated: {
            firstName: firstName != viewerFirstName ? firstName : undefined,
            lastName: lastName != viewerLastName ? lastName : undefined,
            exposedName:
              exposedName != viewerExposedName ? exposedName : undefined,
          },
        },
        auth
      )
      .then(() => {
        onSuccess &&
          onSuccess({
            firstName,
            lastName,
            exposedName,
          });
        isFirstNameChanged && setViewerFirstName(firstName);
        isLastNameChanged && setViewerLastName(lastName);
        isExposedNameChanged && setViewerExposedName(exposedName);
      })
      .catch(() => {
        loader.setIsError(true);
        toast.error(lang("cannot-action-now"));
      })
      .finally(() => {
        loader.setIsFetching(false);
      });
  };

  return (
    <Dialog
      ref={ref}
      {...rest}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle sx={{ p: 2 }}>{lang("edit")}</DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Stack
          gap={2}
          flex={1}
          sx={{
            minWidth: ["78vw", "60vw", "50vw", "40vw"],
            height: "100%",
          }}
          alignItems={"center"}
          p={1}
        >
          <TextField
            label={lang("l-firstname")}
            type="text"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
          />
          <TextField
            label={lang("l-lastname")}
            type="lastName"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
          />
          <TextField
            label={lang("l-exposedname")}
            type="text"
            {...register("exposedName")}
            error={!!errors.exposedName}
            helperText={errors.exposedName?.message}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleOnClickCancel}
          disabled={loader.isFetching}
        >
          {lang("cancel")}
        </Button>
        <Button
          color="success"
          variant="contained"
          disabled={loader.isFetching}
          type="submit"
        >
          {lang("agree")}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserViewerNameEditor;
