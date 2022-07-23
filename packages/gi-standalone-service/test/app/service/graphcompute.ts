import assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/graphcompute.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('generatorGraphData', async () => {
    const obj = {
      id: 'test1',
      label: 'User',
      properties: {
        name: 'aaa',
        age: 18,
      },
    };
    const result: any = await ctx.service.graphcompute.generatorGraphData(obj);
    assert(result.id === obj.id);
    assert(result.data !== null);
  });
});
