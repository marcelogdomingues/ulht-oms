require('dotenv').config();

const { EventHubConsumerClient } = require("@azure/event-hubs");

const connectionString = process.env.AZURE_EVENT_HUB_CONNECTION_STRING;
const eventHubName = "shoppingordereventhub";
const consumerGroup = EventHubConsumerClient.defaultConsumerGroupName; 

async function main() {
    console.log("Starting to receive events...");
  
    const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
  
    // Função callback para processar eventos recebidos
    const processEvents = async (events, context) => {
      if (events.length === 0) {
        console.log("No events received within the time frame.");
        return;
      }
  
      for (const event of events) {
        console.log(
          `Received event: '${event.body}' from partition: '${context.partitionId}' at: '${event.enqueuedTimeUtc}'`
        );
      }
    };
  
    // Função callback para lidar com erros
    const processError = async (err) => {
      console.error(`Error occurred: ${err.message}`);
    };
  
    // Inicia a assinatura para receber eventos
    consumerClient.subscribe({
      processEvents,
      processError,
    });
  
    console.log("Listening for events...");
  }
  
  main().catch((err) => {
    console.error("Error running sample:", err.message);
  });