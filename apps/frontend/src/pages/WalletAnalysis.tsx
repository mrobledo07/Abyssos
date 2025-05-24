import {
  Box,
  Heading,
  Input,
  VStack,
  Container,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

function WalletAnalysis() {
  const [walletAddress, setWalletAddress] = useState("");

  const handleAnalyze = () => {
    // TODO: Implementar la lógica de análisis
    console.log("Analizando wallet:", walletAddress);
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" pt={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">
            Wallet Analysis
          </Heading>
          <VStack spacing={4} align="stretch" maxW="600px" mx="auto">
            <Input
              placeholder="Ingresa la dirección de la wallet (0x...)"
              size="lg"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              bg="whiteAlpha.100"
              _hover={{ bg: "whiteAlpha.200" }}
              _focus={{ bg: "whiteAlpha.200" }}
            />
            <Button
              colorScheme="brand"
              size="lg"
              onClick={handleAnalyze}
              isDisabled={!walletAddress}
            >
              Analizar Wallet
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default WalletAnalysis;
