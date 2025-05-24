import {
  Box,
  Heading,
  Input,
  VStack,
  Container,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  IconButton,
  Textarea,
  Flex,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FaRobot, FaExpand } from "react-icons/fa";

interface AnalysisData {
  address: string;
  score: number;
  risk_level: string;
  risk_tags: string[];
  wallet_profile: {
    wallet_age_days: number;
    tx_count: number;
    contract_deploys: number;
    token_mints: number;
    interacted_with_known_rug: boolean;
  };
  contract_profile: {
    has_mint_function: boolean;
    is_verified: boolean;
    owner_controls_minting: boolean;
    can_pause_contract: boolean;
  };
  social_sentiment: string;
  timestamp: string;
}

function Analysis() {
  const [input, setInput] = useState(
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  );
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const exampleAnalysis: AnalysisData = {
    address: "0xabc123...def456",
    score: 28,
    risk_level: "high",
    risk_tags: [
      "new_wallet",
      "can_mint_tokens",
      "unverified_contract",
      "multiple_deploys",
      "unknown_creator",
    ],
    wallet_profile: {
      wallet_age_days: 3,
      tx_count: 74,
      contract_deploys: 5,
      token_mints: 2,
      interacted_with_known_rug: true,
    },
    contract_profile: {
      has_mint_function: true,
      is_verified: false,
      owner_controls_minting: true,
      can_pause_contract: true,
    },
    social_sentiment: "negative",
    timestamp: "2025-05-24T14:00:00Z",
  };

  const checkPreviousAnalysis = (address: string) => {
    const storedAnalysis = localStorage.getItem(`analysis_${address}`);
    if (storedAnalysis) {
      return JSON.parse(storedAnalysis) as AnalysisData;
    }
    return null;
  };

  const storeAnalysis = (address: string, analysis: AnalysisData) => {
    localStorage.setItem(`analysis_${address}`, JSON.stringify(analysis));
  };

  const handleAnalyze = () => {
    const previousAnalysis = checkPreviousAnalysis(input);

    if (previousAnalysis) {
      setCurrentAnalysis(previousAnalysis);
      setShowConfirmDialog(true);
    } else {
      performAnalysis();
    }
  };

  const performAnalysis = () => {
    setIsLoading(true);
    setIsTableModalOpen(true);
    setChatMessages([]);
    setChatInput("");

    setTimeout(() => {
      setIsLoading(false);
      setAnalysisComplete(true);
      setCurrentAnalysis(exampleAnalysis);
      localStorage.removeItem(`analysis_${input}`);
      storeAnalysis(input, exampleAnalysis);
    }, 3000);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm analyzing the data and will provide insights about this wallet's risk profile. What specific aspect would you like to know more about?",
        },
      ]);
    }, 1000);

    setChatInput("");
  };

  const handleDigDeeper = () => {
    setIsChatModalOpen(true);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
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

      <AlertDialog
        isOpen={showConfirmDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => setShowConfirmDialog(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Previous Analysis Found
            </AlertDialogHeader>

            <AlertDialogBody>
              This wallet has been analyzed before. Would you like to use the
              previous analysis or perform a new one?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setIsTableModalOpen(true);
                  setAnalysisComplete(true);
                }}
                ml={3}
              >
                Use Previous
              </Button>
              <Button
                colorScheme="brand"
                onClick={() => {
                  setShowConfirmDialog(false);
                  performAnalysis();
                }}
                ml={3}
              >
                New Analysis
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          maxW="xl"
          transition="all 0.3s ease-in-out"
          position="relative"
          left={isChatModalOpen ? "-25%" : "auto"}
        >
          <ModalHeader>
            <HStack spacing={4}>
              <Text>Analysis Results</Text>
              {analysisComplete && !isChatModalOpen && (
                <Button
                  leftIcon={<FaRobot />}
                  colorScheme="purple"
                  size="md"
                  onClick={handleDigDeeper}
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "0 0 20px rgba(159, 122, 234, 0.5)",
                  }}
                  transition="all 0.2s"
                >
                  Dig Deeper
                </Button>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {isLoading ? (
              <VStack spacing={4} py={4}>
                <Spinner size="xl" color="brand.500" />
                <Text>Analyzing blockchain data...</Text>
              </VStack>
            ) : (
              <Box overflowY="auto" maxH="70vh">
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th color="white">Parameter</Th>
                      <Th color="white">Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Address</Td>
                      <Td>{currentAnalysis?.address}</Td>
                    </Tr>
                    <Tr>
                      <Td>Risk Score</Td>
                      <Td>
                        <Badge
                          colorScheme={getRiskColor(
                            currentAnalysis?.risk_level || ""
                          )}
                        >
                          {currentAnalysis?.score}/100
                        </Badge>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Risk Level</Td>
                      <Td>
                        <Badge
                          colorScheme={getRiskColor(
                            currentAnalysis?.risk_level || ""
                          )}
                        >
                          {currentAnalysis?.risk_level.toUpperCase()}
                        </Badge>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Wallet Age</Td>
                      <Td>
                        {currentAnalysis?.wallet_profile.wallet_age_days} days
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Transaction Count</Td>
                      <Td>{currentAnalysis?.wallet_profile.tx_count}</Td>
                    </Tr>
                    <Tr>
                      <Td>Contract Deploys</Td>
                      <Td>
                        {currentAnalysis?.wallet_profile.contract_deploys}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Token Mints</Td>
                      <Td>{currentAnalysis?.wallet_profile.token_mints}</Td>
                    </Tr>
                    <Tr>
                      <Td>Interacted with Known Rug</Td>
                      <Td>
                        {currentAnalysis?.wallet_profile
                          .interacted_with_known_rug
                          ? "Yes"
                          : "No"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Contract Verified</Td>
                      <Td>
                        {currentAnalysis?.contract_profile.is_verified
                          ? "Yes"
                          : "No"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Can Mint Tokens</Td>
                      <Td>
                        {currentAnalysis?.contract_profile.has_mint_function
                          ? "Yes"
                          : "No"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Owner Controls Minting</Td>
                      <Td>
                        {currentAnalysis?.contract_profile
                          .owner_controls_minting
                          ? "Yes"
                          : "No"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Can Pause Contract</Td>
                      <Td>
                        {currentAnalysis?.contract_profile.can_pause_contract
                          ? "Yes"
                          : "No"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Social Sentiment</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            currentAnalysis?.social_sentiment === "negative"
                              ? "red"
                              : "green"
                          }
                        >
                          {currentAnalysis?.social_sentiment.toUpperCase()}
                        </Badge>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Analysis Date</Td>
                      <Td>
                        {new Date(
                          currentAnalysis?.timestamp || ""
                        ).toLocaleString()}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          maxW="xl"
          position="absolute"
          left="50%"
          transition="all 0.3s ease-in-out"
        >
          <ModalHeader>
            <HStack spacing={4}>
              <Text>AI Assistant</Text>
              <Button
                colorScheme="red"
                size="md"
                onClick={() => setIsChatModalOpen(false)}
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
                }}
                transition="all 0.2s"
              >
                Minimize
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box display="flex" flexDirection="column" h="70vh">
              <Box flex="1" overflowY="auto" mb={4}>
                {chatMessages.map((msg, index) => (
                  <Box
                    key={index}
                    bg={
                      msg.role === "user" ? "whiteAlpha.200" : "whiteAlpha.100"
                    }
                    p={3}
                    borderRadius="md"
                    mb={2}
                    ml={msg.role === "user" ? "auto" : 0}
                    mr={msg.role === "user" ? 0 : "auto"}
                    maxW="80%"
                  >
                    <HStack spacing={2} mb={1}>
                      {msg.role === "assistant" && <FaRobot />}
                      <Text fontWeight="bold">
                        {msg.role === "user" ? "You" : "AI Assistant"}
                      </Text>
                    </HStack>
                    <Text>{msg.content}</Text>
                  </Box>
                ))}
              </Box>
              <HStack>
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about the analysis..."
                  size="sm"
                  resize="none"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChat();
                    }
                  }}
                />
                <IconButton
                  aria-label="Send message"
                  icon={<FaRobot />}
                  onClick={handleChat}
                  colorScheme="brand"
                />
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Analysis;
