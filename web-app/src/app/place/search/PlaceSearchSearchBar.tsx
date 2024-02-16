import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  StackProps,
  TextField,
  Tooltip,
} from "@mui/material";
import { SearchOutlined, TuneOutlined } from "@mui/icons-material";
import { useI18nContext, usePlaceSearchContext } from "../../../hooks";
import PlaceSearchFilter from "./PlaceSearchFilter";

type PlaceSearchSearchBarProps = StackProps;

const PlaceSearchSearchBar = React.forwardRef<
  HTMLDivElement,
  PlaceSearchSearchBarProps
>((props, ref) => {
  const [options, setOptions] = useState<string[]>([]);
  const searchContext = usePlaceSearchContext();
  const { query, setQuery, doSearchQuery } = searchContext;
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const i18nContext = useI18nContext();
  const lang = i18nContext.of(PlaceSearchSearchBar);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setQuery(value);
    // Do search place suggestion
    if (value.trim().length > 0) {
      setOptions([value]);
    } else {
      setOptions([]);
    }
  };

  const handleSearchQueryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ): void => {
    if (value) {
      setQuery(value);
      doSearchQuery(value, { refresh: true });
    }
  };

  const onButtonSearchClick = () => {
    doSearchQuery(query, { refresh: true });
  };

  // Focus on first time
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <Stack
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <Autocomplete
        freeSolo
        fullWidth
        options={options}
        inputValue={query}
        value={query}
        onInputChange={handleSearchInputChange}
        onChange={handleSearchQueryChange}
        getOptionLabel={(option) => option}
        sx={{
          width: ["100%", "90%", "80%"],
        }}
        renderOption={(props, option) => (
          <ListItem disablePadding {...props} key={option}>
            <ListItemIcon>
              <SearchOutlined />
            </ListItemIcon>
            <ListItemText primary={option} />
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            inputRef={searchInputRef}
            {...params}
            margin="normal"
            variant="outlined"
            placeholder={lang("place-search-placeholder")}
            InputProps={{
              ...params.InputProps,
              style: {
                borderRadius: 40,
                paddingLeft: "1em",
                margin: "auto",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">
                    <Tooltip title={lang("l-search")}>
                      <IconButton
                        color="info"
                        onClick={() => onButtonSearchClick()}
                      >
                        <SearchOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={lang("l-advance-search")}
                      onClick={() => setOpenFilter(true)}
                    >
                      <IconButton color="info">
                        <TuneOutlined />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
      />

      {/* Filter */}
      <PlaceSearchFilter
        openFilter={openFilter}
        onCloseFilter={() => setOpenFilter(false)}
      />
    </Stack>
  );
});

export default PlaceSearchSearchBar;
