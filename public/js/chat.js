$(() => {
  const name = prompt('What your name')
  const socket = io()
  let room = []
  for(let i = 0; i < 51; i++){ room.push('room' + i)}

  let num = 0
  let chatPlace = document.getElementById('messages')
  let firstScore = 0
  let secondScore = 0
  let idNum = 0
  let correctSign = document.querySelector('.correct-sign')
  let wrongSign = document.querySelector('.wrong-sign')

  socket.emit('joinRoom', name)

  $('form').submit(() => {
    socket.emit('chat message', num, name, $('#input').val(), idNum)
    $('#input').val('')
    return false
  })

  socket.on('setIdNum', SetidNum => {
    idNum = SetidNum
    console.log('SetId: ' + idNum)
  })

  socket.on('chat message', (name, msg) => {
    document.querySelector('#messages').innerHTML += '<li><span>' + name + ':' + msg + '</li></span>'
    chatPlace.scrollTop = chatPlace.scrollHeight
  })

  socket.on('leaveRoom', (num, name) => {
    $('#messages').append($('<li>').text(name + '    leaved ' +
			room[num] + ' :('))
  })

  socket.on('joinRoom', (roomnum, name, firstQuestion) => {
    num = roomnum
    $('#messages').append($('<li>').text(name + '    joined ' +
      room[num] + ':)'))
    console.log(num)
    console.log(idNum)
    document.querySelector('#title').innerHTML = firstQuestion
  })
  socket.on('firstCorrect', (NextQuestion) => {
    console.log('firstwin')
    firstScore++
    if (idNum === 1) {
      document.querySelector('#firstPlayer').innerHTML = firstScore
      document.querySelector('#title').innerHTML = NextQuestion
    } else {
      document.querySelector('#secondPlayer').innerHTML = firstScore
      document.querySelector('#title').innerHTML = NextQuestion
    }
  })
  socket.on('secondCorrect', (NextQuestion) => {
    console.log('secondWin')
    secondScore++
    if (idNum === 2) {
      document.querySelector('#firstPlayer').innerHTML = secondScore
      document.querySelector('#title').innerHTML = NextQuestion
    } else {
      document.querySelector('#secondPlayer').innerHTML = secondScore
      document.querySelector('#title').innerHTML = NextQuestion
    }
  })

  socket.on('correct', () => {
    correctSign.style.display = 'flex'
    setTimeout(() => {
      correctSign.style.display = 'none'
    }, 1000)
  })

  socket.on('wrong', () => {
    wrongSign.style.display = 'flex'
    setTimeout(() => {
      wrongSign.style.display = 'none'
    }, 1000)
  })
})
