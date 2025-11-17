import React from 'react'

interface FuntionalButtonProps {
    name: string
    handleClick: () => void
}

const FunctionalButton: React.FC<FuntionalButtonProps> = ({ name, handleClick, }) => {
    return (
        <button
            className='px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 hover:scale-105'
            onClick={handleClick}
        >
            {name}
        </button>

    )
}

export default FunctionalButton
