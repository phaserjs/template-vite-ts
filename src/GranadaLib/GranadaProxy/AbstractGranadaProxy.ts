export abstract class AbstractGranadaProxy {
  protected hasConnectedToAPI: boolean = false;
  protected apiCheckTime: number = 100;
  protected timeoutHandle: number | null = null;

  abstract connectToAPI(): Promise<void>;
}
