import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <Box minH="100vh" position="relative" zIndex={1}>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={
              <Box>
                <Home />
                <Features />
                <About />
              </Box>
            }
          />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </MainLayout>
    </Box>
  );
}

export default App;
