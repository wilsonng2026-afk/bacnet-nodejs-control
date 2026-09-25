const bacnet = require('bacstack');
const readline = require('readline');

const client = new bacnet({
    apduTimeout: 100000,      
    segmentation: false,      
    port: 47808,              
    apduSize: 480             
});
const deviceAddress = '172.168.100.102';

// Object IDs for Binary Inputs (BI)
const biObjectIds = [
    { type: 3, instance: 258 }, // BI instance 258
    { type: 3, instance: 514 }  // BI instance 514
];

// Mapping user DO input to actual Binary Output (BO) instances
const doMapping = {
    1: 257, // DO point 1 maps to BO instance 257
    2: 513  // DO point 2 maps to BO instance 513
};

// Track the states of the Digital Outputs (DOs)
const doStates = {
    257: false, // Initial state for BO instance 257
    513: false  // Initial state for BO instance 513
};

// Function to read a property from a BACnet object
function readProperty(objectId, callback) {
    client.readProperty(deviceAddress, objectId, bacnet.enum.PropertyIdentifier.PRESENT_VALUE, (err, value) => {
        if (err) {
            if (err.message.includes('ERR_TIMEOUT')) {
                console.error('Timeout error: Device did not respond in time for Object ID:', objectId);
            } else {
                console.error('Error reading property for Object ID:', objectId, err.message);
            }
            callback(err, null);
        } else {
            callback(null, value.values[0].value);
        }
    });
}

// Function to periodically read Binary Input values
function readBinaryInputs(objectIds) {
    objectIds.forEach((objectId) => {
        readProperty(objectId, (err, value) => {
            const currentTime = new Date();
            if (!err) {
                console.log(`${currentTime.toLocaleString()} - BI Object ID (${objectId.type}, ${objectId.instance}) Value: ${value}`);
            } else {
                console.error(`${currentTime.toLocaleString()} - Failed to read BI Object ID (${objectId.type}, ${objectId.instance}): ${err.message}`);
            }
        });
    });
}

// Function to set the state of a Digital Output with priority
function setDO(doPoint, state) {
    const instance = doMapping[doPoint];
    if (instance !== undefined) {
        // Update the state based on user input
        doStates[instance] = state === "ON";
        const currentState = doStates[instance] ? "ON" : "OFF";

        // Define the Binary Output object (type 4)
        const objectId = { type: 4, instance: instance };

        // Prepare the value to write (ENUMERATED: 1 for ON, 0 for OFF)
        const valueToWrite = [
            {
                type: bacnet.enum.ApplicationTags.ENUMERATED,
                value: doStates[instance] ? 1 : 0
            }
        ];

        // Write the value to the BACnet device with priority 8
        const options = { priority: 8 };
        client.writeProperty(deviceAddress, objectId, bacnet.enum.PropertyIdentifier.PRESENT_VALUE, valueToWrite, options, (err) => {
            if (err) {
                console.error(`Failed to write DO${doPoint} (instance ${instance}) state:`, err.message);
                if (err.message.includes('Reason:6')) {
                    console.error('Segmentation error: Verify instance and device compatibility.');
                }
            } else {
                console.log(`Successfully updated DO${doPoint} (instance ${instance}) state to ${currentState}.`);
            }
        });
    } else {
        console.log("Invalid DO point. Use 1 or 2.");
    }
}

// Set up user input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for DO control input
function promptUser() {
    rl.question('Enter DO point number and state (ON/OFF) (e.g., "1 ON"): ', (answer) => {
        const [doPoint, state] = answer.trim().split(" ");
        const point = parseInt(doPoint);
        if (!isNaN(point) && state && (state.toUpperCase() === "ON" || state.toUpperCase() === "OFF")) {
            setDO(point, state.toUpperCase());
        } else {
            console.log("Invalid input. Enter a number (1 or 2) followed by ON or OFF.");
        }
        promptUser(); // Continue prompting
    });
}

// Handle graceful exit
process.on('SIGINT', () => {
    console.log('\nExiting...');
    rl.close();
    client.close();
    process.exit(0);
});

// Start the program
console.log('BACnet Digital Output Control');
promptUser();

// Read Binary Inputs every 10 seconds
setInterval(() => readBinaryInputs(biObjectIds), 10000);