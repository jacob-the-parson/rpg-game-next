declare module '@clockworklabs/spacetimedb-typescript-sdk' {
  export class SpacetimeDBClient {
    constructor();

    connect(address: Address): void;
    disconnect(): void;
    callReducer(name: string, args: any[]): void;
    on(event: string, callback: Function): void;
    registerReducerCallback(name: string, callback: Function): void;
    subscribe(query: string): void;
    getSubscriptionCache(table: string): any[];
  }

  export class Address {
    static from_str(address: string): Address;
  }

  export interface ReducerContext {
    sender: string;
    timestamp: number;
  }
} 