const guidGenerator = () => {
    // Source: 'https://stackoverflow.com/a/6860916'
    const s4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
}

export { guidGenerator };
