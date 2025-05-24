import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import { FaShieldAlt, FaChartLine, FaRobot } from "react-icons/fa";

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <VStack
      p={6}
      bg={useColorModeValue("white", "gray.800")}
      rounded="xl"
      shadow="lg"
      spacing={4}
      align="start"
    >
      <Icon as={icon} w={8} h={8} color="brand.500" />
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue("gray.600", "gray.400")}>
        {description}
      </Text>
    </VStack>
  );
}

function Features() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Heading size="2xl" textAlign="center">
            Our Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={FaShieldAlt}
              title="Scam Detection"
              description="Advanced AI algorithms to identify potential scams and fraudulent activities in the crypto space."
            />
            <Feature
              icon={FaChartLine}
              title="Token Analysis"
              description="Comprehensive analysis of token contracts, liquidity, and trading patterns to assess legitimacy."
            />
            <Feature
              icon={FaRobot}
              title="Wallet Intelligence"
              description="Deep insights into wallet behavior, transaction patterns, and risk assessment."
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

export default Features;
