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
  List,
  ListItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaExpand,
  FaHistory,
  FaDownload,
  FaEye,
  FaWallet,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { analyzeContract } from "@abyssos/blockchain-sdk";

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
    "0xde3A24028580884448a5397872046a019649b084"
  );
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();
  const [analysisHistory, setAnalysisHistory] = useState<
    Array<{
      address: string;
      analysis: AnalysisData;
      chat: Array<{ role: "user" | "assistant"; content: string }>;
      timestamp: string;
    }>
  >([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const toast = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPreviousAnalysis = (address: string) => {
    // Primero verificar en el historial
    const history = JSON.parse(
      localStorage.getItem("analysis_history") || "[]"
    );
    const previousAnalysis = history.find(
      (item: any) => item.address === address
    );

    if (previousAnalysis) {
      return previousAnalysis.analysis;
    }

    // Si no está en el historial, verificar en el almacenamiento individual
    const storedAnalysis = localStorage.getItem(`analysis_${address}`);
    if (storedAnalysis) {
      return JSON.parse(storedAnalysis) as AnalysisData;
    }

    return null;
  };

  const storeAnalysis = (address: string, analysis: AnalysisData) => {
    const timestamp = new Date().toISOString();
    const historyItem = {
      address,
      analysis,
      chat: chatMessages,
      timestamp,
    };

    // Save to history
    const existingHistory = JSON.parse(
      localStorage.getItem("analysis_history") || "[]"
    );
    const existingIndex = existingHistory.findIndex(
      (item: any) => item.address === address
    );

    if (existingIndex !== -1) {
      existingHistory[existingIndex] = historyItem;
    } else {
      existingHistory.unshift(historyItem);
    }

    localStorage.setItem("analysis_history", JSON.stringify(existingHistory));
    setAnalysisHistory(existingHistory);

    // Save individually as well
    localStorage.setItem(`analysis_${address}`, JSON.stringify(analysis));
  };

  const performAnalysis = async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsTableModalOpen(true);
      setAnalysisComplete(false);

      // Perform real analysis using our SDK
      const analysisData = await analyzeContract(address);

      // Store the analysis
      storeAnalysis(address, analysisData);

      // Update state
      setCurrentAnalysis(analysisData);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Completed",
        description: "Contract analysis has been completed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error analyzing contract:", error);
      setError(
        error instanceof Error ? error.message : "Failed to analyze contract"
      );
      toast({
        title: "Analysis Error",
        description:
          error instanceof Error ? error.message : "Failed to analyze contract",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRiskTags = (factors: any): string[] => {
    const tags: string[] = [];

    if (factors.ageScore < 10) tags.push("new_wallet");
    if (factors.riskPenalty > 15) tags.push("risky_interactions");
    if (factors.mintingPenalty < 0) tags.push("can_mint_tokens");
    if (factors.verificationBonus === 0) tags.push("unverified_contract");
    if (factors.ownerControlPenalty < 0) tags.push("owner_controls_minting");
    if (factors.pauseContractPenalty < 0) tags.push("can_pause_contract");
    if (factors.rugPoolPenalty < 0) tags.push("rug_pool_interaction");

    return tags;
  };

  const handleAnalyze = () => {
    const previousAnalysis = checkPreviousAnalysis(input);

    if (previousAnalysis) {
      setShowConfirmDialog(true);
    } else {
      performAnalysis(input);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !currentAnalysis) return;

    // Add user message
    const userMessage = { role: "user" as const, content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch(
        "https://llm.chutes.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer cpk_ce89ceb6867a481f8909e06e3ebf4a92.9cbd21fdce06559abc33312355e06bcd.y295y5uCV1OC4i3CGjjoiIk9Fllwc9Kj`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-ai/DeepSeek-V3-0324",
            messages: [
              {
                role: "system",
                content: `You are a blockchain analysis assistant specialized in detecting potential scams and security risks. 
              
Current Analysis Data:
${JSON.stringify(currentAnalysis, null, 2)}

Scoring System Explanation:
The trust score is calculated based on the following factors:
- Age Score (max 20 points): Based on wallet age in days
- Transaction Score (max 30 points): Based on transaction volume
- Risk Penalty (max -30 points): Based on interactions with risky contracts
- Contract Verification Bonus (max 15 points): If the contract is verified
- Minting Penalty (max -10 points): If the contract can mint tokens
- Owner Control Penalty (max -5 points): If owner controls minting
- Pause Contract Penalty (max -5 points): If contract can be paused
- Token Mint Penalty (max -20 points): Based on amount of tokens minted
- Rug Pool Penalty (max -15 points): If interacted with known rug pools

Risk Levels:
- Low Risk: Score > 66
- Medium Risk: Score between 33 and 66
- High Risk: Score < 33

Your task is to:
1. Analyze the provided data and explain the risk level
2. Highlight specific risk factors and their implications
3. Provide clear explanations about why certain factors are concerning
4. Suggest what additional information might be needed
5. Keep responses focused on security and risk assessment
6. Use the scoring system to explain why the project might be risky

Remember to be direct but professional in your analysis.`,
              },
              ...chatMessages,
              userMessage,
            ],
            stream: true,
            max_tokens: 1024,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      let assistantMessage = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              assistantMessage += content;

              // Update the last message with the new content
              setChatMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === "assistant") {
                  lastMessage.content = assistantMessage;
                } else {
                  newMessages.push({
                    role: "assistant",
                    content: assistantMessage,
                  });
                }
                return newMessages;
              });
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting to the AI service. Please try again later.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
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

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isChatModalOpen) {
          setIsChatModalOpen(false);
        } else if (isTableModalOpen) {
          setIsTableModalOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isTableModalOpen, isChatModalOpen]);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("analysis_history") || "[]"
    );
    setAnalysisHistory(history);
  }, []);

  useEffect(() => {
    if (currentAnalysis && chatMessages.length > 0) {
      storeAnalysis(currentAnalysis.address, currentAnalysis);
    }
  }, [chatMessages]);

  const downloadAnalysis = async (historyItem: (typeof analysisHistory)[0]) => {
    const zip = new JSZip();

    // Añadir el análisis
    zip.file("analysis.json", JSON.stringify(historyItem.analysis, null, 2));

    // Añadir el chat
    zip.file("chat.json", JSON.stringify(historyItem.chat, null, 2));

    // Generar y descargar el zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(
      content,
      `analysis_${historyItem.address}_${new Date(historyItem.timestamp).toISOString().split("T")[0]}.zip`
    );
  };

  const loadAnalysis = (historyItem: (typeof analysisHistory)[0]) => {
    setCurrentAnalysis(historyItem.analysis);
    setChatMessages(historyItem.chat || []);
    setInput(historyItem.address);
    setIsTableModalOpen(true);
    setAnalysisComplete(true);
    onHistoryClose();
  };

  // Function to connect with Core Wallet
  const connectWallet = async () => {
    try {
      // Check if Core Wallet is installed
      if (!window.avalanche) {
        toast({
          title: "Core Wallet not found",
          description: "Please install Core Wallet to continue",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Request connection
      const accounts = await window.avalanche.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        // Don't set input automatically

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to Core Wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    // Don't clear input when disconnecting
    toast({
      title: "Wallet Disconnected",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteAnalysis = (index: number) => {
    const newHistory = [...analysisHistory];
    const deletedAnalysis = newHistory[index];
    newHistory.splice(index, 1);
    setAnalysisHistory(newHistory);
    localStorage.setItem("analysis_history", JSON.stringify(newHistory));

    // Eliminar el análisis individual del localStorage
    localStorage.removeItem(`analysis_${deletedAnalysis.address}`);

    setShowDeleteDialog(false);
    setAnalysisToDelete(null);
  };

  const clearAllHistory = () => {
    // Eliminar todos los análisis individuales del localStorage
    analysisHistory.forEach((item) => {
      localStorage.removeItem(`analysis_${item.address}`);
    });

    setAnalysisHistory([]);
    localStorage.removeItem("analysis_history");
    setShowClearAllDialog(false);
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

      <Button
        position="fixed"
        bottom="20px"
        right="20px"
        leftIcon={<FaHistory />}
        colorScheme="purple"
        onClick={onHistoryOpen}
        _hover={{
          transform: "scale(1.05)",
          boxShadow: "0 0 20px rgba(159, 122, 234, 0.5)",
        }}
        transition="all 0.2s"
      >
        Analysis History
      </Button>

      <Modal isOpen={isHistoryOpen} onClose={onHistoryClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>
            <HStack justify="space-between" align="center">
              <Text>Analysis History</Text>
              {analysisHistory.length > 0 && (
                <Button
                  leftIcon={<FaTrash />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => setShowClearAllDialog(true)}
                  mr={8}
                >
                  Clear All
                </Button>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <List spacing={3}>
              {analysisHistory.map((item, index) => (
                <ListItem
                  key={index}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  borderColor="whiteAlpha.200"
                >
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{item.address}</Text>
                      <Text fontSize="sm" color="whiteAlpha.600">
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Button
                        leftIcon={<FaEye />}
                        size="sm"
                        onClick={() => loadAnalysis(item)}
                      >
                        View Analysis
                      </Button>
                      <Button
                        leftIcon={<FaDownload />}
                        size="sm"
                        onClick={() => downloadAnalysis(item)}
                      >
                        Download
                      </Button>
                      <Button
                        leftIcon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setAnalysisToDelete(index);
                          setShowDeleteDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>

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
              This contract has been analyzed before. Would you like to use the
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
                  setCurrentAnalysis(checkPreviousAnalysis(input));
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
                  performAnalysis(input);
                }}
                ml={3}
              >
                New Analysis
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={showDeleteDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setShowDeleteDialog(false);
          setAnalysisToDelete(null);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Analysis
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this analysis? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setShowDeleteDialog(false);
                  setAnalysisToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() =>
                  analysisToDelete !== null && deleteAnalysis(analysisToDelete)
                }
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={showClearAllDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => setShowClearAllDialog(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear All History
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete all analysis history? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setShowClearAllDialog(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={clearAllHistory} ml={3}>
                Clear All
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {isTableModalOpen && (
        <>
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={999}
            transition="all 0.3s ease-in-out"
          />
          <Box
            position="fixed"
            top="50%"
            left={isChatModalOpen ? "25%" : "50%"}
            transform="translate(-50%, -50%)"
            zIndex={1000}
            bg="gray.800"
            maxW="xl"
            w="full"
            borderRadius="md"
            boxShadow="xl"
            transition="all 0.3s ease-in-out"
          >
            <Box p={4} borderBottomWidth={1} borderColor="whiteAlpha.200">
              <HStack justify="space-between" align="center">
                <HStack spacing={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Analysis Results
                  </Text>
                  {analysisComplete && !isLoading && !isChatModalOpen && (
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
                <IconButton
                  aria-label="Close analysis"
                  icon={<FaTimes />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsTableModalOpen(false)}
                  _hover={{
                    bg: "whiteAlpha.200",
                  }}
                />
              </HStack>
            </Box>
            <Box p={6}>
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
            </Box>
          </Box>
        </>
      )}

      {isChatModalOpen && (
        <Box
          position="fixed"
          top="50%"
          left="75%"
          transform="translate(-50%, -50%)"
          zIndex={1001}
          bg="gray.800"
          maxW="xl"
          w="full"
          borderRadius="md"
          boxShadow="xl"
          transition="all 0.3s ease-in-out"
        >
          <Box p={4} borderBottomWidth={1} borderColor="whiteAlpha.200">
            <HStack spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                AI Assistant
              </Text>
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
          </Box>
          <Box p={6}>
            <Box display="flex" flexDirection="column" h="70vh">
              <Box
                flex="1"
                overflowY="auto"
                mb={4}
                css={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "24px",
                  },
                }}
              >
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
                    {msg.role === "assistant" ? (
                      <Box className="markdown-content">
                        <ReactMarkdown
                          components={{
                            code: ({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }: any) => {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                            p: ({ children }) => <Text mb={2}>{children}</Text>,
                            ul: ({ children }) => (
                              <Box as="ul" pl={4} mb={2}>
                                {children}
                              </Box>
                            ),
                            ol: ({ children }) => (
                              <Box as="ol" pl={4} mb={2}>
                                {children}
                              </Box>
                            ),
                            li: ({ children }) => (
                              <Box as="li" mb={1}>
                                {children}
                              </Box>
                            ),
                            h1: ({ children }) => (
                              <Heading size="lg" mb={2}>
                                {children}
                              </Heading>
                            ),
                            h2: ({ children }) => (
                              <Heading size="md" mb={2}>
                                {children}
                              </Heading>
                            ),
                            h3: ({ children }) => (
                              <Heading size="sm" mb={2}>
                                {children}
                              </Heading>
                            ),
                            blockquote: ({ children }) => (
                              <Box
                                as="blockquote"
                                pl={4}
                                borderLeft="4px solid"
                                borderColor="gray.500"
                                mb={2}
                              >
                                {children}
                              </Box>
                            ),
                            a: ({ children, href }) => (
                              <Text
                                as="a"
                                href={href}
                                color="blue.400"
                                textDecoration="underline"
                                _hover={{ color: "blue.300" }}
                              >
                                {children}
                              </Text>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </Box>
                    ) : (
                      <Text>{msg.content}</Text>
                    )}
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
                  isDisabled={isChatLoading}
                />
                <IconButton
                  aria-label="Send message"
                  icon={<FaRobot />}
                  onClick={handleChat}
                  colorScheme="brand"
                  isLoading={isChatLoading}
                  isDisabled={isChatLoading}
                />
              </HStack>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Add type declaration for window.avalanche
declare global {
  interface Window {
    avalanche: {
      request: (args: { method: string; params?: any[] }) => Promise<string[]>;
    };
  }
}

export default Analysis;
