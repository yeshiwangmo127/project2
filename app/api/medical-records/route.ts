import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        mr.id,
        mr.diagnosis,
        mr.prescription,
        mr.notes,
        mr.created_at,
        p.name as patient_name,
        d.name as doctor_name
      FROM medical_records mr
      LEFT JOIN users p ON mr.patient_id = p.id
      LEFT JOIN users d ON mr.doctor_id = d.id
      ORDER BY mr.created_at DESC
    `;
    
    const formattedRecords = rows.map(row => ({
      id: row.id,
      diagnosis: row.diagnosis,
      prescription: row.prescription,
      notes: row.notes,
      createdAt: row.created_at,
      patientName: row.patient_name,
      doctorName: row.doctor_name
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { patientId, doctorId, diagnosis, prescription, notes } = await request.json();

    const { rows } = await sql`
      INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription, notes, created_at)
      VALUES (${patientId}, ${doctorId}, ${diagnosis}, ${prescription}, ${notes}, CURRENT_TIMESTAMP)
      RETURNING id
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating medical record:', error);
    return NextResponse.json(
      { error: 'Failed to create medical record' },
      { status: 500 }
    );
  }
} 