import { API_BASE } from '../config'

export async function transformText(text, themeId) {
  const response = await fetch(`${API_BASE}/transform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, theme_id: themeId }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || '変換に失敗しました')
  }

  return response.json()
}