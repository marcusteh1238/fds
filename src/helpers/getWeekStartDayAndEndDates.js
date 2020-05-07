
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

module.exports = getWeekStartAndEndDates;
