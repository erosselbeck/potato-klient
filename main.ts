function explode () {
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
        `)
    basic.pause(1000)
    basic.clearScreen()
    basic.showString("GAME OVER")
}
function ShowVictoryScreen () {
    basic.showIcon(IconNames.Target)
    basic.pause(500)
    basic.showString("You win!")
    basic.pause(1000)
}
// Mäter om man skakar hårt eller inte.
input.onGesture(Gesture.EightG, function () {
    strongshake = true
})
input.onButtonPressed(Button.A, function () {
    if (gamestate == 1) {
        radio.sendValue(control.deviceName(), -199)
        basic.pause(5000)
    }
})
// DEBUGFUNKTION som visar gamestate
input.onButtonPressed(Button.B, function () {
    if (gamestate == 1) {
        basic.showNumber(playernumber)
        basic.pause(1000)
        basic.showLeds(`
            # # . . .
            . # . . .
            . # . . .
            # # # . .
            . . . . .
            `)
        basic.pause(1000)
        basic.clearScreen()
    }
    if (gamestate == 2) {
        basic.showNumber(playernumber)
        basic.pause(1000)
        basic.showLeds(`
            # # . . .
            . . # . .
            . # . . .
            # # # . .
            . . . . .
            `)
        basic.pause(1000)
        basic.clearScreen()
    }
    if (gamestate == 3) {
        basic.showNumber(playernumber)
        basic.pause(1000)
        basic.showLeds(`
            # # . . .
            . . # . .
            . # . . .
            . . # . .
            # # . . .
            `)
        basic.pause(1000)
        basic.clearScreen()
    }
    if (gamestate == 4) {
        basic.showNumber(playernumber)
        basic.pause(1000)
        basic.showLeds(`
            # . # . .
            # . # . .
            # # # . .
            . . # . .
            . . . . .
            `)
        basic.pause(1000)
        basic.clearScreen()
    }
})
input.onGesture(Gesture.Shake, function () {
    if (gamestate == 2) {
        if (havebomb == true) {
            if (input.buttonIsPressed(Button.AB)) {
                direction = "forward"
            } else if (input.buttonIsPressed(Button.B)) {
                direction = "right"
            } else if (input.buttonIsPressed(Button.A)) {
                direction = "left"
            }
            // För att förhindra att pausen triggar om man skakar utan att hålla ner en knapp.
            if (direction != "") {
                // Pausen finns för att microbiten ska kunna mäta hur hårt man skakar.
                // 
                // Eftersom det inte går att nå 6g utan att skaka först, hade koden annars skickat signalen direkt innan den hunnit mäta 6g.
                basic.pause(500)
                _throw()
                direction = ""
                strongshake = false
            }
        }
    }
})
function _throw () {
    if (direction == "forward" && strongshake == true) {
        radio.sendString("*pass_F")
        radio.sendValue("*pass_F", boom)
        basic.showLeds(`
            . . # . .
            . # . # .
            # . # . #
            . # . # .
            # . . . #
            `)
    } else if (direction == "right" && strongshake == true) {
        radio.sendString("*pass_HH")
        radio.sendValue("*pass_HH", boom)
        basic.showLeds(`
            # . # . .
            . # . # .
            . . # . #
            . # . # .
            # . # . .
            `)
    } else if (direction == "left" && strongshake == true) {
        radio.sendString("*pass_VV")
        radio.sendValue("*pass_VV", boom)
        basic.showLeds(`
            . . # . #
            . # . # .
            # . # . .
            . # . # .
            . . # . #
            `)
    } else if (direction == "forward") {
        radio.sendString("*pass_F")
        radio.sendValue("*pass_F", boom)
        basic.showLeds(`
            . . . . .
            . . # . .
            . # . # .
            # . . . #
            . . . . .
            `)
    } else if (direction == "right") {
        radio.sendString("*pass_H")
        radio.sendValue("*pass_H", boom)
        basic.showLeds(`
            . # . . .
            . . # . .
            . . . # .
            . . # . .
            . # . . .
            `)
    } else if (direction == "left") {
        radio.sendString("*pass_V")
        radio.sendValue("*pass_V", boom)
        basic.showLeds(`
            . . . # .
            . . # . .
            . # . . .
            . . # . .
            . . . # .
            `)
    }
    basic.pause(500)
    basic.clearScreen()
}
radio.onReceivedValue(function (name, value) {
    if (name == control.deviceName()) {
        if (value > 0) {
            havebomb = true
            boom = value
        } else if (value == -202) {
            gamestate = 4
            ShowVictoryScreen()
        } else if (value == -205) {
            havebomb = false
        } else if (value >= -99 && value <= 0) {
            playernumber = value * -1 + 1
            basic.showNumber(playernumber)
            basic.pause(500)
            basic.clearScreen()
        }
    } else if (value == -255) {
        gamestate = 2
        led.plot(1, 4)
    } else if (name == "nyrond") {
    	
    } else if (name == "newGame") {
        basic.showString("Restarting")
        gamestate = 1
    } else {
    	
    }
})
function ticker () {
    if (timer < boom) {
        if (tick_speed > 200) {
            beep()
            basic.pause(tick_speed)
            tick_speed += -200
            timer += 200
            beep()
        } else if (tick_speed <= 200) {
            timer += 200
            beep()
            basic.pause(tick_speed)
            beep()
        }
    } else {
        explode()
        gamestate = 3
    }
}
function beep () {
    led.toggle(4, 0)
}
let direction = ""
let havebomb = false
let playernumber = 0
let strongshake = false
let timer = 0
let boom = 0
let tick_speed = 0
let gamestate = 0
radio.setGroup(130)
gamestate = 1
led.plot(0, 4)
tick_speed = boom / 10
timer = boom / 10
basic.forever(function () {
    while (havebomb == true) {
        basic.showLeds(`
            . . . . #
            . # # . #
            # # # # #
            # # # # .
            . # # . .
            `)
        ticker()
    }
})
