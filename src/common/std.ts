import { Readable, Writable } from 'stream';

export function input() {
  return read(process.stdin);
}

export function output(data: string) {
  return write(process.stdout, data);
}

export async function read(stream: Readable) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

export function write(stream: Writable, data: string) {
  return new Promise(resolve => stream.write(data, resolve));
}
