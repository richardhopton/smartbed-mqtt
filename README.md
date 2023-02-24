# Smart Bed MQTT

This project aims to enable remote control of smart beds from HomeAssistant.

Initial support is for:-

- Sleeptracker AI controlled beds such as the Tempur Ergo Smart Base.

# Installation

- In HomeAssistant click Settings, Add-ons, and Add-on Store.
- Click the 3 dot menu in the top right and select Repositories.
- Paste https://github.com/richardhopton/smartbed-mqtt, click Add, and Close
- Select the Smartbed MQTT add-on from the list, and click Install.
- Wait patiently for the build to finish.
- Click on Configuration and set at least one email and password.
- Click on Info and click Start.

# Sleeptracker Support

## Current features includes:-

- Buttons to trigger the presets
- Buttons to program the presets
- Switches to control Snore response
- Environmental sensors (temperature, humidity, CO2 & VOC)
- Switch for safety light
- Sensors for Heat & Foot Angle
- Buttons to step thru the massage strengths, patterns & timer (auto turn off massage)
- Sensors for Massage strengths and patterns
- Untested support for split beds, and multiple beds

## Possible future features:-

- Buttons to control raising and lowering head/feet
- Configuration of bed "alarm"
- Service to trigger sleep summary email to be sent from Sleeptracker

## Features that can't be done:-

- Presence detection

## Notes

This integration uses the same api used by the iOS and Android apps, so it is possible that this will break if the apps are changed. I will attempt to maintain it where feasible, but also open to PRs.

If you have a split base bed, or a bed with lumbar/head tilt support, or a bed with just the sleeptracker (non-adjustable) please reach out using the Github Issues tab.

For help with setup, or for sharing feedback please join the Discord server https://discord.gg/Hf3kpFjbZs
