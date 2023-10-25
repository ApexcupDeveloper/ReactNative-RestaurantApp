export const makeShort = (name, length) => {
    if(name && name.length > length) {
        return name.substring(0, length) + '...';
    } else {
        return name;
    }
}