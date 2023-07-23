# Smart Bed MQTT

This project aims to enable remote control of smart beds from HomeAssistant.

Support is for:-

- Sleeptracker AI controlled beds such as the Tempur Ergo/Extend, BeautyRest SmartMotion, and Serta Perfect Smart Bases
- ErgoMotion controlled beds that use the ErgoWifi app (experimental)
- Richmat BLE controlled beds (experimental)

# Installation

- In HomeAssistant click Settings, Add-ons, and Add-on Store.
- Click the 3 dot menu in the top right and select Repositories.
- Paste https://github.com/richardhopton/smartbed-mqtt, click Add, and Close
- Select the Smartbed MQTT add-on from the list, and click Install.
- Wait patiently for the build to finish.
- Click on Configuration and set at least one email and password.
- Click on Info and click Start.

## MQTT broker

An MQTT broker is required. The [Mosquitto official Add-On](https://github.com/home-assistant/addons/tree/master/mosquitto) is recommended.  Go to Add-ons and search for MQTT, then follow the provided instructions.

# Sleeptracker Support

## Configuration

It is possible to configure multiple users for one or more sleeptracker beds. Although it is possible to configure two users for the same bed, it is necessary if the represent a split bed.

The default bed type is `tempur`, but can be adjusted by specifying `beautyrest` or `serta` using the optional type field on each user.

e.g.

```
 - email: me@example.org
   password: some strong password
   type: tempur
```

'sleeptrackerRefreshFrequency' is in minutes.

## Current features includes:-

- Buttons to trigger the presets
- Buttons to program the presets
- Switches to control Snore response
- Environmental sensors (temperature, humidity, CO2 & VOC)
- Switch for safety light
- Sensors for Heat & Foot Angle
- Buttons to step thru the massage strengths, patterns & timer (auto turn off massage)
- Sensors for Massage strengths and patterns
- Support for split beds, and multiple beds

## Possible future features:-

- Buttons to control raising and lowering head/feet
- Configuration of bed "alarm"
- Service to trigger sleep summary email to be sent from Sleeptracker
- Switches to control presets

## Features that can't be done:-

- Presence detection

## Notes

This integration uses the same api used by the iOS and Android apps, so it is possible that this will break if the apps are changed. I will attempt to maintain it where feasible, but also open to PRs.

# ErgoMotion Support (experimental)

Very experimental...

# Richmat Support (experimental)

Experimental...

## Configuring

You must specify at least one bleProxy as demonstrated in the config defaults. You also need to supply at least one Richmat controller with `name`, `friendlyName`, and `remoteCode`.

## Current features includes:-

- Buttons to trigger the presets
- Buttons to program the presets
- Button for under bed lights
- Buttons to step thru the massage strengths for head & foot, massage mode, and toggle

## Notes

Support for this was only possible due to assistance from getrav on Discord. This was reverse engineered from a Sven & Son bed, so your mileage may vary.

# Support

For help with setup, or for sharing feedback please join the Discord server https://discord.gg/Hf3kpFjbZs
