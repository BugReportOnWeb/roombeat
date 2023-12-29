type MembersProps = {
    members: string[]
}

const Members = ({ members }: MembersProps) => {
    return (
        <div>
            <h1>Joined Members:</h1>
            {members.map((member, index) => (
                <h1 key={index}>{member}</h1>
            ))}
            <hr />
        </div>
    )
}

export default Members;
