import { useState } from 'react'
import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react'
import { THEMES } from './config'
import { useTransform } from './hooks/useTransform'
import {
  ThemeSelector,
  TextInput,
  Loading,
  ResultDisplay,
  ErrorMessage,
} from './components'

function App() {
  const [text, setText] = useState('')
  const [theme, setTheme] = useState('')
  const { result, loading, error, transform, reset } = useTransform()

  const selectedTheme = THEMES.find((t) => t.id === theme)
  const canSubmit = text.trim() && theme && !loading

  const handleSubmit = (e) => {
    e.preventDefault()
    if (canSubmit) {
      transform(text, theme)
    }
  }

  const handleReset = () => {
    reset()
    setText('')
    setTheme('')
  }

  // ローディング中
  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="container.sm">
          <Loading color={selectedTheme?.color} />
        </Container>
      </Box>
    )
  }

  // 結果表示
  if (result) {
    return (
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="container.sm">
          <ResultDisplay result={result} onReset={handleReset} />
        </Container>
      </Box>
    )
  }

  // 入力フォーム
  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.sm">
        <VStack gap={8}>
          <VStack textAlign="center">
            <Heading size="xl">Story Transformer</Heading>
            <Text color="gray.600">AIがテキストを物語に変換します</Text>
          </VStack>

          <Box bg="white" borderRadius="xl" p={6} shadow="sm" w="100%">
            <form onSubmit={handleSubmit}>
              <VStack gap={6} align="stretch">
                <ErrorMessage message={error} />
                <ThemeSelector selectedTheme={theme} onSelect={setTheme} />
                <TextInput value={text} onChange={setText} />
                <Button
                  type="submit"
                  colorPalette={selectedTheme?.color || 'gray'}
                  size="lg"
                  disabled={!canSubmit}
                >
                  変換する
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default App