module.exports = () => {
  const Excel = parseExcel(__dirname + '/public/excel/lesson' + num + '.xlsx')
  Excel.then(parsed => {
    let questlength = parsed.length
    let stage = 0
    let Users = [{ name: '' }, { name: '' }]
    let Answer = parsed[0][0]
    let Question = parsed[0][1]
    console.log('Question ' + Question)

    questlength = parsed.length
    console.log(questlength)
    console.log(parsed)
    const firstQuestion = parsed[0][1]
    console.log(firstQuestion)

    io.on('connection', (socket) => {
      socket.on('disconnect', (num, name) => {
        socket.leave(room[num], () => {
          console.log(name + ' leave a ' + room[num])
          io.to(room[num]).emit('leaveRoom', num, name)
          if (people > 0) { people-- }
          console.log('people : ' + people)
        })
      })

      socket.on('joinRoom', (num, name) => {
        socket.join(room[num], () => {
          console.log(name + ' join a ' + room[num])
          io.to(room[num]).emit('joinRoom', num, name, firstQuestion)
          socket.emit('setIdNum', people)
          Users[people - 1].name = name
          console.log(Users)
        })
        console.log('people: ' + people)
      })

      socket.on('chat message', (num, name, msg, idNum) => {
        a =
        io.to(room[a]).emit('chat message', name, msg)
        console.log('idNum : ' + idNum)
        if (people === 2) {
          if (msg === Answer) {
            stage += 1
            Answer = parsed[stage][0]

            console.log('you correct')
            let NextQuestion = parsed[stage][1]
            io.to(room[a]).emit('correct')
            if (idNum === 1) {
              io.to(room[a]).emit('firstCorrect', NextQuestion)
            } else {
              io.to(room[a]).emit('secondCorrect', NextQuestion)
            }
          } else {
            io.to(room[a]).emit('wrong')
          }
        }
      })
    })
  })

  const shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
}
