import cron from 'node-cron'

const scheduleHealthScoreCron = () => {
    cron.schedule('0 0 * * *', () => {
        console.log('This message logs every 24 hours')
    })
}

export default scheduleHealthScoreCron
