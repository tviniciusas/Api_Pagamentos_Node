import { HealthController } from '../../../src/presentation/controllers/health.controller';

describe('HealthController', () => {
  it('returns ok status with version and timestamp', () => {
    process.env.APP_VERSION = 'sha-test';
    const result = new HealthController().check();

    expect(result.status).toBe('ok');
    expect(result.version).toBe('sha-test');
    expect(typeof result.uptime).toBe('number');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });
});
