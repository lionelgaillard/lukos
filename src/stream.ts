import { Readable, Writable } from 'stream';

export async function read(stream: Readable) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function write(stream: Writable, data: string) {
  return new Promise<void>(resolve => stream.write(data, 'utf8', () => resolve()));
}
