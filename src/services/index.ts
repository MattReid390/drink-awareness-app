// Central export for all services
// Import from here rather than individual files throughout the app

export {
    saveAgeConfirmed,
    getAgeConfirmed,
    getAllDrinks,
    saveDrink,
    deleteDrink,
    getDailyLog,
    getWeeklyLog,
    saveWeeklyUnitGoal,
    getWeeklyUnitGoal,
    resetAllData,
} from './storage';

export {
    getDailyInsight,
    getWeeklyInsight,
} from './insights';

export type { Insight } from './insights';