import React, { useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useAppStore } from '../../store/dsStore'

// Denomination metadata
const DENOMS = [
  { value: 25, label: 'Quarter', symbol: '25¢', color: '#ffd700', bg: 'rgba(255,215,0,0.12)', border: '#ffd70066' },
  { value: 10, label: 'Dime',    symbol: '10¢', color: '#c0c0c0', bg: 'rgba(192,192,192,0.12)', border: '#c0c0c066' },
  { value:  5, label: 'Nickel',  symbol:  '5¢', color: '#cd7f32', bg: 'rgba(205,127,50,0.12)',  border: '#cd7f3266' },
  { value:  1, label: 'Penny',   symbol:  '1¢', color: '#b87333', bg: 'rgba(184,115,51,0.12)',  border: '#b8733366' },
]

export default function GreedyScene() {
  const target    = useAppStore(s => s.greedyTarget)
  const coinsUsed = useAppStore(s => s.greedyCoinsUsed)

  const currentSum = coinsUsed.reduce((a, v) => a + v, 0)
  const remaining  = target - currentSum
  const pct        = target > 0 ? Math.min((currentSum / target) * 100, 100) : 0
  const done       = remaining === 0 && target > 0

  // Count per denomination
  const counts = useMemo(() => {
    const map = { 25: 0, 10: 0, 5: 0, 1: 0 }
    coinsUsed.forEach(c => { if (map[c] !== undefined) map[c]++ })
    return map
  }, [coinsUsed])

  // Build the "selection" string for the current greedy step
  const lastCoin  = coinsUsed[coinsUsed.length - 1]

  if (target === 0) {
    return (
      <Html position={[0, 0, 0]} center className="pointer-events-none">
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(0,255,224,0.4)',
          fontSize: '16px',
          textAlign: 'center',
          padding: '32px 40px',
          border: '1px dashed rgba(0,255,224,0.2)',
          borderRadius: '16px',
          backdropFilter: 'blur(8px)',
        }}>
          Enter a target amount (e.g. 87)<br/>
          <span style={{ fontSize: '12px', opacity: 0.6 }}>then press CLIMB</span>
        </div>
      </Html>
    )
  }

  return (
    <Html
      position={[0, 1.5, 0]}
      style={{
        width: '520px',
        transform: 'translate(-50%, -65%)',
      }}
    >
      <div style={{
        width: '520px',
        maxHeight: 'calc(100vh - 230px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: 'JetBrains Mono, monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>

        {/* ── Header card ── */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid rgba(0,255,224,0.25)',
          borderRadius: '14px',
          padding: '14px 18px',
          backdropFilter: 'blur(16px)',
        }}>
          {/* Title */}
          <div style={{ color: 'rgba(0,255,224,0.5)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Greedy · Coin Change Algorithm
          </div>

          {/* Numbers row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>TARGET</div>
              <div style={{ color: '#ffffff', fontSize: '30px', fontFamily: 'Syne, sans-serif', fontWeight: 900, lineHeight: 1 }}>
                {target}<span style={{ fontSize: '13px', opacity: 0.5 }}>¢</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>USED</div>
              <div style={{ color: '#00ffe0', fontSize: '30px', fontFamily: 'Syne, sans-serif', fontWeight: 900, lineHeight: 1 }}>
                {currentSum}<span style={{ fontSize: '13px', opacity: 0.5 }}>¢</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>LEFT</div>
              <div style={{ color: done ? '#00ff88' : '#ff00ff', fontSize: '30px', fontFamily: 'Syne, sans-serif', fontWeight: 900, lineHeight: 1, transition: 'color 0.3s' }}>
                {remaining}<span style={{ fontSize: '13px', opacity: 0.5 }}>¢</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '8px',
            height: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: done
                ? 'linear-gradient(90deg, #00ff88, #00ffe0)'
                : 'linear-gradient(90deg, #00ffe0, #ff00ff)',
              borderRadius: '8px',
              transition: 'width 0.4s ease, background 0.4s ease',
              boxShadow: done ? '0 0 12px #00ff8888' : '0 0 12px #00ffe088',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
            <span>0</span>
            <span>{done ? '✓ EXACT CHANGE!' : `${Math.round(pct)}%`}</span>
            <span>{target}</span>
          </div>
        </div>

        {/* ── Denomination breakdown ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '10px',
        }}>
          {DENOMS.map(d => {
            const count  = counts[d.value] || 0
            const isActive = lastCoin === d.value
            return (
              <div key={d.value} style={{
                background: count > 0 ? d.bg : 'rgba(0,0,0,0.4)',
                border: `1.5px solid ${count > 0 ? d.border : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s',
                boxShadow: isActive ? `0 0 20px ${d.color}66` : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}>
                {/* Coin circle */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: count > 0 ? d.color : 'rgba(255,255,255,0.06)',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '12px',
                  color: count > 0 ? '#000' : 'rgba(255,255,255,0.2)',
                  boxShadow: count > 0 ? `0 0 10px ${d.color}88` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {d.symbol}
                </div>
                <div style={{ color: count > 0 ? d.color : 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  {d.label}
                </div>
                {/* Count badge */}
                <div style={{
                  background: count > 0 ? `${d.color}22` : 'transparent',
                  border: count > 0 ? `1px solid ${d.color}55` : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '2px 0',
                  color: count > 0 ? d.color : 'rgba(255,255,255,0.2)',
                  fontSize: count > 0 ? '20px' : '14px',
                  fontWeight: 900,
                  fontFamily: 'Syne, sans-serif',
                  lineHeight: 1,
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  {count > 0 ? `×${count}` : '—'}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Coin sequence receipt ── */}
        {coinsUsed.length > 0 && (
          <div style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '14px 18px',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.2em', marginBottom: '10px' }}>COINS SELECTED</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {coinsUsed.map((c, i) => {
                const d = DENOMS.find(x => x.value === c)
                return (
                  <div key={i} style={{
                    background: d?.bg,
                    border: `1px solid ${d?.border}`,
                    borderRadius: '6px',
                    padding: '3px 10px',
                    color: d?.color,
                    fontSize: '12px',
                    fontWeight: 700,
                  }}>
                    {d?.symbol}
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
              {coinsUsed.length} coin{coinsUsed.length !== 1 ? 's' : ''} total
            </div>
          </div>
        )}

        {/* Done banner */}
        {done && (
          <div style={{
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.4)',
            borderRadius: '12px',
            padding: '14px 18px',
            textAlign: 'center',
            color: '#00ff88',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize: '16px',
            letterSpacing: '0.15em',
            boxShadow: '0 0 20px rgba(0,255,136,0.2)',
          }}>
            ✓ OPTIMAL · {coinsUsed.length} COINS
          </div>
        )}
      </div>
    </Html>
  )
}
