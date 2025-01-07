require('dotenv').config();
const mysql = require('mysql');
const { EventHubConsumerClient } = require("@azure/event-hubs");

const connectionString = process.env.AZURE_EVENT_HUB_CONNECTION_STRING;
const eventHubName = "shoppingordereventhub";
const consumerGroup = EventHubConsumerClient.defaultConsumerGroupName;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'orders_db',
  insecureAuth: true,
  allowPublicKeyRetrieval: true,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

async function main() {
  console.log("Starting to receive events...");

  const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

  let subscription;

  const processEvents = async (events, context) => {
    if (events.length === 0) {
      console.log("No events received within the time frame.");
      return;
    }

    for (const event of events) {
      try {
        console.log(`Received event: '${JSON.stringify(event.body)}' from partition: '${context.partitionId}' at: '${event.enqueuedTimeUtc}'`);

        let order = typeof event.body === "object" ? event.body : JSON.parse(event.body);

        // Extract data from the nested `data` field
        const { id, customer_name, product_name, quantity, order_date } = order.data || {};

        if (!id || !customer_name || !product_name || !quantity || !order_date) {
          console.error("Missing required fields in order:", order);
          continue; // Skip invalid data
        }

        const query = 'INSERT INTO orders (customer_name, product_name, quantity, order_date) VALUES (?, ?, ?, ?)';
        db.query(query, [customer_name, product_name, quantity, new Date(order_date)], (err, result) => {
          if (err) {
            console.error("Failed to insert order into database:", err.message);
            return;
          }
          console.log('Order inserted into database:', result.insertId);
        });
      } catch (err) {
        console.error("Error processing event:", err.message);
      }
    }
  };

  const processError = async (err) => {
    console.error(`Error occurred: ${err.message}`);
  };

  subscription = consumerClient.subscribe(
    {
      processEvents,
      processError,
    },
    { maxWaitTimeInSeconds: 30 } // Automatically stops after 30 seconds
  );

  // Stop receiving events after 30 seconds
  setTimeout(async () => {
    console.log("Stopping event processing after 30 seconds.");
    await subscription.close(); // Close the subscription
    await consumerClient.close(); // Close the client
    console.log("Event processing stopped.");
    db.end((err) => {
      if (err) console.error("Error closing database connection:", err.message);
      else console.log("Database connection closed.");
    });
  }, 30000);

  console.log("Listening for events...");
}

main().catch((err) => {
  console.error("Error running sample:", err.message);
});
