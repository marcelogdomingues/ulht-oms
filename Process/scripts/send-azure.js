require('dotenv').config();

const { EventHubProducerClient } = require("@azure/event-hubs");

const connectionString = process.env.AZURE_EVENT_HUB_CONNECTION_STRING;
const eventHubName = "shoppingordereventhub";
const UniqueId = require("uuid").v4;

async function main() {
  const producerClient = new EventHubProducerClient(connectionString, eventHubName);

  const eventDataBatch = await producerClient.createBatch();
  let numberOfEventsToSend = Math.ceil(Math.random() * (30 - 1) + 1); // Random number of events between 1 and 30
  const nextTimeout = numberOfEventsToSend * 1000;

  console.log("Sending...", numberOfEventsToSend, "events.");

  while (numberOfEventsToSend > 0) {
    // Create structured JSON data for each event
    const eventData = {
      event_type: "order_event",
      timestamp: new Date().toISOString(),
      data: {
        id: UniqueId(),
        customer_name: `Customer ${numberOfEventsToSend}`,
        product_name: `Product ${Math.ceil(Math.random() * 100)}`, // Random product
        quantity: Math.ceil(Math.random() * 5), // Random quantity between 1 and 5
        order_date: new Date().toISOString(),
      },
    };

    // Try to add the event data to the batch
    const wasAdded = eventDataBatch.tryAdd({ body: eventData });
    if (!wasAdded) {
      console.warn("Batch is full. Sending current batch and creating a new one.");
      await producerClient.sendBatch(eventDataBatch); // Send the current batch
      eventDataBatch = await producerClient.createBatch(); // Create a new batch
      eventDataBatch.tryAdd({ body: eventData }); // Add the current event
    }

    numberOfEventsToSend--;
  }

  // Send the last batch
  await producerClient.sendBatch(eventDataBatch);
  await producerClient.close();

  console.log("Done.");
  console.log("Waiting...", nextTimeout / 1000, "seconds.");

  setTimeout(main, nextTimeout);
}

main();
