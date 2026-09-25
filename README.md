# BACnet Node.js Control

A Node.js BACnet controller for monitoring Binary Inputs (BI) and controlling Binary Outputs (BO) using the `bacstack` library.

## Features

- Monitor BACnet Binary Input objects.
- Control BACnet Binary Output objects.
- Send ON/OFF commands from the terminal.
- Write output values using BACnet priority 8.
- Read Binary Input values every 10 seconds.
- Handle BACnet timeout and write errors.
- Close the BACnet client safely with `Ctrl+C`.

## Requirements

- Node.js
- npm
- A BACnet-compatible device
- Network access to the BACnet device
- The `bacstack` npm package

## Installation

Clone the repository:

```bash
cd bacnet-nodejs-control
```

Install the project dependencies:

```bash
npm install
```

If the project does not contain a `package.json` file, install `bacstack` manually:

```bash
npm install bacstack
```

## Configuration

The main program file is:

```text
index.js
```

Before running the program, check the BACnet device IP address in `index.js`:

```javascript
const deviceAddress = '172.168.100.102';
```

The BACnet client uses the following settings:

```javascript
{
  apduTimeout: 100000,
  segmentation: false,
  port: 47808,
  apduSize: 480
}
```

## BACnet Objects

The program monitors the following Binary Input objects:

```text
BI instance 258
BI instance 514
```

The Digital Output mapping is:

```text
DO1 → BO instance 257
DO2 → BO instance 513
```

The output object type is BACnet Binary Output:

```javascript
{
  type: 4,
  instance: 257
}
```

Output commands are written using BACnet priority 8.

## Run the Program

Start the program with:

```bash
node index.js
```

Alternatively, if an npm start script is configured:

```bash
npm start
```

The program will display the following prompt:

```text
Enter DO point number and state (ON/OFF) (e.g., "1 ON"):
```

## Commands

Turn DO1 ON:

```text
1 ON
```

Turn DO1 OFF:

```text
1 OFF
```

Turn DO2 ON:

```text
2 ON
```

Turn DO2 OFF:

```text
2 OFF
```

Only DO1 and DO2 are supported.

## Monitoring Binary Inputs

The program reads the Binary Input objects every 10 seconds and displays their values in the terminal.

Example output:

```text
9/25/2026, 3:20:00 PM - BI Object ID (3, 258) Value: active
9/25/2026, 3:20:00 PM - BI Object ID (3, 514) Value: inactive
```

## Error Handling

The program reports an error if:

- The BACnet device does not respond.
- The device address is incorrect.
- The Binary Input or Binary Output instance is invalid.
- The BACnet write operation fails.
- The device does not support the requested write command.

If a timeout occurs, check:

- The device IP address.
- The computer IP address.
- The network connection.
- The BACnet UDP port.
- The firewall settings.
- The BACnet device configuration.

## Stop the Program

Press:

```text
Ctrl+C
```

The program will close the readline interface and BACnet client before exiting.

## Project Structure

```text
bacnet-nodejs-control/
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Safety Notice

This program can send write commands to a real BACnet device.

Before using this program, verify:

- The BACnet device IP address.
- The BACnet UDP port.
- The Binary Input instances.
- The Binary Output instances.
- The output mapping.
- The BACnet priority.
- The effect of switching each physical output.

Test the program in a safe environment before connecting it to production building-control equipment.

## License

This project is for testing, learning, and development purposes.
