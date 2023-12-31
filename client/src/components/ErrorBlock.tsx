type ErrorBlockProp = {
    error: string
}

const ErrorBlock = ({ error }: ErrorBlockProp) => {
    return (
        <p className='text-[0.8rem] font-medium text-[#7f1d1d]'>{error}</p>
    )
}

export default ErrorBlock;
