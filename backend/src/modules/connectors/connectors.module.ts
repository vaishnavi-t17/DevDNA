import { Module } from '@nestjs/common';

import { QueuesModule } from '../queues/queues.module';
import { ConnectorRegistry } from './connector.registry';
import { SlackSyncScheduler } from './slack-sync.scheduler';
import { ConnectorSyncProcessor } from './connector-sync.processor';
import { ConnectorSyncService } from './connector-sync.service';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';

@Module({
  imports: [QueuesModule],
  controllers: [ConnectorsController],
  providers: [
    ConnectorRegistry,
    SlackSyncScheduler,
    ConnectorSyncService,
    ConnectorSyncProcessor,
    ConnectorsService,
  ],
  exports: [ConnectorRegistry, ConnectorSyncService],
})
export class ConnectorsModule {}
