import { Alert } from '@chakra-ui/react'

export function ErrorMessage({ message }) {
  if (!message) return null

  return (
    <Alert.Root status="error" borderRadius="md" mb={4}>
      <Alert.Indicator />
      <Alert.Title>{message}</Alert.Title>
    </Alert.Root>
  )
}