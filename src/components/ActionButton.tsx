import React, { type ReactInstance, type ReactNode } from 'react'

interface ActionButton {
  action: React.MouseEventHandler<HTMLButtonElement>
  label: string | ReactNode
  nestedStyles?: string
  disable?: boolean
}

export default function ActionButton({action, label, nestedStyles, disable = false}: ActionButton) {
  return (
    <button
        className={`bg-theme-gold text-theme-blue border-2 border-theme-blue shadow-[2px_2px_0px_#2A3858] px-2 py-1 rounded-2xl cursor-pointer w-auto font-bold ${nestedStyles} ${disable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all'}`}
        type="button"
        onClick={action}
        disabled={disable}
      >
        {label}
      </button>
  )
}1