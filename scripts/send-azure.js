const { EventHubProducerClient } = require("@azure/event-hubs");

const connectionString = process.env.AZURE_EVENT_HUB_CONNECTION_STRING;
const eventHubName = "shoppingordereventhub";

async function main() {
  const producerClient = new EventHubProducerClient(connectionString, eventHubName);

  const eventDataBatch = await producerClient.createBatch();
  let numberOfEventsToSend = Math.ceil(Math.random() * (30 - 1) + 1);
  const nextTimeout = numberOfEventsToSend * 1000;

  console.log("Sending...", numberOfEventsToSend, "events.");

  while (numberOfEventsToSend > 0) {
    let wasAdded = eventDataBatch.tryAdd({ body: "sending-my-event-data @ " + new Date().toISOString() });
    if (!wasAdded) {
      break;
    }
    numberOfEventsToSend--;
  }

  await producerClient.sendBatch(eventDataBatch);
  await producerClient.close();

  console.log("Done.");
  console.log("Waiting...", nextTimeout / 1000, "seconds.");

  setTimeout(main, nextTimeout);
}

main();