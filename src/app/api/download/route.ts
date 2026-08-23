import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), '..', 'enadia-project.tar.gz');
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': 'attachment; filename="enadia-project.tar.gz"',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Arquivo nao encontrado.' },
      { status: 404 }
    );
  }
}
