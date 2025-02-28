//%color=#921AFF icon="\uf118" block="jfplanet" blockId="jfplanet"
namespace jfplanet {

    let connected: boolean = false
    let electrode_on: boolean = false
    let pause: boolean = false

    let atten_value = 0
    let med_value = 0

    let roll_value = 0;
    let pitch_value = 0;

    function readSerialData(command: string, timeout: number = 200): string {
        serial.readString()
        serial.writeString(command + "\r\n")
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
        return response
    }

    function parseResponse(response: string): string[] {
        return response.trim().split(",")
    }

    //% block="updateStatus" blockId="updateStatus"
    export function updateStatus() {
        let response = readSerialData("status")
        let parts = parseResponse(response)
        if (parts.length < 3) {
            return
        }
        connected = parseInt(parts[0]) > 0
        electrode_on = parseInt(parts[1]) > 0
        pause = parseInt(parts[2]) > 0
    }

    //% block="readBrainValue" blockId="readBrainValue"
    export function readBrain() {
        let response = readSerialData("brain")
        let parts = parseResponse(response)
        if (parts.length < 2) {
            return
        }
        atten_value = parseInt(parts[0])
        med_value = parseInt(parts[1])
    }


    //% block="readDirection" blockId="readDirection"
    export function readDir() {
        let response = readSerialData("direction")
        let parts = parseResponse(response)
        if (parts.length < 2) {
            return
        }
        roll_value = parseInt(parts[0])
        pitch_value = parseInt(parts[1])
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
                return value > value_level.low
            case value_level.middle:
                return value > value_level.middle
            case value_level.high:
                return value > value_level.high
            default:
                return false
        }
    }

    //% block="Meditation %level" blockId="MeditationLevel"
    export function get_Meditaion_Value(level: value_level): boolean {
        let value = med_value
        switch (level) {
            case value_level.low:
                return value > value_level.low
            case value_level.middle:
                return value > value_level.middle
            case value_level.high:
                return value > value_level.high
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
                return value > 100
            case dir_roll.right:
                return value < -100
            default:
                return false
        }
    }

    //% block="motion %dir_move" blockId="motion"
    export function get_motion(level: dir_move): boolean {
        let value = pitch_value
        switch (level) {
            case dir_move.forward:
                return value > 50
            case dir_move.backward:
                return value < -100
            default:
                return false
        }
    }

}

