import { Box, Container, Flex, Heading, Link, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
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
              🛡️ Abyssos
            </Heading>
            <Stack direction="row" spacing={8}>
              <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                Home
              </Link>
              <Link
                as={RouterLink}
                to="/wallet/0x..."
                _hover={{ textDecoration: "none" }}
              >
                Wallet Analysis
              </Link>
              <Link
                as={RouterLink}
                to="/token/0x..."
                _hover={{ textDecoration: "none" }}
              >
                Token Analysis
              </Link>
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

export default MainLayout;
