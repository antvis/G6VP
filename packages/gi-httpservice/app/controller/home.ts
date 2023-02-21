import { Controller } from 'egg';

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html');
  }
}

export default HomeController;
