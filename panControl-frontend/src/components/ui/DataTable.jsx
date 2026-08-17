import React from 'react'

/**
 * Props:
 *  columns: [{ key, label, align? }]
 *  rows: array de objetos — valores podem ser string, number ou ReactNode
 *  selectedId: key da linha selecionada
 *  onSelect: fn(row)
 *  rowKey: campo usado como chave (default: 'id')
 */
export default function DataTable({ columns, rows, selectedId, onSelect, rowKey = 'id' }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden pan-scroll overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            {columns.map(col => (
              <th key={col.key}
                className={`px-4 py-3 font-bold text-gray-800 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
          {rows.map((row, i) => {
            const isSelected = selectedId !== undefined && row[rowKey] === selectedId
            return (
              <tr key={row[rowKey] ?? i} onClick={() => onSelect?.(row)}
                className={[
                  'cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-yellow-50 border-l-4 border-gold'
                    : i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100',
                ].join(' ')}
              >
                {columns.map(col => {
                  const val = row[col.key]
                  return (
                    <td key={col.key}
                      className={`px-4 py-3 text-gray-700 ${col.align === 'right' ? 'text-right' : ''}`}>
                      {React.isValidElement(val) ? val : (val ?? '')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
