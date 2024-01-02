import { useContext } from "react"
import { UsernameContext } from "../../context/UsernameContext"
import { UsernameContextType } from "../../types/context"

type MembersProps = {
    members: string[]
}

const Members = ({ members }: MembersProps) => {
    const { username } = useContext(UsernameContext) as UsernameContextType;

    return (
        <div className='text-center min-w-fit'>
            <h1 className='font-bold text-3xl mb-4'>Joined Members</h1>
            {members.map((member, index) => (
                <div key={index}>
                    <h1 className='text-left' >
                        {member}{' '}
                        {member === username && <span className='font-extralight text-xs'>(You)</span>}
                    </h1>
                    <div className='border border-[#27272A] mt-1 mb-2'></div>
                </div>
            ))}
        </div>
    )
}

export default Members;
