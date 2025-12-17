import { useState } from 'react'
import { transformText } from '../services/api'

export function useTransform() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const transform = async (text, themeId) => {
    setLoading(true)
    setError('')
    try {
      const data = await transformText(text, themeId)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError('')
  }

  return { result, loading, error, transform, reset }
}