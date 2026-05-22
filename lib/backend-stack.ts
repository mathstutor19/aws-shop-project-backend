import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDB jadvallarini nomlari orqali ulash
    // Eslatma: Jadvallar us-east-1 regionida yaratilgan deb hisoblaymiz
    const productsTable = dynamodb.Table.fromTableName(this, 'ProductsTable', 'products');
    const stocksTable = dynamodb.Table.fromTableName(this, 'StocksTable', 'stocks');

    // 2. getProductsList Lambda funksiyasi
    const getProductsList = new lambda.NodejsFunction(this, 'getProductsListHandler', {
      entry: path.join(__dirname, '../lambda/getProductsList.ts'),
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      environment: {
        PRODUCTS_TABLE: 'products',
        STOCKS_TABLE: 'stocks',
      },
    });

    // 3. IAM Policy - Lambdaga DynamoDB jadvallarini o'qishga ruxsat berish
    // Bu qism "Internal Server Error" (Access Denied) xatosini tuzatadi
    getProductsList.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:Scan', 'dynamodb:Query', 'dynamodb:GetItem'],
      resources: [
        `arn:aws:dynamodb:us-east-1:${cdk.Stack.of(this).account}:table/products`,
        `arn:aws:dynamodb:us-east-1:${cdk.Stack.of(this).account}:table/stocks`
      ],
    }));

    // 4. API Gateway yaratish
    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // /products resursini yaratish va GET metodini Lambdaga bog'lash
    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));

    // 5. Deploydan keyin URL manzilini terminalda va outputs.json da ko'rsatish
    new CfnOutput(this, 'apiUrl', {
      value: api.url,
      description: 'API Gateway URL manzili',
    });
  }
}