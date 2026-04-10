import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { deleteImage } from '../lib/imageUtils'

export function useFoods() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFoods = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setFoods(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchFoods()
  }, [fetchFoods])

  const addFood = async (food) => {
    const { data, error } = await supabase
      .from('foods')
      .insert([food])
      .select()
    if (!error && data) {
      setFoods((prev) => [data[0], ...prev])
    }
    return { data, error }
  }

  const updateFood = async (id, updates) => {
    const { data, error } = await supabase
      .from('foods')
      .update(updates)
      .eq('id', id)
      .select()
    if (!error && data) {
      setFoods((prev) => prev.map((f) => (f.id === id ? data[0] : f)))
    }
    return { data, error }
  }

  const deleteFood = async (id) => {
    const target = foods.find((f) => f.id === id)
    const { error } = await supabase.from('foods').delete().eq('id', id)
    if (!error) {
      if (target?.image_url) await deleteImage(target.image_url)
      setFoods((prev) => prev.filter((f) => f.id !== id))
    }
    return { error }
  }

  const shuffleFoods = () => {
    setFoods((prev) => {
      const arr = [...prev]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    })
  }

  return { foods, loading, addFood, updateFood, deleteFood, shuffleFoods, refetch: fetchFoods }
}
