import { VStack, Text, Textarea } from '@chakra-ui/react'

export function TextInput({ value, onChange, maxLength = 2000 }) {
  const isOverLimit = value.length > maxLength

  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="sm" fontWeight="medium" color="gray.600">
        変換するテキスト
      </Text>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="いつ・どこで・誰が・何をした...など"
        minHeight="120px"
        resize="vertical"
      />
      <Text
        fontSize="xs"
        color={isOverLimit ? 'red.500' : 'gray.500'}
        textAlign="right"
      >
        {value.length} / {maxLength}
      </Text>
    </VStack>
  )
}