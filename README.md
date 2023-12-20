# Smart Bed MQTT

This project aims to enable remote control of smart beds from HomeAssistant.

## Support is for:

- Sleeptracker AI controlled beds such as the Tempur Ergo/Extend, BeautyRest SmartMotion, and Serta Perfect Smart Bases
- ErgoMotion controlled beds that use the ErgoWifi app [experimental]
- Richmat BLE controlled beds [experimental]
- Linak BLE controlled beds [prototype]
- Solace BLE controlled beds [prototype]

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

# Sleeptracker Support (Cloud)

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

'sleeptrackerRefreshFrequency' is in minutes.

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

## Possible future features:

- Buttons to control raising and lowering head/feet
- Configuration of bed "alarm"
- Service to trigger sleep summary email to be sent from Sleeptracker
- Switches to control presets

## Features that can't be done:

- Presence detection

## Notes

This uses the same api used by the iOS and Android apps, so it is possible that this will break if the apps are changed. I will attempt to maintain it where feasible, but also open to PRs.

# ErgoMotion Support (Cloud) [experimental]

Very experimental

## Notes

This uses the Chinese cloud called xlink - there is no guarantees that this will work.

# Richmat Support (Bluetooth) [experimental]

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Richmat controller with `name`, `friendlyName`, `remoteCode`, and optionally `stayConnected`.

## Current features include:

- Buttons to trigger the presets
- Buttons to program the presets
- Button for under bed lights
- Buttons to step thru the massage strengths for head & foot, massage mode, and toggle

## Notes

Setting `stayConnected` to `true` will stop you from being able to use the app to control the bed.

Support for this was only possible due to assistance from getrav on Discord. This was reverse engineered from a Sven & Son bed, so your mileage may vary.

# Linak Support (Bluetooth) [prototype]

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Linak controller with `name`, `friendlyName`, and `type`.

## Current features include:

- Button to toggle under bed lights
- Sensor to read the bed angle

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app or remote to control the bed.

Initial prototyping was only possible due to assistance from jascdk on Discord.

# Solace Support (Bluetooth) [experimental]

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Richmat controller with `name` and `friendlyName`.

## Current features include:

- Buttons to trigger the standard presets
- Buttons to trigger the user presets
- Buttons to program the user presets
- Buttons to reset the user presets

## Notes

This remains connected to the bed controller and due to the bed only accepting one connection it will stop you from using the app to control the bed.

Initial prototyping was only possible due to assistance from Bonopaws on Discord.

# Support

For help with setup, or for sharing feedback please join the Discord server https://discord.gg/Hf3kpFjbZs
