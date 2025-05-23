import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
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

function Home() {
  return (
    <Box>
      <VStack spacing={8} align="center" textAlign="center" mb={12}>
        <Heading size="2xl">🛡️ Abyssos</Heading>
        <Text fontSize="xl" color="gray.400" maxW="2xl">
          AI-Powered Scam Detection on Avalanche. Analyze wallets, tokens, and
          crypto projects using intelligent scoring and decentralized analysis
          reports.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        <Feature
          icon={FaShieldAlt}
          title="AI-Powered Detection"
          description="Advanced AI algorithms analyze on-chain and off-chain data to identify potential scams and security risks."
        />
        <Feature
          icon={FaChartLine}
          title="Smart Risk Scoring"
          description="Get detailed risk scores and insights for any wallet or token on the Avalanche network."
        />
        <Feature
          icon={FaRobot}
          title="Decentralized Reports"
          description="Analysis reports are stored on-chain as NFTs, ensuring transparency and user ownership."
        />
      </SimpleGrid>
    </Box>
  );
}

export default Home;
