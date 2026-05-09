import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// O'zingiz foydalanayotgan regionni kiriting (masalan, eu-north-1)
// const client = new DynamoDBClient({ region: "eu-north-1" });
const client = new DynamoDBClient({ region: "us-east-1" }); // N. Virginia regionini qo'ying
const ddbDocClient = DynamoDBDocumentClient.from(client);

const products = [
  {
    id: uuidv4(),
    title: "Sony PlayStation 5",
    description: "Next-gen gaming console with 4K support",
    price: 499
  },
  {
    id: uuidv4(),
    title: "DualSense Wireless Controller",
    description: "Haptic feedback and adaptive triggers",
    price: 69
  },
  {
    id: uuidv4(),
    title: "God of War Ragnarök",
    description: "Physical disc for PS5",
    price: 60
  }
];

const seed = async () => {
  console.log("Seeding started...");
  
  for (const product of products) {
    try {
      // 1. Products jadvaliga yozish
      await ddbDocClient.send(new PutCommand({
        TableName: "products",
        Item: product
      }));

      // 2. Stocks jadvaliga yozish
      await ddbDocClient.send(new PutCommand({
        TableName: "stocks",
        Item: {
          product_id: product.id,
          count: Math.floor(Math.random() * 20) + 1 // Tasodifiy qoldiq (1-20)
        }
      }));

      console.log(`Added: ${product.title}`);
    } catch (err) {
      console.error(`Error adding ${product.title}:`, err);
    }
  }
  
  console.log("Seeding finished successfully!");
};

seed();