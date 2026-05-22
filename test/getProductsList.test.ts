import { handler } from '../lambda/getProductsList';
import { products } from '../lambda/products';

describe('getProductsList handler', () => {
  test('should return 200 status code and all products', async () => {
    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(products);
    expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
  });
});