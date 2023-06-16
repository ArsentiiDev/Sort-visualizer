import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Heading,
  Flex,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import Main from "./Main"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl" overflowY="hidden" overflowX="hidden">
      <Box h="100vh"  p={3}>
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
          <Heading size={"2xl"} mb="3rem">
            Sort visualizer
          </Heading>
          <Main/>
      </Box>
    </Box>
  </ChakraProvider>
)
