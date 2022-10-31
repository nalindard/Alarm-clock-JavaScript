const time = document.querySelector('.time')
const time_hour = document.querySelector('.time_hour')
const time_minute = document.querySelector('.time_minute')
const time_second = document.querySelector('.time_second')
const time_am_pm = document.querySelector('.time_am_pm')
const date = document.querySelector('.date')

const addAlarmBtn = document.querySelector('#addAlarmBtn')
const stopBtn = document.querySelector('#stopAlarmButton')
const input = document.querySelector('.input')
const output = document.querySelector('.output')

const alarmName = document.querySelector('#name')
const description = document.querySelector('#description')

const hour = document.querySelectorAll('.time > input')[0]
const minute = document.querySelectorAll('.time > input')[1]
const am_pm = document.querySelector('#am_pm')
const repeat = document.querySelector('#repeat')
const week = document.querySelector('.days')
const days = document.querySelectorAll('.day')
const active = document.querySelector('#active')
// alert(active.checked)

const submit = document.getElementById('submit')
const reset = document.querySelector('#reset')
const add_btn = document.querySelector('#add_btn')
const overlay = document.querySelector('.overlay')
const floatBox = document.querySelector('.floatBox > span')

// addAlarmBtn.classList.remove('disable')
const fullWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const audio = new Audio('audio/memories.mp3')

let alarmList = []
let dayAlarmList = {}

//  Display time----------------------------------------------------------------------------------------------------------------

const showTime = () => {
  let current = new Date()

  let hour = current.getHours()
  let minute = current.getMinutes()
  let seconds = current.getSeconds()

  let am_pm = hour >= 12 ? 'PM' : 'AM'

  if (am_pm == 'PM') hour = hour - 12
  if (hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute
  if (seconds < 10) seconds = '0' + seconds

  time_hour.textContent = hour
  time_minute.textContent = minute
  time_second.textContent = seconds
  time_am_pm.textContent = am_pm

  let day = current.toLocaleString('en-us', { weekday: 'long' })
  let dateDisplay = current.getDate()
  let month = current.toLocaleString('default', { month: 'long' })
  // let year = current.getFullYear()

  date.textContent = `${day} ${dateDisplay} ${month}`

  let time = `${hour}${minute}`

  checkAlarm(day, time, seconds)
  todayList(day)
}
// showTime()
setInterval(showTime, 1000)

//  Alarm list------------------------------------------------------------------------------------------------------------------
if (localStorage.list) {
  alarmList = JSON.parse(localStorage.list)
}
console.log(alarmList)

function setLocalStorage() {
  localStorage.setItem('list', JSON.stringify(alarmList))
  dayFilter()
  renderList()
  showTime()
}

//  Constructor-----------------------------------------------------------------------------------------------------------------
class Alarm {
  constructor(
    ID,
    name,
    description,
    ringTime,
    ringHour,
    ringMinute,
    repeat,
    active,
    repeatType
  ) {
    this.ID = ID
    this.name = name
    this.description = description
    this.ringTime = ringTime
    this.ringHour = ringHour
    this.ringMinute = ringMinute
    this.repeat = repeat
    this.active = active
    this.repeatType = repeatType
  }
}

function dayFilter() {
  fullWeek.forEach((singleDay) => {
    console.log(singleDay)
    dayAlarmList[singleDay] = []
  })

  alarmList.forEach((alarm) => {
    console.log('🟢-Alarm repeating days-> ' + alarm.repeat)
    fullWeek.forEach((one) => {
      console.log(
        'The day is->  ' +
          one +
          '| Will alarm ring thisday->  ' +
          alarm.repeat.includes(one)
      )
      // console.log('Will alarm ring today->  ' + alarm.repeat.includes(one))
      if (alarm.repeat.includes(one)) {
        dayAlarmList[one].push(alarm.ringTime)
      }
    })
    // console.log(alarm.repeat.includes('Tuesday'))
    // console.log(alarm.repeat.includes())
  })
}

//  On adding a new alarm------------------------------------------------------------------------------------------------------
submit.onclick = (e) => {
  // debugger
  event.preventDefault()
  inputValidate()

  addAlarmBtn.classList.remove('disable')
  reset.click()
}

function inputValidate() {
  let invalidInput = true

  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

  // specialChars.test(hour.value && minute.value)
  //   ? (invalidInput = true)
  //   : (invalidInput = false)

  if (specialChars.test(hour.value)) {
    alert('Check the characters!')
  } else if (specialChars.test(minute.value)) {
    alert('Check the characters!')
  } else if (hour.value == '' || minute.value == '') {
    alert('Check the inputs. Cannot be empty!')
  } else if (hour.value > 12 || minute.value > 59) {
    alert('Check the inputs. Cannot be out-of-range!')
  } else if (hour.value.length > 2 || minute.value.length > 2) {
    alert('Check the inputs. Cannot be out-of-range. LOL!')
  } else {
    inputs()
  }
}

function inputs() {
  let inputHour = hour.value
  let inputMinute = minute.value

  if (am_pm.value == 'pm') inputHour = 12 + Number(hour.value)
  if (am_pm.value == 'am' && hour.value.length == 1)
    inputHour = '0' + hour.value
  if (minute.value.length == 1) inputMinute = '0' + minute.value

  alarmList.length < 10
    ? addAlarm(inputHour, inputMinute)
    : alert("You can't add more alarams" + alarmList.length)
}

function addAlarm(ringHour, ringMinute) {
  week.classList.add('hide')

  const ID = Math.round(new Date() / 1000)
  let ringTime = ringHour + ringMinute
  let ringAgain
  let customDays = []
  let today = [new Date().toLocaleString('en-us', { weekday: 'long' })]

  function thedays() {
    days.forEach((day) => {
      if (day.checked) {
        customDays.push(day.name)
      }
    })
  }

  thedays()

  console.log(`Custom days -->  ${customDays}`)

  switch (repeat.value) {
    case 'Alldays':
      ringAgain = fullWeek
      break
    case 'Weekdays':
      ringAgain = fullWeek.slice(0, 5)
      break
    case 'Weekend':
      ringAgain = fullWeek.slice(5)
      break
    case 'Once':
      ringAgain = today
      break
    case 'Custom':
      ringAgain = customDays
      break
    default:
      ringAgain = today
      break
  }

  const newAlarm = new Alarm(
    ID,
    alarmName.value,
    description.value,
    ringTime,
    ringHour,
    ringMinute,
    ringAgain,
    active.checked,
    repeat.value
  )

  alarmList.push(newAlarm)

  toogle(input)
  toogle(overlay)

  setLocalStorage()
  // renderList()
}

// Render Alarm List-------------------------------------------------------------------------------------------------------------
const renderList = () => {
  dayFilter()
  output.innerHTML = ''

  alarmList.forEach((alarm) => {
    const {
      ID,
      name,
      description,
      repeat,
      ringTime,
      ringHour,
      ringMinute,
      active,
    } = alarm
    output.innerHTML += alarmTemplate(
      ID,
      name,
      description,
      ringTime,
      ringHour,
      ringMinute,
      repeat,
      active
    )
  })
}

function alarmTemplate(
  ID,
  name,
  description,
  ringTime,
  ringHour,
  ringMinute,
  repeat,
  active
) {
  let checkboxMark
  let hour
  let am_pm

  if (active == true) {
    checkboxMark = '<input type="checkbox" name="" id="ccc" checked/>'
  } else {
    checkboxMark = '<input type="checkbox" name="" id="ccc" />'
  }

  if (ringHour > 12) {
    hour = ringHour - 12
    am_pm = 'PM'
  } else {
    hour = ringHour
    am_pm = 'AM'
  }

  if (hour < 10 && hour.length == 1) hour = '0' + hour
  // alert(hour)
  const alarm = `
                <div class="alarm" data-ID="${ID}">
                <span class="alarm_top_box">
                  <h3>${name}</h3>
                  <h1 style="display: none">${ringTime}</h1>
                  <h1>${hour}:${ringMinute} ${am_pm}</h1>
                </span>
                <span class="alarm_middle_box">
                  <h4>${description}</h4>
                  <h6>${repeat}</h6>
                  <h5 style="display: none">${active}</h5>
                </span>
                <span class="alarm_bottom_box">
                <span id="cc">
                  ${checkboxMark}
                  </span>
                  <button type="menu">Edit</button>
                  <input type="button" class="delete" value="Delete" />
                </span>
              </div>
  `
  // console.log(ringTime)
  return alarm
}

renderList()

// Edit Alarm--------------------------------------------------------------------------------------------------------------------
const item = output.addEventListener('click', (e) => {
  let itemID = e.target.closest('div').dataset.id
  // console.log(e.target.checked)
  if (e.target.type) edit(itemID, e.target.type, e.target.checked)
})

function edit(id, oparation, On_Off) {
  // console.log(id + '  --> ' + oparation)
  for (let index = 0; index < alarmList.length; index++) {
    let alarm = alarmList[index]
    let currentAlarm = alarm.ID

    if (currentAlarm == id) {
      console.log(
        `The Alarm is ${alarm.name} at ${alarm.ringTime} & alarm ID is ${alarm.ID}`
      )
      // debugger
      if (oparation === 'submit') editAlarm(alarm, index)
      if (oparation === 'checkbox') activate(alarm, index, On_Off)
      if (oparation === 'button') deleteAlarm(index)
      // if (oparation === 'checkbox') {        activate(alarm, index, On_Off)      }
    }
  }
}

// Manage Object----------------------------------------------------------------------------------------------------------------

function activate(alarm, index, On_Off) {
  // console.log('On/Off   ' + On_Off + '    index   ' + index)
  // console.table(alarm)

  let bool = alarmList[index].active
  if (bool == false) {
    alarmList[index].active = true
  } else {
    alarmList[index].active = false
  }
  setLocalStorage()
}

function deleteAlarm(index) {
  console.log('Delete --> ' + index)
  alarmList.splice(index, 1)
  setLocalStorage()
}

function editAlarm(alarm, index) {
  addAlarmBtn.classList.add('disable')

  console.table(alarm)
  reset.click()
  // debugger
  alarmName.value = alarm.name
  description.value = alarm.description
  // hour.value = alarm.ringTime.slice(0, 2)
  // minute.value = alarm.ringTime.slice(2)
  if (alarm.ringHour > 12) {
    hour.value = alarm.ringHour - 12
    am_pm.value = 'pm'
  } else {
    hour.value = alarm.ringHour
    am_pm.value = 'am'
  }
  minute.value = alarm.ringMinute
  repeat.value = alarm.repeatType

  if (alarm.repeatType == 'Custom') toogle(week)
  repeatMarker(alarm.repeat)

  toogle(input)
  toogle(overlay)

  deleteAlarm(index)
  // inputValidate()
  // submit.click()
}

function repeatMarker(repeat) {
  let alarmDays = []
  repeat.forEach((day) => alarmDays.push(day))
  console.log(alarmDays)

  days.forEach((day) => (day.checked = false))
  // console.log(days)

  days.forEach((day) => {
    if (alarmDays.includes(day.name)) day.checked = true
    // day.click()
  })
}

function todayList(day) {
  floatBox.textContent = ' '
  dayAlarmList[day].forEach((day) => {
    floatBox.textContent += '     ' + day
  })
}

//  Layout controls--------------------------------------------------------------------------------------------------------------
repeat.onchange = (e) => {
  if (e.target.value === 'Custom') {
    week.classList.remove('hide')
  } else {
    week.classList.add('hide')
  }
}

addAlarmBtn.onclick = (e) => {
  toogle(input)
  toogle(overlay)
}

stopBtn.onclick = stop

function toogle(el) {
  el.classList.toggle('hide')
}

//  Ring Alarm------------------------------------------------------------------------------------------------------------------
async function checkAlarm(today, time, second) {
  // console.log(today + '| Seconds-> ' + second + '| Time now-> ' + time)
  let arr = await dayAlarmList[today].includes(time)
  if (second == 0 && arr) {
    play()
  }
  // console.log(arr)
}

function play() {
  audio.currentTime = 0
  audio.play()
  toogle(stopBtn)
}

function stop() {
  audio.pause()
  toogle(stopBtn)
  alert('Alarm Stopped ❤️😊😁👍')
}

setTimeout(() => {
  alert('Extention Dark reader crushing styles. LOL !')
}, 2700)
