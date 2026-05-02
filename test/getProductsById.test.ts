import { handler } from '../lambda/getProductsById';

describe('getProductsById handler', () => {
  test('should return 200 and the product if it exists', async () => {
    const event = {
      pathParameters: { productId: '1' }
    };
    const result = await handler(event as any);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.id).toBe('1');
  });

  test('should return 404 if product does not exist', async () => {
    const event = {
      pathParameters: { productId: '999' }
    };
    const result = await handler(event as any);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Product not found');
  });
});