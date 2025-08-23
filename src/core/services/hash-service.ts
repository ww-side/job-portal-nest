export interface HashService {
  hash(value: string, saltOrRounds?: number): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
