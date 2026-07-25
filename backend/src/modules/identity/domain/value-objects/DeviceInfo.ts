import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

interface DeviceInfoProps {
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  platform?: string;
  deviceName?: string;
  userAgent: string;
}

export class DeviceInfo extends ValueObject<DeviceInfoProps> {
  get browser(): string | undefined {
    return this.props.browser;
  }

  get browserVersion(): string | undefined {
    return this.props.browserVersion;
  }

  get operatingSystem(): string | undefined {
    return this.props.operatingSystem;
  }

  get platform(): string | undefined {
    return this.props.platform;
  }

  get deviceName(): string | undefined {
    return this.props.deviceName;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  private constructor(props: DeviceInfoProps) {
    super(props);
  }

  public static create(props: DeviceInfoProps): Result<DeviceInfo> {
    if (!props.userAgent) {
      return Result.fail<DeviceInfo>('User agent is required');
    }
    return Result.ok<DeviceInfo>(new DeviceInfo(props));
  }
}
