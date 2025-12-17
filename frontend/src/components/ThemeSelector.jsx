import { SimpleGrid, Button, Text, VStack } from '@chakra-ui/react'
import { THEMES } from '../config'

export function ThemeSelector({ selectedTheme, onSelect }) {
  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="sm" fontWeight="medium" color="gray.600">
        テーマを選択
      </Text>
      <SimpleGrid columns={2} gap={3}>
        {THEMES.map((theme) => (
          <Button
            key={theme.id}
            variant={selectedTheme === theme.id ? 'solid' : 'outline'}
            colorPalette={theme.color}
            height="auto"
            py={4}
            onClick={() => onSelect(theme.id)}
          >
            <VStack gap={1}>
              <Text fontSize="2xl">{theme.icon}</Text>
              <Text fontWeight="bold">{theme.name}</Text>
            </VStack>
          </Button>
        ))}
      </SimpleGrid>
    </VStack>
  )
}