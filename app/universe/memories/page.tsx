'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useUniverseStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Memory {
  id: string
  title: string
  content: string
  memory_type: string
  mood: string
  created_at: string
  is_favorite: boolean
}

const memoryTypes = [
  { type: 'moment', icon: '✨', label: 'Special Moment' },
  { type: 'date', icon: '💕', label: 'Date Night' },
  { type: 'adventure', icon: '🌟', label: 'Adventure' },
  { type: 'milestone', icon: '🎉', label: 'Milestone' },
  { type: 'silly', icon: '😂', label: 'Silly Memory' },
  { type: 'deep', icon: '💭', label: 'Deep Talk' },
]

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMemory, setNewMemory] = useState({ title: '', content: '', type: 'moment' })
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const { currentUser, addDiscovery } = useUniverseStore()
  const supabase = createClient()

  useEffect(() => {
    fetchMemories()
    addDiscovery('entered-memory-forest')
  }, [])

  const fetchMemories = async () => {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setMemories(data)
    setLoading(false)
  }

  const addMemory = async () => {
    if (!newMemory.title || !currentUser?.id) return

    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: currentUser.id,
        title: newMemory.title,
        content: newMemory.content,
        memory_type: newMemory.type,
      })
      .select()
      .single()

    if (data && !error) {
      setMemories([data, ...memories])
      setNewMemory({ title: '', content: '', type: 'moment' })
      setShowAddModal(false)
      addDiscovery('first-memory-planted')
    }
  }

  const toggleFavorite = async (memory: Memory) => {
    await supabase
      .from('memories')
      .update({ is_favorite: !memory.is_favorite })
      .eq('id', memory.id)

    setMemories(memories.map(m => 
      m.id === memory.id ? { ...m, is_favorite: !m.is_favorite } : m
    ))
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4">
      {/* Forest header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.span
          className="text-6xl inline-block mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌲
        </motion.span>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          Memory Forest
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Each memory is a tree in our forest. Plant new ones and watch our forest grow.
        </p>
      </motion.div>

      {/* Add memory button */}
      <div className="max-w-4xl mx-auto mb-8">
        <motion.button
          className="w-full glass rounded-2xl p-6 border border-green-500/30 flex items-center justify-center gap-4 hover:bg-green-500/10 transition-colors"
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-3xl">🌱</span>
          <span className="text-lg font-semibold text-green-400">Plant a New Memory</span>
        </motion.button>
      </div>

      {/* Memory trees grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              className="text-4xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🌲
            </motion.div>
          </div>
        ) : memories.length === 0 ? (
          <motion.div
            className="text-center py-20 glass rounded-3xl border border-green-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-6xl">🌱</span>
            <h3 className="text-xl font-semibold text-foreground mt-4">Your forest is empty</h3>
            <p className="text-muted-foreground mt-2">Plant your first memory tree!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                className="glass rounded-2xl p-6 border border-green-500/20 cursor-pointer relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedMemory(memory)}
              >
                {/* Tree icon based on type */}
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                >
                  {memoryTypes.find(t => t.type === memory.memory_type)?.icon || '🌲'}
                </motion.div>

                {/* Favorite star */}
                <button
                  className="absolute top-4 right-4 text-2xl"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(memory)
                  }}
                >
                  {memory.is_favorite ? '⭐' : '☆'}
                </button>

                <h3 className="text-lg font-semibold text-foreground mb-2">{memory.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{memory.content}</p>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(memory.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                    {memoryTypes.find(t => t.type === memory.memory_type)?.label}
                  </span>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    boxShadow: '0 0 40px rgba(34, 197, 94, 0.2)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="glass rounded-3xl p-8 max-w-md w-full border border-green-500/30"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                <span className="text-3xl mr-2">🌱</span>
                Plant a Memory
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Memory Title</label>
                  <Input
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    placeholder="What do you want to remember?"
                    className="bg-white/5 border-green-500/30"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tell the story</label>
                  <textarea
                    value={newMemory.content}
                    onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                    placeholder="Describe this memory..."
                    className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-green-500/30 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Memory Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {memoryTypes.map((type) => (
                      <button
                        key={type.type}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                          newMemory.type === type.type
                            ? 'bg-green-500/30 border-green-500'
                            : 'bg-white/5 hover:bg-white/10'
                        } border border-transparent`}
                        onClick={() => setNewMemory({ ...newMemory, type: type.type })}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-xs text-muted-foreground">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                    onClick={addMemory}
                    disabled={!newMemory.title}
                  >
                    Plant Memory 🌲
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Memory Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              className="glass rounded-3xl p-8 max-w-lg w-full border border-green-500/30"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <motion.span
                  className="text-6xl inline-block"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {memoryTypes.find(t => t.type === selectedMemory.memory_type)?.icon || '🌲'}
                </motion.span>
              </div>

              <h2 className="text-2xl font-bold text-center text-foreground mb-4">
                {selectedMemory.title}
              </h2>

              <p className="text-muted-foreground text-center leading-relaxed">
                {selectedMemory.content || 'No description added yet.'}
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedMemory.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <button
                  className="text-2xl"
                  onClick={() => toggleFavorite(selectedMemory)}
                >
                  {selectedMemory.is_favorite ? '⭐' : '☆'}
                </button>
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => setSelectedMemory(null)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
