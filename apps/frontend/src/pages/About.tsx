import { Box, Heading, Text, VStack, Container } from "@chakra-ui/react";

function About() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">
            About Abyssos
          </Heading>
          <Text fontSize="xl" textAlign="center">
            Abyssos is an AI-driven, on-chain intelligence platform designed to
            detect and evaluate potential crypto scams.
          </Text>
          <Text fontSize="lg" textAlign="center">
            Built on the Avalanche blockchain, Abyssos empowers users to analyze
            wallets, tokens, and crypto projects using an intelligent scoring
            system.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default About;
