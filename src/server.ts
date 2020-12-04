import {ApplicationConfig} from '@loopback/core';
import {once} from 'events';
import express, {Request, Response} from 'express';
import * as http from 'http';
import {AddressInfo} from 'net';
import * as path from 'path';
import {FestigramApiLbV2Application} from './application';
import {juggler} from '@loopback/repository'

const loopback = require('loopback');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

export class ExpressServer {
  private app: express.Application;
  public readonly lbApp: FestigramApiLbV2Application;
  public server?: http.Server;
  public url: String;

  constructor(options: ApplicationConfig = {}) {
    this.app = express();
    this.lbApp = new FestigramApiLbV2Application(options);

    // Middleware migrated from LoopBack 3
    this.app.use(loopback.favicon("$!../../public/fav/favicon.ico"));
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(helmet());

    // Mount the LB4 REST API
    this.app.use('/api', this.lbApp.requestHandler);

    // Custom Express routes
    this.app.get('/ping', function (_req: Request, res: Response) {
      res.send('pong');
    });

    // Serve static files in the public folder
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  public async boot() {
    await this.lbApp.boot();
    const dsName = 'FestivalMaster';
    const fmDs = new juggler.DataSource({
      name: dsName,
      connector: require('loopback-connector-mysql'),
      url: process.env.JAWSDB_URL + '?connectionLimit=' + process.env.CONN_LIMIT + '&debug=false',
    });
    await fmDs.connect();
    this.lbApp.dataSource(fmDs, dsName);

  }

  public async start() {
    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port || 8080;
    const host = this.lbApp.restServer.config.host || 'localhost';
    this.server = this.app.listen(port, host);
    await once(this.server, 'listening');
    const add = <AddressInfo>this.server.address();
    this.url = `http://${add.address}:${add.port}`;
  }

  public async stop() {
    if (!this.server) return;
    await this.lbApp.stop();
    this.server.close();
    await once(this.server, 'close');
    this.server = undefined;
  }
}