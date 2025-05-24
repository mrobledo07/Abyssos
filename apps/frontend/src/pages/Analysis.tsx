import {
  Box,
  Heading,
  Input,
  VStack,
  Container,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

function Analysis() {
  const [input, setInput] = useState("");

  const handleAnalyze = () => {
    // TODO: Implement analysis logic
    console.log("Analyzing:", input);
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" pt={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">
            Blockchain Analysis
          </Heading>
          <VStack spacing={4} align="stretch" maxW="600px" mx="auto">
            <Input
              placeholder="Enter a wallet address (0x...), transaction hash, or token name"
              size="lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              bg="whiteAlpha.100"
              _hover={{ bg: "whiteAlpha.200" }}
              _focus={{ bg: "whiteAlpha.200" }}
            />
            <Button
              colorScheme="brand"
              size="lg"
              onClick={handleAnalyze}
              isDisabled={!input}
            >
              Analyze
            </Button>
            <Text fontSize="sm" textAlign="center" color="whiteAlpha.700">
              Analyze wallets, transactions, or tokens to detect potential scams
              and evaluate their legitimacy
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default Analysis;
