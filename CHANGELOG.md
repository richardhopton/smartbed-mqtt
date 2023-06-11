## v1.1.3

**New Features**

- (Richmat) Support for ZR10 & ZR60 remote codes
- (Linak) Very early support for Linak codes

## v1.1.2

**New Features**

- (Sleeptracker) Support for STS-60 devices

## v1.1.1

**Bugs Fixed**

- (HomeAssistant) Cannot save config with default config
- (Richmat) Strings not used properly

## v1.1.0

**Bugs Fixed**

- (Richmat) Strings module not found

## v1.0.9

**Bugs Fixed**

- (Richmat) Casing of import breaks docker build

## v1.0.8

**New Features**

- (Richmat) Experimental support for Richmat beds that use BLE controllers, e.g. Sven & Son

**Bugs Fixed**

- (ErgoMotion) Some buttons shouldn't be visible for all beds
- (ErgoMotion) Some buttons have wrong names

## v1.0.7

**New Features**

- (Sleeptracker) Support for Beautyrest SmartMotion & Serta Perfect smart bases
- (ErgoMotion) Experimental support for ErgoMotion beds that use the ErgoWifi app and Keeson WF02D & WF03D controller.

**Breaking Changes**

- (Sleeptracker) Changed the MQTT topic to handle split base beds; You will need to delete the current device and let the add-on re-create it, although entity ids should stay the same.

**Bugs Fixed**

- (Sleeptracker) Split base beds showing as two devices

## v1.0.6

**Bugs Fixed**

- State updates stop after HomeAssistant reboot

## v1.0.5

**Bugs Fixed**

- (Sleeptracker) Fix naming for split base bed entities

## v1.0.4

**Bugs Fixed**

- (Sleeptracker) Stop logging expected errors on status request

## v1.0.3

**Bugs Fixed**

- (Sleeptracker) Massage Head & Foot Step weren't working

## v1.0.2

**New Features**

- (Sleeptracker) Add buttons to use and set the TV preset

## v1.0.1

**Bugs Fixed**

- Sleeptracker API not returning manufacturer details, which caused HA to fail to add the devices
