import {
  Box,
  Heading,
  Input,
  VStack,
  Container,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

function TokenAnalysis() {
  const [tokenAddress, setTokenAddress] = useState("");

  const handleAnalyze = () => {
    // TODO: Implementar la lógica de análisis
    console.log("Analizando token:", tokenAddress);
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" pt={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">
            Token Analysis
          </Heading>
          <VStack spacing={4} align="stretch" maxW="600px" mx="auto">
            <Input
              placeholder="Ingresa la dirección del token (0x...)"
              size="lg"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              bg="whiteAlpha.100"
              _hover={{ bg: "whiteAlpha.200" }}
              _focus={{ bg: "whiteAlpha.200" }}
            />
            <Button
              colorScheme="brand"
              size="lg"
              onClick={handleAnalyze}
              isDisabled={!tokenAddress}
            >
              Analizar Token
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default TokenAnalysis;
