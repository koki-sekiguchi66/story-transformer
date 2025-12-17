import { VStack, Spinner, Text, Box } from '@chakra-ui/react'

export function Loading({ color = 'gray' }) {
  return (
    <Box bg="white" borderRadius="xl" p={8} shadow="sm">
      <VStack gap={4}>
        <Spinner size="lg" color={`${color}.500`} />
        <Text color="gray.600">AIが物語を生成中...</Text>
      </VStack>
    </Box>
  )
}