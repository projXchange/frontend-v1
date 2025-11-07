interface LoadingNumberProps {
    value: number | string
    isLoading?: boolean
    className?: string
}

const LoadingNumber = ({ value, isLoading = false, className = "" }: LoadingNumberProps) => {
    if (isLoading) {
        return (
            <span 
                className={`${className} inline-block`}
                style={{
                    animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    opacity: 0.4
                }}
            >
                {typeof value === 'number' || !isNaN(Number(value)) ? 0 : '...'}
            </span>
        )
    }

    return <span className={className}>{value}</span>
}

export default LoadingNumber
