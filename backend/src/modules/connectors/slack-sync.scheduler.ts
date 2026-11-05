import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bullmq';

import { CONNECTOR_SYNC_QUEUE } from '../../common/constants/rag.constants';
import { PrismaService } from '../../prisma';
import type { ConnectorSyncJobData } from './connector-sync.service';

@Injectable()
export class SlackSyncScheduler {
  private readonly logger = new Logger(SlackSyncScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(CONNECTOR_SYNC_QUEUE)
    private readonly syncQueue: Queue<ConnectorSyncJobData>,
  ) {}

  @Cron('*/5 * * * *')
  async syncSlackConnectors() {
    const connectors = await this.prisma.connector.findMany({
      where: {
        type: 'SLACK',
        status: { in: ['CONNECTED', 'ERROR'] },
      },
      select: { id: true },
    });

    const queuedJobs = await this.syncQueue.getJobs(
      ['waiting', 'active', 'delayed'],
      0,
      -1,
    );

    const busyConnectorIds = new Set(
      queuedJobs.map((job) => job.data.connectorId),
    );

    for (const connector of connectors) {
      if (busyConnectorIds.has(connector.id)) continue;

      await this.syncQueue.add(
        'sync',
        { connectorId: connector.id },
        {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 3000 },
        },
      );

      this.logger.log(
        `Queued scheduled Slack sync for ${connector.id}`,
      );
    }
  }
}
