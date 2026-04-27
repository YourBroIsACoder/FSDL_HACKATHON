import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'

const LANGUAGES = [
  { id: 'c++', compiler: 'g132', name: 'C++ (GCC 13.2)', default: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello AlgoReef!" << endl;\n  return 0;\n}' },
  { id: 'java', compiler: 'java21', name: 'Java (JDK 21)', default: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello AlgoReef!");\n  }\n}' },
  { id: 'python', compiler: 'python311', name: 'Python (3.11)', default: 'print("Hello AlgoReef!")' },
]

export default function CodeSandboxPanel() {
  const visible = useAppStore(s => s.sandboxVisible)
  const toggle = useAppStore(s => s.toggleSandbox)
  
  const [langIdx, setLangIdx] = useState(0)
  const [code, setCode] = useState(LANGUAGES[0].default)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    setLoading(true)
    setOutput('Compiling & Running on Compiler Explorer...')
    try {
      const lang = LANGUAGES[langIdx];
      const response = await fetch(`https://godbolt.org/api/compiler/${lang.compiler}/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          source: code,
          options: {
            userArguments: "",
            executeParameters: { args: "", stdin: "" },
            compilerOptions: { executorRequest: true },
            filters: { execute: true },
            tools: []
          },
          lang: lang.id,
          allowStoreCodeDebug: true
        })
      })
      
      const data = await response.json()
      
      let outStr = '';
      if (data.buildResult && data.buildResult.stderr && data.buildResult.stderr.length > 0) {
          outStr += data.buildResult.stderr.map(x => x.text).join('\n') + '\n';
      }
      if (data.stderr && data.stderr.length > 0) {
          outStr += data.stderr.map(x => x.text).join('\n') + '\n';
      }
      if (data.stdout && data.stdout.length > 0) {
          outStr += data.stdout.map(x => x.text).join('\n');
      }

      setOutput(outStr || 'Process exited with no output.')
      
    } catch (err) {
      setOutput('Error connecting to code execution server (Godbolt API).')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-y-0 right-0 z-[450] w-[500px] max-w-full bg-var(--bg-panel-solid) border-l border-var(--border-strong) flex flex-col shadow-2xl"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        style={{ background: 'var(--bg-panel-solid)', borderLeft: '1px solid var(--border-strong)' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-var(--border) flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-var(--text) font-['Syne']">Code Sandbox</h2>
            <p className="text-[10px] text-var(--accent) font-bold tracking-widest uppercase">Live Implementation</p>
          </div>
          <button onClick={toggle} className="text-var(--text-dim) hover:text-var(--text)">✕</button>
        </div>

        {/* Language Selector */}
        <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar">
          {LANGUAGES.map((l, i) => (
            <button
              key={l.id}
              onClick={() => { setLangIdx(i); setCode(l.default) }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${langIdx === i ? 'bg-var(--accent) text-var(--bg)' : 'bg-var(--btn-bg) text-var(--text-dim)'}`}
              style={{ background: langIdx === i ? 'var(--accent)' : 'var(--btn-bg)', color: langIdx === i ? 'var(--bg)' : 'var(--text-dim)' }}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-6 rounded-2xl border font-['JetBrains_Mono'] text-sm outline-none resize-none selection:bg-var(--accent)/30"
            spellCheck={false}
            style={{ 
              backgroundColor: 'var(--btn-bg)', 
              color: 'var(--text)',
              borderColor: 'var(--border)'
            }}
          />
          
          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full py-4 bg-var(--accent) text-var(--bg) rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {loading ? 'EXECUTING...' : 'RUN CODE ▶'}
          </button>
        </div>

        {/* Console - Always Dark Terminal Style */}
        <div className="h-48 bg-[#0a0a0f] p-6 font-['JetBrains_Mono'] overflow-y-auto border-t border-var(--border-strong)">
          <div className="text-[10px] text-[#00ffe0] mb-2 uppercase tracking-widest font-bold">Console Output</div>
          <pre className="text-sm text-white whitespace-pre-wrap opacity-90">{output}</pre>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
