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
        backgroundImage: "url('/images/ava_red.webp')",
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
            "linear-gradient(135deg, rgba(255, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.95) 100%)",
          zIndex: -1,
        },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "#FFFFFF",
        textShadow:
          "4px 4px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 0, 0, 0.7), 0 0 30px rgba(255, 0, 0, 0.4)",
        fontWeight: "bold",
        background: "linear-gradient(to bottom right, #FF0000, #FF4444)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "wider",
        filter: "brightness(1.2)",
      },
    },
    Text: {
      baseStyle: {
        color: "#FFFFFF",
        textShadow:
          "3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.3)",
        background: "linear-gradient(to bottom right, #FF3333, #FF7777)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "brightness(1.1)",
      },
    },
    Link: {
      baseStyle: {
        color: "#FFFFFF",
        textShadow:
          "3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.3)",
        background: "linear-gradient(to bottom right, #FF3333, #FF7777)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "brightness(1.1)",
        _hover: {
          textDecoration: "none",
          filter: "brightness(1.3)",
        },
      },
    },
    Icon: {
      baseStyle: {
        color: "brand.500",
        filter: "drop-shadow(0 0 12px rgba(255, 0, 0, 0.7)) brightness(1.2)",
      },
    },
  },
});

export default theme;
