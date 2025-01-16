//%color=#921AFF icon="\uf118" block="jfplanet" blockId="jfplanet"
namespace jfplanet {

    let connected: boolean = false
    let electrode_on: boolean = false
    let pause: boolean = false

    let atten_value = 0
    let med_value = 0

    let roll_value = 0;
    let pitch_value = 0;

    //% block="updateStatus" blockId="updateStatus"
    export function updateStatus() {
        serial.readString()
        serial.writeString("status\r\n")
        let timeout = 200
        let response = ""
        let timestamp = input.runningTime()
        while (true) {
            if (input.runningTime() - timestamp > timeout) {
                break
            }
            response += serial.readString()
            if (response.includes("\r\n")) {
                break
            }
        }

        let firstCommaIndex = response.indexOf(",")
        if (firstCommaIndex == -1) {
            return
        }
        let a = parseInt(response.slice(0, firstCommaIndex))
        connected = (a > 0) ? true : false
        let remainingString = response.slice(firstCommaIndex + 1)
        let secondCommaIndex = remainingString.indexOf(",")

        if (secondCommaIndex == -1) {
            return
        }

        let b = parseInt(remainingString.slice(0, secondCommaIndex))
        electrode_on = (b > 0) ? true : false

        let leftString = response.slice(secondCommaIndex + 1)

        let endLine = leftString.indexOf("r\n")
        if (endLine == -1) {
            return
        }

        let laststring = leftString.slice(0, endLine)

        let c = parseInt(laststring)
        pause = (c > 0) ? true : false

    }

    //% block="readBrainValue" blockId="readBrainValue"
    export function readBrain() {
        serial.readString()
        serial.writeString("brain\r\n")
        let timeout = 200
        let response = ""
        let timestamp = input.runningTime()
        while (true) {
            if (input.runningTime() - timestamp > timeout) {
                break
            }
            response += serial.readString()
            if (response.includes("\r\n")) {
                break
            }
        }

        let firstCommaIndex = response.indexOf(",")
        if (firstCommaIndex == -1) {
            return
        }
        atten_value = parseInt(response.slice(0, firstCommaIndex))
        let remainingString = response.slice(firstCommaIndex + 1)
        med_value = parseInt(remainingString)
    }


    //% block="readDirection" blockId="readDirection"
    export function readDir() {
        serial.readString()
        serial.writeString("direction\r\n")
        let timeout = 200
        let response = ""
        let timestamp = input.runningTime()
        while (true) {
            if (input.runningTime() - timestamp > timeout) {
                break
            }
            response += serial.readString()
            if (response.includes("\r\n")) {
                break
            }
        }

        let firstCommaIndex = response.indexOf(",")
        if (firstCommaIndex == -1) {
            return
        }

        roll_value = parseInt(response.slice(0, firstCommaIndex ))
        let remainingString = response.slice(firstCommaIndex + 1)
        pitch_value = parseInt(remainingString)

    }


    //% blockId=JfBrainproConnected block="JfBrainproConnected"
    export function getConnectState(): boolean {
        return connected
    }

    //% blockId=ElectrodeOn block="ElectrodeOn"
    export function getElectrodeState(): boolean {
        return electrode_on
    }

    //% blockId=JFBrainproPause block="JFBrainproPause"
    export function isPause(): boolean {
        return pause
    }



    export enum value_level {
        /**
         * Attention greater than 35
         */
        //% block="low"
        low = 35,
        /**
         * Attention greater than 50
         */
        //% block="middle"
        middle = 50,
        /**
         * Attention greater than 65
         */
        //% block="high"
        high = 65
    }


    export enum dir_roll {
        //% block="left"
        left = 0,
        //% block="right"
        right = 1,
    }

    export enum dir_move {
        //% block="forward"
        forward = 0,
        //% block="backward"
        backward = 1,
    }

    /**
    * Low:Attention greater than 35,Middle:Attention greater than 50,High:Attention greater than 65.
    */
    //% block="Attention %level" blockId="AttentionLevel"
    export function get_Attention_Value(level: value_level): boolean {
        let value = atten_value

        switch (level) {
            case value_level.low:
                if (value > value_level.low)
                    return true
                else
                    return false
            case value_level.middle:
                if (value > value_level.middle)
                    return true
                else
                    return false
            case value_level.high:
                if (value > value_level.high)
                    return true
                else
                    return false
            default:
                return false
        }
    }

    //% block="Meditation %level" blockId="MeditationLevel"
    export function get_Meditaion_Value(level: value_level): boolean {
        let value = med_value

        switch (level) {
            case value_level.low:
                if (value > value_level.low)
                    return true
                else
                    return false
            case value_level.middle:
                if (value > value_level.middle)
                    return true
                else
                    return false
            case value_level.high:
                if (value > value_level.high)
                    return true
                else
                    return false
            default:
                return false
        }
    }

    //% block="MeditationValue" blockId="GetMeditationValue"
    export function get_Meditaion(): number {
        return med_value;
    }

    //% block="AttentionValue" blockId="GetAttentionValue"
    export function get_Attention(): number {
        return atten_value;
    }


    //% block="turnDirection %dir_roll" blockId="turnDirection"
    export function get_Turn_Dir(level: dir_roll): boolean {
        let value = roll_value
        switch (level) {
            case dir_roll.left:
                if (value > 100)
                    return true
                else
                    return false
            case dir_roll.right:
                if (value < -100)
                    return true
                else
                    return false
            default:
                return false
        }
    }

    //% block="motion %dir_move" blockId="motion"
    export function get_motion(level: dir_move): boolean {
        let value = pitch_value
        switch (level) {
            case dir_move.forward:
                if (value > 50)
                    return true
                else
                    return false
            case dir_move.backward:
                if (value < -100)
                    return true
                else
                    return false
            default:
                return false
        }
    }


}

