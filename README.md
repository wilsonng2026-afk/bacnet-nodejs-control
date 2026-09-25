# bacnet-nodejs-control
Node.js BACnet controller for monitoring binary inputs and controlling binary outputs with priority-based writes.
## Features

- Monitor BACnet Binary Input objects.
- Control BACnet Binary Output objects.
- Support ON/OFF commands from the terminal.
- Write output values with BACnet priority 8.
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
git clone [https://github.com/YOUR_USERNAME/bacnet-nodejs-control.git](https://github.com/YOUR_USERNAME/bacnet-nodejs-control.git)
cd bacnet-nodejs-control
```

Install the dependencies:

```bash
npm install bacstack
```

## Configuration

Open `index` and check the BACnet device IP address:

```javascript
const deviceAddress = '172.168.100.102';
```

The current Binary Input objects are:

```text
BI instance 258
BI instance 514
```

The current Binary Output mapping is:

```text
DO1 → BO instance 257
DO2 → BO instance 513
```

## Run the Program

Start the program with:

```bash
node index
```

The program will display a prompt:

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

## BACnet Settings

The current BACnet client configuration is:

```javascript
{
  apduTimeout: 100000,
  segmentation: false,
  port: 47808,
  apduSize: 480
}
```

Output commands are written with BACnet priority 8.

## Safety Notice

This program can send write commands to a real BACnet device. Verify the device IP address, object instances, network settings, and output mapping before using it in a production or building-control environment.

Do not publish private IP addresses, company network information, or sensitive device details in a public repository.

## Project Structure

```text
bacnet-nodejs-control/
├── index
├── package.json
└── README.md
```

## License

This project is for testing and development purposes.
