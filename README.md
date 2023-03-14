# Smart Bed MQTT

This project aims to enable remote control of smart beds from HomeAssistant.

Support is for:-

- Sleeptracker AI controlled beds such as the Tempur Ergo/Extend, BeautyRest SmartMotion, and Serta Perfect Smart Bases
- ErgoMotion controlled beds that use the ErgoWifi app (experimental)

# Installation

- In HomeAssistant click Settings, Add-ons, and Add-on Store.
- Click the 3 dot menu in the top right and select Repositories.
- Paste https://github.com/richardhopton/smartbed-mqtt, click Add, and Close
- Select the Smartbed MQTT add-on from the list, and click Install.
- Wait patiently for the build to finish.
- Click on Configuration and set at least one email and password.
- Click on Info and click Start.

# Sleeptracker Support

## Configurating

It is possible to configure multiple users for one or more sleeptracker beds. Although it is possible to configure two users for the same bed, it is necessary if the represent a split bed.

The default bed type is `tempur`, but can be adjusted by specifying `beautyrest` or `serta` using the optional type field on each user.

e.g.

```
 - email: me@example.org
   password: some strong password
   type: serta
```

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

If you have a split base bed, or a bed with lumbar/head tilt support, or a bed with just the sleeptracker (non-adjustable) please reach out using the Github Issues tab.

For help with setup, or for sharing feedback please join the Discord server https://discord.gg/Hf3kpFjbZs

# ErgoMotion Support (experimental)

Very experimental...
