import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";

import { lazy, Suspense } from "react";
import ContentHolder from "../../common/viewer/holder/ContentHolder";
const Home = lazy(() => import("../../home/Home"));
const Place = lazy(() => import("../../place/Place"));
const Food = lazy(() => import("../../food/Food"));
const User = lazy(() => import("../../user/User"));
const Location = lazy(() => import("../../location/Location"));
const Conversation = lazy(() => import("../../conversation/Conversation"));
const Setting = lazy(() => import("../../setting/Setting"));

export default function AppMainCenter() {
  return (
    <Grid2 mobile={12} tablet={9} laptop={8} desktop={6} height="100%">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/home/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/place/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Place />
            </Suspense>
          }
        />
        <Route
          path="/food/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Food />
            </Suspense>
          }
        />
        <Route
          path="/user/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <User />
            </Suspense>
          }
        />
        <Route
          path="/location/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Location />
            </Suspense>
          }
        />
        <Route
          path="/conversation/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Conversation />
            </Suspense>
          }
        />

        <Route
          path="/setting/*"
          element={
            <Suspense fallback={<ContentHolder />}>
              <Setting />
            </Suspense>
          }
        />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Grid2>
  );
}
