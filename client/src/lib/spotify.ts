const getAuthURL = async (username: string): Promise<string> => {
    try {
        const res = await fetch(`http://localhost:3000/api/spotify/auth?username=${username}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        return data.authURL;
    } catch (error) {
        console.error(error);
        throw new Error('Some error occured. Can\'t reach spotify auth page');
    }
};

export { getAuthURL };
