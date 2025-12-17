import { Box, HStack, Text, Button, VStack } from '@chakra-ui/react'
import { THEMES } from '../config'

export function ResultDisplay({ result, onReset }) {
  const theme = THEMES.find((t) => t.id === result.theme_id)
  const colorPalette = theme?.color || 'gray'

  const handleCopy = () => {
    navigator.clipboard.writeText(result.transformed)
  }

  return (
    <VStack align="stretch" gap={4}>
      <Box borderRadius="xl" overflow="hidden" shadow="sm">
        <HStack bg={`${colorPalette}.500`} color="white" px={4} py={3} gap={2}>
          <Text fontSize="xl">{theme?.icon}</Text>
          <Text fontWeight="bold">{result.theme_name}</Text>
        </HStack>
        <Box bg="white" p={6} whiteSpace="pre-wrap" lineHeight="tall">
          {result.transformed}
        </Box>
      </Box>

      <HStack gap={2}>
        <Button variant="outline" onClick={handleCopy}>
          コピー
        </Button>
        <Button colorPalette="gray" onClick={onReset}>
          もう一度
        </Button>
      </HStack>
    </VStack>
  )
}