import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // List funksiyasi
    const getProductsList = new lambda.NodejsFunction(this, 'getProductsListHandler', {
      entry: path.join(__dirname, '../lambda/getProductsList.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
    });

    // ID bo'yicha funksiya
    const getProductsById = new lambda.NodejsFunction(this, 'getProductsByIdHandler', {
      entry: path.join(__dirname, '../lambda/getProductsById.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductApi', {
      restApiName: 'Product Service API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));

    const product = products.addResource('{productId}');
    product.addMethod('GET', new apigateway.LambdaIntegration(getProductsById));
  }
}