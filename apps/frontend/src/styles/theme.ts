import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#FFF5F5",
      100: "#FED7D7",
      200: "#FEB2B2",
      300: "#FC8181",
      400: "#F56565",
      500: "#E53E3E",
      600: "#C53030",
      700: "#9B2C2C",
      800: "#822727",
      900: "#63171B",
    },
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  styles: {
    global: {
      html: {
        height: "100%",
      },
      body: {
        minHeight: "100vh",
        bg: "gray.900",
        color: "white",
        backgroundImage: "url('/images/ava_space.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)",
          zIndex: -1,
        },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "#FFFFFF",
        textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        fontWeight: "bold",
        letterSpacing: "wider",
      },
    },
    Text: {
      baseStyle: {
        color: "#FFFFFF",
        textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
      },
    },
    Link: {
      baseStyle: {
        color: "#FFFFFF",
        textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
        _hover: {
          textDecoration: "none",
          textShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
        },
      },
    },
    Icon: {
      baseStyle: {
        color: "#FFFFFF",
        filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
      },
    },
  },
});

export default theme;
