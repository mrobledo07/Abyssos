import { Box, Heading, Text, VStack, Container } from "@chakra-ui/react";

function Home() {
  return (
    <Box minH="100vh" display="flex" justifyContent="center" pt={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">
            Welcome to Abyssos
          </Heading>
          <Text fontSize="xl" textAlign="center">
            AI-Powered Scam Detection on Avalanche
          </Text>
          <Text fontSize="lg" textAlign="center">
            Scroll down to learn more about our platform
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;
