
function getWeekStartAndEndDates(dateInWeek) {
    const todayDate = new Date(dateInWeek);
    const dayInt = todayDate.getDay();
    const dateInt = todayDate.getDate();
    const weekStartInt = dateInt - dayInt;
    const weekStart = new Date(todayDate.setDate(weekStartInt));
    weekEndDay = weekStart.getDate() + 7;
    const weekEnd = new Date(new Date(weekStart).setDate(weekEndDay));
    return [weekStart, weekEnd].map((date) => new Date(date.toDateString()));
}

function getMonthStartAndEndDates(dateInMonth) {
    const date = new Date(dateInMonth);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return [firstDay, lastDay]
}

module.exports = {
    getWeekStartAndEndDates,
    getMonthStartAndEndDates
}
