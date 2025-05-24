import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const toast = useToast();

  // Función para conectar con Core Wallet
  const connectWallet = async () => {
    try {
      // Verificar si Core Wallet está instalado
      if (!window.avalanche) {
        toast({
          title: "Core Wallet no encontrado",
          description: "Por favor, instala Core Wallet para continuar",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Solicitar conexión
      const accounts = await window.avalanche.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);

        toast({
          title: "Wallet conectada",
          description: `Conectado a ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al conectar wallet:", error);
      toast({
        title: "Error al conectar",
        description: "No se pudo conectar con Core Wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Función para desconectar wallet
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet desconectada",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Box as="nav" bg="gray.800" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading
              size="md"
              as={RouterLink}
              to="/"
              _hover={{ textDecoration: "none" }}
            >
              Abyssos
            </Heading>
            <Stack direction="row" spacing={8} align="center">
              <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                Home
              </Link>
              <Link
                as={RouterLink}
                to="/analysis"
                _hover={{ textDecoration: "none" }}
              >
                Analysis
              </Link>
              <Button
                leftIcon={<FaWallet />}
                colorScheme={isWalletConnected ? "green" : "purple"}
                size="md"
                onClick={isWalletConnected ? disconnectWallet : connectWallet}
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 0 20px rgba(159, 122, 234, 0.5)",
                }}
                transition="all 0.2s"
              >
                {isWalletConnected ? "Disconnect" : "Connect Wallet"}
              </Button>
            </Stack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
}

// Añadir la declaración de tipos para window.avalanche
declare global {
  interface Window {
    avalanche: {
      request: (args: { method: string; params?: any[] }) => Promise<string[]>;
    };
  }
}

export default MainLayout;
