import { Module } from '@nestjs/common';
import { TemporalClient, TEMPORAL_CLIENT } from './temporal.client';

@Module({
  providers: [
    {
      provide: TEMPORAL_CLIENT,
      useClass: TemporalClient,
    },
  ],
  exports: [TEMPORAL_CLIENT],
})
export class TemporalModule {}
