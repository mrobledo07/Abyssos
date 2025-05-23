import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import WalletAnalysis from "./pages/WalletAnalysis";
import TokenAnalysis from "./pages/TokenAnalysis";

function App() {
  return (
    <Box minH="100vh">
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet/:address" element={<WalletAnalysis />} />
          <Route path="/token/:address" element={<TokenAnalysis />} />
        </Routes>
      </MainLayout>
    </Box>
  );
}

export default App;
