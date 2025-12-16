import { motion } from 'framer-motion'
import { CardContent, Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { expertLLMApi } from '@/services/api'

const PetExpert = () => {
  const [question, setQuestion] = useState('猫咪晚上总是乱跑抓挠家具，怎么办？')
  const [answer, setAnswer] = useState('')
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const res = await expertLLMApi.askQuestion(question)
      setAnswer(res.answer || '')
      setMeta({ device: res.device, modelDir: res.model_dir, latencyMs: res.latency_ms })
    } catch (e) {
      setError(e.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 pt-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay:'2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay:'4s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <motion.h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            🧑‍⚕️ 宠物专家询问
          </motion.h1>
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto font-light">针对猫狗的行为、训练、健康与安全提出问题，获得专业建议</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="h-full border border-teal-500/30 bg-slate-800/80 backdrop-blur-lg shadow-2xl shadow-teal-500/20">
              <CardHeader>
                <CardTitle className="text-teal-300 text-xl">提问</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="请输入你的宠物问题…"
                  className="w-full h-40 bg-black/30 text-teal-200 border border-teal-400/30 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <div className="mt-4">
                  <Button onClick={handleAsk} disabled={loading} className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full">
                    {loading ? '思考中…' : '提交问题'}
                  </Button>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">{error}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="h-full border border-purple-500/30 bg-slate-800/80 backdrop-blur-lg shadow-2xl shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-300 text-xl">专家回答</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-teal-500/30 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-teal-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-teal-200">大模型正在生成回答…</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-purple-200 whitespace-pre-wrap break-words min-h-[128px]">{answer || '请在左侧输入问题并提交'}</div>
                    {meta && (
                      <div className="p-3 bg-black/30 rounded-lg border border-purple-400/30 text-sm text-purple-200">
                        <div>设备: {meta.device}</div>
                        <div>模型: {meta.modelDir}</div>
                        <div>延迟: {meta.latencyMs} ms</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PetExpert
