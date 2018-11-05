const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const parseExcel = require('./parseExcel')
const session = require('express-session')



app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static(__dirname + '/public'))

let room = []
let object = {curPeople: 0}
let people = []
let num = 16
for(let i = 0;i<51;i++){
  room.push('room' + i)
  people.push(object)
}
console.log(room)
let a = 0
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/roomList', (req, res) => {
  res.render('roomList')
})
app.get('/room/:roomId', (req, res) => {
  num = req.params.roomId
  if(people[num].curPeople<2){
    people[num].curPeople++
    console.log('people : ' + people[num].curPeople)
    res.render('chat')
    let Excel = parseExcel(__dirname + '/public/excel/lesson' + num + '.xlsx')
    Excel.then(parsed => {
      let questlength = parsed.length
      let stage = 0
      let Users = [{ name: '' }, { name: '' }]
      let Answer = parsed[0][0]
      let Question = parsed[0][1]
      console.log('Question ' + Question)
      questlength = parsed.length

      io.on('connection', (socket) => {
        console.log('connection')
        socket.on('disconnect', (name) => {
          socket.leave(room[num], () => {
            console.log(name + ' leave a ' + room[num])
            io.to(room[num]).emit('leaveRoom', num, name)
          })
          if (people[num].curPeople > 0) { people[num].curPeople-- }
          console.log('people : ' + people[num].curPeople)
        })

        socket.on('joinRoom', (name) => {
          socket.join(room[num], () => {
            console.log(name + ' join a ' + room[num])
            io.to(room[num]).emit('joinRoom', num, name, Question)
            socket.emit('setIdNum', people[num].curPeople)
            Users[people[num].curPeople - 1].name = name
            console.log(Users)
          })
          console.log('people: ' + people[num].curPeople)
        })

        socket.on('chat message', (num, name, msg, idNum) => {
          a = num
          io.to(room[a]).emit('chat message', name, msg)
          console.log(num)
          console.log('idNum : ' + idNum)
          if (people[num].curPeople === 2) {
            if (msg === Answer) {
              stage += 1
              Answer = parsed[stage][0]

              console.log('you correct')
              Question = parsed[stage][1]
              io.to(room[a]).emit('correct')
              if (idNum === 1) {
                io.to(room[a]).emit('firstCorrect', Question)
              } else {
                io.to(room[a]).emit('secondCorrect', Question)
              }
            } else {
              io.to(room[a]).emit('wrong')
            }
          }
        })
      })
    })
  } else {
    res.render('F')
  }
})


// const Excel = parseExcel(__dirname + '/public/excel/lesson' + num + '.xlsx')
// Excel.then(parsed => {
//   let questlength = parsed.length
//   let stage = 0
//   let Users = [{ name: '' }, { name: '' }]
//   let Answer = parsed[0][0]
//   let Question = parsed[0][1]
//   console.log('Question ' + Question)

//   questlength = parsed.length
//   console.log(questlength)
//   console.log(parsed)
//   const firstQuestion = parsed[0][1]
//   console.log(firstQuestion)

//   io.on('connection', (socket) => {
//     socket.on('disconnect', (num, name) => {
//       socket.leave(room[num], () => {
//         console.log(name + ' leave a ' + room[num])
//         io.to(room[num]).emit('leaveRoom', num, name)
//         if (people > 0) { people-- }
//         console.log('people : ' + people)
//       })
//     })

//     socket.on('joinRoom', (num, name) => {
//       socket.join(room[num], () => {
//         console.log(name + ' join a ' + room[num])
//         io.to(room[num]).emit('joinRoom', num, name, firstQuestion)
//         socket.emit('setIdNum', people)
//         Users[people - 1].name = name
//         console.log(Users)
//       })
//       console.log('people: ' + people)
//     })

//     socket.on('chat message', (num, name, msg, idNum) => {
//       a =
//       io.to(room[a]).emit('chat message', name, msg)
//       console.log('idNum : ' + idNum)
//       if (people === 2) {
//         if (msg === Answer) {
//           stage += 1
//           Answer = parsed[stage][0]

//           console.log('you correct')
//           let NextQuestion = parsed[stage][1]
//           io.to(room[a]).emit('correct')
//           if (idNum === 1) {
//             io.to(room[a]).emit('firstCorrect', NextQuestion)
//           } else {
//             io.to(room[a]).emit('secondCorrect', NextQuestion)
//           }
//         } else {
//           io.to(room[a]).emit('wrong')
//         }
//       }
//     })
//   })
// })
// const Question = ['세젤귀', '나쁜놈', '착한사람', 'BadBoy', '코딩짱']


const port = process.env.PORT || 3000
http.listen(port, () => {
  console.log('Connect at 3000')
})
const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
