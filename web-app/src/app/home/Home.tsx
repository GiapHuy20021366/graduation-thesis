import HomePage from "./HomePage";
import HomeViewerContextProvider from "./HomeViewerContext";

export default function Home() {
  return (
    <HomeViewerContextProvider>
      <HomePage />
    </HomeViewerContextProvider>
  );
}
