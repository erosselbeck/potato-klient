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
function _throw () {
    if (direction == "forward" && strongshake == true) {
        radio.sendString("*pass_F")
        radio.sendValue("*pass_F", timer)
        basic.showLeds(`
            . . # . .
            . # . # .
            # . # . #
            . # . # .
            # . . . #
            `)
    } else if (direction == "right" && strongshake == true) {
        radio.sendString("*pass_HH")
        radio.sendValue("*pass_HH", timer)
        basic.showLeds(`
            # . # . .
            . # . # .
            . . # . #
            . # . # .
            # . # . .
            `)
    } else if (direction == "left" && strongshake == true) {
        radio.sendString("*pass_VV")
        radio.sendValue("*pass_VV", timer)
        basic.showLeds(`
            . . # . #
            . # . # .
            # . # . .
            . # . # .
            . . # . #
            `)
    } else if (direction == "forward") {
        radio.sendString("*pass_F")
        radio.sendValue("*pass_F", timer)
        basic.showLeds(`
            . . . . .
            . . # . .
            . # . # .
            # . . . #
            . . . . .
            `)
    } else if (direction == "right") {
        radio.sendString("*pass_H")
        radio.sendValue("*pass_H", timer)
        basic.showLeds(`
            . # . . .
            . . # . .
            . . . # .
            . . # . .
            . # . . .
            `)
    } else if (direction == "left") {
        radio.sendString("*pass_V")
        radio.sendValue("*pass_V", timer)
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
radio.onReceivedValue(function (name, value) {
    if (name == control.deviceName()) {
        if (value > 0) {
            havebomb = true
            timer = value
        } else if (value == -202) {
            gamestate = 4
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
    	
    }
})
let havebomb = false
let timer = 0
let direction = ""
let strongshake = false
let playernumber = 0
let gamestate = 0
radio.setGroup(130)
gamestate = 1
basic.showNumber(playernumber)
basic.forever(function () {
    while (havebomb == true) {
        basic.showIcon(IconNames.Ghost)
        basic.pause(500)
        basic.clearScreen()
        basic.pause(500)
    }
})
