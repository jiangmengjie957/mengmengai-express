const configs = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'jmj123456',
        database: 'ai-database',
        port: 3306
    },
    log: {
        error (message: string) {
            console.log('[Knex error]', message)
        }
    }
}

export default configs