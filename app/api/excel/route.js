import { NextResponse } from 'next/server';
import { generateChemvedaExcelBuffer } from '../../../lib/excel-generator';

export async function POST(request) {
  try {
    const { data, rfpInfo } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid or missing data array' }, { status: 400 });
    }

    const excelBuffer = generateChemvedaExcelBuffer(data, rfpInfo || {});

    return new Response(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${rfpInfo?.rfpCode || 'RFQ'}_Export.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error generating Excel in /api/excel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
