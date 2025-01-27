# Smart Bed MQTT

This project aims to enable remote control of adjustable smart beds from HomeAssistant.

## Support is for:

### Cloud based

- [Sleeptracker AI](#sleeptracker-ai-support-cloud) (Tempur Ergo/Extend, BeautyRest SmartMotion, and Serta Perfect Smart Base)
- [ErgoWifi](#ergowifi-support-cloud) [experimental]

### Local Wifi

- [ErgoMotion](#ergomotion-support-local-tcp) [experimental]
- [Logicdata](#logicdata-support-local-http--udp) [prototype]

### Local Bluetooth Low Energy (BLE)

<em>NOTE: The following requires an [ESPHome BLE Proxy](#ble-proxy)</em>

- [Richmat](#richmat-support-ble) [experimental]
- [Linak](#linak-support-ble) [prototype]
- [Solace](#solace-support-ble) [experimental]
- [MotoSleep](#motosleep-support-ble) [experimental]
- [Reverie](#reverie-support-ble) [prototype]
- [Leggett & Platt](#leggett--platt-support-ble) (Okin & Richmat variants) [prototype]
- [Okimat](#okimat-support-ble) [prototype]
- [Keeson](#keeson-support-ble) [prototype]
- [Octo](#octo-support-ble) [prototype]

# Installation

- In HomeAssistant click Settings, Add-ons, and Add-on Store.
- Click the 3 dot menu in the top right and select Repositories.
- Paste https://github.com/richardhopton/smartbed-mqtt, click Add, and Close
- Select the Smartbed MQTT add-on from the list, and click Install.
- Wait patiently for the build to finish.
- Click on Configuration and set type followed by the necessary configuration as described below.
- Click on Info and click Start.

## MQTT broker

An MQTT broker is required. The [Mosquitto official Add-On](https://github.com/home-assistant/addons/tree/master/mosquitto) is recommended. Go to Add-ons and search for MQTT, then follow the provided instructions.

## BLE proxy

For BLE controlled beds a dedicated ESP32 running ESPHome's bluetooth proxy is required. Due to limitations in ESPHome, specifically since 2023.7 only one connection can use the bluetooth proxy of an ESP32 at a time, the BLE proxy will need to not be added (or disabled if already added) to HomeAssistant. Use the [ESPHome Ready-Made Projects](https://esphome.io/projects/?type=bluetooth) page to create an ESPHome bluetooth proxy and join it to your network.

# Sleeptracker AI Support (Cloud)

## Configuration

To use this you must set at least one email and password as shown in the sample configuration.

It is possible to configure multiple users for one or more sleeptracker beds. Although it is possible to configure two users for the same bed, it is necessary if the represent a split bed.

The default bed type is `tempur`, but can be adjusted by specifying `beautyrest` or `serta` using the optional type field on each user.

e.g.

```
 - email: me@example.org
   password: some strong password
   type: tempur
```

`sleeptrackerRefreshFrequency` is in minutes.

## Current features include:

- Buttons to trigger the presets
- Buttons to program the presets
- Switches to control Snore response
- Environmental sensors (temperature, humidity, CO2 & VOC)
- Switch for safety light
- Sensors for Heat & Foot Angle
- Buttons to step thru the massage strengths, patterns & timer (auto turn off massage)
- Sensors for Massage strengths and patterns
- Support for split beds, and multiple beds
- Covers to control motors for raising, lowering, and stopping the head/feet/tilt/lumbar

## Possible future features:

- Configuration of bed "alarm"
- Service to trigger sleep summary email to be sent from Sleeptracker

## Features that can't be done:

- Presence detection

## Notes

This uses the same api used by the iOS and Android apps, so it is possible that this will break if the apps are changed. I will attempt to maintain it where feasible, but also open to PRs.

# ErgoWifi Support (Cloud)

This uses the Chinese cloud called xlink - there is no guarantees that this will work.

## Current features include:

- Buttons to trigger the presets
- Button for under bed lights
- Buttons to step thru the massage strengths for head & foot, massage mode, and toggle

# ErgoMotion Support (Local TCP)

You must specify an `ipAddress` (or DNS name), `friendlyName`, and `remoteStyle`

## Current features include:

- Buttons to trigger the presets
- Button for under bed lights
- Buttons to step thru the massage strengths for head & foot, massage mode, and toggle
- Covers to control motors for raising, lowering, and stopping the head/feet/tilt/lumbar

## Notes

This uses local connection via tcp - please ensure the add-on has access to network devices.

Initial prototyping was only possible due to assistance from Wozman on Discord.

# Logicdata Support (Local HTTP & UDP)

## Configuring

You must specify at least one Logicdata controller with `name` and `friendlyName`, and optionally `ipAddress`. If an `ipAddress` is not specified UDP discovery will be used to get the `ipAddress`.

## Current features include:

- Buttons to trigger the flat preset
- Buttons to trigger the user presets
- Buttons to program the user presets
- Controls for the head, lumbar & leg massage intesity & massage mode
- Covers to control motors for raising, lowering, and stopping the head/legs

## Notes

This uses local connection via http and udp - please ensure the add-on has access to network devices.

Initial prototyping was only possible due to assistance from James on Discord.

# Richmat Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Richmat controller with `name`, `friendlyName`, `remoteCode`, and optionally `stayConnected`.

## Current features include:

- Buttons to trigger the presets
- Buttons to program the presets
- Button for under bed lights
- Buttons to step thru the massage strengths for head & foot, massage mode, and toggle
- Covers to control motors for raising, lowering, and stopping the pillow/head/feet/lumbar

## Notes

Setting `stayConnected` to `true` will stop you from being able to use the app to control the bed if the bed only accepts one Bluetooth connection.

Support for this was only possible due to assistance from getrav on Discord. This was originally reverse engineered from a Sven & Son bed, so your mileage may vary.

# Linak Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Linak controller with `name`, `friendlyName`, and optionally `hasMassage`

## Current features include:

- Buttons to trigger the presets
- Buttons to program the presets
- Button & switch for under bed lights
- Sensor to read the back & leg angles
- Buttons to control massage strengths for head, foot or both, massage mode, and toggle/off
- Covers to control motors for raising, lowering, and stopping the head/leg

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app or remote to control the bed.

Initial prototyping was only possible due to assistance from jascdk on Discord.

# Solace Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Solace controller with `name` and `friendlyName`.

## Current features include:

- Buttons to trigger the standard presets
- Buttons to trigger the user presets
- Buttons to program the user presets
- Buttons to reset the user presets
- Covers to control motors for raising, lowering, and stopping the back/legs/lift/tilt

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app to control the bed.

Initial prototyping was only possible due to assistance from Bonopaws on Discord.

# MotoSleep Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one MotoSleep controller with `name`, `friendlyName`, and optionally `stayConnected`.

## Current features include:

- Buttons to trigger the presets
- Buttons to program the presets
- Button to toggle under bed lights
- Buttons to step thru the massage for head & foot
- Buttons to turn off head or foot massage
- Button to stop all motors & massage
- Covers to control motors for raising, lowering, and stopping the head/feet/lumbar/neck/tilt

## Notes

Setting `stayConnected` to `true` will stop you from being able to use the app to control the bed if the bed only accepts one Bluetooth connection.

Initial prototyping was only possible due to assistance from waynebowie99 on Discord.

# Reverie Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Reverie controller with `name` and `friendlyName`.

## Current features include:

- Buttons to trigger the standard presets
- Buttons to trigger the user presets
- Buttons to program the user presets
- Button to toggle under bed lights
- Controls for the head & foot massage intesity & massage wave
- Covers to control motors for setting the position of the head/feet

## Possible future features:

- Controls for the under bed light brightness

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app to control the bed.

Initial prototyping was only possible due to assistance from Vitaliy on Discord.

# Leggett & Platt Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Leggett & Platt controller with `name` and `friendlyName`. This supports Gen2 (Richmat) and Okin variants that can be controlled by the LP Control app.

## Current features include:

- Buttons to trigger the standard presets
- Buttons to trigger the user presets
- Buttons to program the user presets
- Light to control under bed lights
- Controls for the head & foot massage intesity & massage wave
- Covers to control motors for raising, lowering, and stopping the head/feet/pillow/lumbar

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app to control the bed.

Initial prototyping was only possible due to assistance from MarcusW on Discord.

# Okimat Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Okimat controller with `name`, `friendlyName` and `remoteCode`.

## Current features include (depending on remote code support):

- Buttons to trigger the flat preset
- Buttons to trigger the user presets
- Buttons to program the user presets
- Button for under bed lights
- Covers to control motors for raising, lowering, and stopping the back & legs

## Notes

Support for this was only possible due to assistance from david_nagy, corne & PT on Discord.

# Keeson Support (BLE)

> Keeson motor controllers are used by many bed manufacturers including (but not limited to) Member's Mark, Purple, ErgoMotion. The prototype was tested using the [Member's Mark Premier Adjustable Base](https://www.samsclub.com/p/-/prod22421683) bed variant.

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Keeson controller with `name` and `friendlyName`.

## Current features include:

- Buttons to trigger the standard presets
- Buttons to trigger the user presets
- Buttons to program the user presets
- Controls for the head & foot massage intesity, wave setting & timer
- Covers to control motors for raising, lowering, and stopping the head/feet/tilt/lumbar

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app to control the bed.

Initial prototyping was only possible due to assistance from [@alanbixby](https://github.com/alanbixby/) on Discord.

# Octo Support (BLE)

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Octo controller with `name`, `friendlyName`, and optional `pin`.

## Current features include:

- Button for under bed lights, if present
- Covers to control motors for raising, lowering, and stopping the head/legs

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app to control the bed.

Initial prototyping was only possible due to assistance from Murp on Discord.

# Support

For help with setup, or for sharing feedback please join the Discord server https://discord.gg/Hf3kpFjbZs
