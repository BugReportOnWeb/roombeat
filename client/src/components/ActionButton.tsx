type ActionButtonProps = {
    className: string;
}

// TODO: Use of generics here for state and all
// Unused till time
const ActionButton = ({ className }: ActionButtonProps) => {
    return (
        <input
            type='text'
            placeholder='Username'
            className={`${className} bg-transparent border border-[#272731] px-3.5 py-2.5 text-sm rounded-lg placeholder-[#A1A1AA] outline-none text-sm`}
        />
    )
}

export default ActionButton;
