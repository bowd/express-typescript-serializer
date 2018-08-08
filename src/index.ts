import "reflect-metadata";
import express, { Router, Request, Response, Next } from "express";
import { Controller, Action } from "./Controller";
import { User } from "./model";
import { serialize } from "class-transformer";

class UserService {
  getAll() {
    return [new User(1), new User(2)];
  }
  getOne() {
    return [new User(3)];
  }
}

export class RatingsController extends Controller {
  public baseRoute = "ratings/";
  private service = new UserService();

  @Action.get("/")
  async handleIndex(req: Request, res: Response) {
    res.setHeader("Content-Type", "application/json");
    res.send(serialize(this.service.getAll(), { groups: ["withSecrets"] }));
  }
}

export class OtherController extends Controller {
  public baseRoute = "others/";
  private service = new UserService();

  @Action.get("/")
  async handleIndex(req: Request, res: Response) {
    res.setHeader("Content-Type", "application/json");
    res.send(serialize(this.service.getOne()));
  }

  @Action.get("/hello")
  async handleHello(req: Request, res: Response) {
    res.setHeader("Content-Type", "application/json");
    res.send(
      serialize(this.service.getAll(), {
        groups: ["withSecrets", "withFallback"]
      })
    );
  }
}

const ratings = new RatingsController();
const others = new OtherController();
const routes = [ratings, others];

const app = express();
app.set("host", "localhost");
app.set("port", "5555");

for (let route of routes) {
  app.use("/" + route.baseRoute, route.router, route.middleware);
}

app.listen(5555);