const nodemailer = require("nodemailer");
const axios = require('axios')
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

let unCompleteTasks = []
let userEmailAddress = ''


const getUnCompletedTasks = async () => {
    const {data} = await axios.get(`http://localhost:3001/`)
    data.spaces.forEach(space => {
        space.lists.forEach(list => {
            list.tasks.forEach(task => {
                if (!task.complete) {
                    unCompleteTasks.push(task)
                }
            })
        })
    })
    await send_Mail()
}


exports.getUsers = async () => {
    const {data} = await axios.get('http://localhost:3001/users')
    data.users.forEach(user => {
        if (user.notification) {
            userEmailAddress = user.email
            getUnCompletedTasks()
            unCompleteTasks = []
        }
    })
}


const send_Mail = () => {

    return new Promise((resolve, reject) => {
        const Transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'befit208@gmail.com',
                pass: 'qvmxcgiwwpxlgqkz',
            }
        })


        Transport.use('compile', hbs({
            viewEngine: {
                extname: '.html',
                partialsDir: path.resolve('./views/'),
                defaultLayout: false
            },
            viewPath: path.resolve('./views/'),
            extname: '.handlebars'
        }))

        const emailOptions = {
            from: 'befit208@gmail.com',
            to: userEmailAddress,
            subject: 'Message from Task-Management Team',
            template: 'index',
            context: {
                title: 'Hello friend!!!',
                message: 'We are found that you have ',
                amount: unCompleteTasks.length.toString() + ' uncompleted tasks',
                tasksArray: unCompleteTasks
            }
        }


        Transport.sendMail(emailOptions, (err, info) => {
            if (err) {
                console.log(err)
                return reject({message: 'an error has accorded'})
            } else {
                console.log('message sent successfuly..')
                resolve({message: 'message sent successfuly..'})
            }
        })
    })
}
