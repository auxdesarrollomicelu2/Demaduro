import { useCallback, useEffect, useState } from 'react'

export type LoadStatus = 'loading' | 'error' | 'success'

export function useAsyncData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')

  const reload = useCallback(() => {
    setStatus('loading')
    loader()
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch((error) => {
        console.error('Error cargando datos:', error)
        setStatus('error')
      })
  }, [loader])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, status, reload }
}
