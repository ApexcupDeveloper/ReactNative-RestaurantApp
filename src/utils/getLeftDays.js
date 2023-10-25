export const getLeftDays = (date) => {
    if (date) {
        const days = date.split(" ");
        const newDate = new Date(days[0]).getTime();
        const nowDate = new Date().getTime();
        if (newDate > nowDate) {
            let difference = newDate - nowDate;
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        } else {
            return 0
        }
    } else {
        return 0
    }
}