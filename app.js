const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const cron = require('node-cron')
require('./db/mongoConnect')

const app = express()

const PORT = 3001 | process.env.PORT


app.use(express.json())
app.use(cookieParser())
app.use(cors())


app.set('views', path.join(__dirname, 'views'));

const {routesInit} = require('./routers/configRouters/config')
routesInit(app)

const {getUsers} = require('./routers/scheduleEmails')

cron.schedule('59 23 * * *',async () => {
   await getUsers()
})

app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})
