import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  // Qo'shimcha topshiriq: Logger (+7.5 ball)
  console.log("Incoming request to getProductsList");

  try {
    // 1. Ikkala jadvaldan ma'lumotlarni parallel o'qiymiz
    const [productsResult, stocksResult] = await Promise.all([
      ddb.send(new ScanCommand({ TableName: process.env.PRODUCTS_TABLE })),
      ddb.send(new ScanCommand({ TableName: process.env.STOCKS_TABLE }))
    ]);

    const products = productsResult.Items || [];
    const stocks = stocksResult.Items || [];

    // 2. Birlashtirish (Join) mantiqi
    const joinedProducts = products.map(product => {
      const stock = stocks.find(s => s.product_id === product.id);
      return {
        ...product,
        count: stock ? stock.count : 0 // Agar stog'i bo'lmasa 0 qaytaramiz
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(joinedProducts),
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    // Qo'shimcha topshiriq: 500 error (+7.5 ball)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};