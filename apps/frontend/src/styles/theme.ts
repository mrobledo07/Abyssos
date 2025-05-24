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
        /*"&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: -1,
        },*/
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "#FF0000",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        fontWeight: "bold",
        background: "linear-gradient(to bottom right, #FF0000, #990000)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    Text: {
      baseStyle: {
        color: "#FF3333",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
        background: "linear-gradient(to bottom right, #FF3333, #990000)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    Icon: {
      baseStyle: {
        color: "brand.500",
      },
    },
  },
});

export default theme;
