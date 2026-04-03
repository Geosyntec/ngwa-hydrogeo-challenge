/**
 * Classes API: GET /api/classes, POST /api/update-class, DELETE /api/classes
 * teacher = user's email (from login).
 */

import { getApiUrl } from '../app/apiConfig'

export type StudentWithId = {
  id: string
  first_name: string
  last_name: string
}

export function studentDisplayName(s: StudentWithId): string {
  return [s.first_name, s.last_name].filter(Boolean).join(' ').trim() || '(no name)'
}

export type ClassData = {
  classId: string
  students: StudentWithId[]
}

export type ClassesResponse = Record<string, ClassData>

export async function fetchClasses(teacherEmail: string): Promise<ClassesResponse> {
  const base = getApiUrl()
  const q = new URLSearchParams({ teacher: teacherEmail.trim() })
  const res = await fetch(`${base}/api/classes?${q}`, { credentials: 'include' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = typeof data.detail === 'string' ? data.detail : 'Failed to load classes'
    throw new Error(msg)
  }
  return res.json()
}

/** Classes for a teacher user id (UUID), e.g. `/test?teacherID=…`. Same response shape as email-based fetch. */
export async function fetchClassesByTeacherId(teacherId: string): Promise<ClassesResponse> {
  const base = getApiUrl()
  const q = new URLSearchParams({ teacherID: teacherId.trim() })
  const res = await fetch(`${base}/api/classes?${q}`, { credentials: 'include' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = typeof data.detail === 'string' ? data.detail : 'Failed to load classes'
    throw new Error(msg)
  }
  return res.json()
}

export type ClassStudentsResponse = {
  students: StudentWithId[]
}

export async function fetchStudentsByClassId(classId: string): Promise<ClassStudentsResponse> {
  const base = getApiUrl()
  const q = new URLSearchParams({ classId: classId.trim() })
  const res = await fetch(`${base}/api/class-students?${q}`, { credentials: 'include' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = typeof data.detail === 'string' ? data.detail : 'Failed to load students'
    throw new Error(msg)
  }
  return res.json()
}

export type CreateClassPayload = {
  teacherId: string
  name: string
  students: Array<{ first_name: string; last_name: string }>
}

export type CreateClassResponse = {
  ok: boolean
  classId?: string
  message?: string
}

export async function createClass(
  teacherEmail: string,
  name: string,
  students: Array<{ first_name: string; last_name: string }>
): Promise<CreateClassResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId: teacherEmail,
      name: name.trim(),
      students,
    } as CreateClassPayload),
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  const message = typeof data.detail === 'string' ? data.detail : data.message
  if (!res.ok) throw new Error(message ?? 'Create class failed.')
  return { ok: true, classId: data.classId, message: data.message }
}

export type UpdateClassPayload = {
  classId: string
  teacherId: string
  students: Array<{ id?: string; first_name: string; last_name: string }>
  authToken: string
}

export type UpdateClassResponse = {
  ok: boolean
  message?: string
}

export async function updateClass(
  payload: UpdateClassPayload,
  teacherEmail: string
): Promise<UpdateClassResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/update-class`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  const message = typeof data.detail === 'string' ? data.detail : data.message
  if (!res.ok) throw new Error(message ?? 'Update failed.')
  return { ok: true, message: data.message }
}

export type DeleteClassResponse = {
  ok: boolean
  message?: string
}

export async function deleteClass(
  classId: string,
  teacherEmail: string
): Promise<DeleteClassResponse> {
  const base = getApiUrl()
  const q = new URLSearchParams({ classId, teacher: teacherEmail.trim() })
  const res = await fetch(`${base}/api/classes?${q}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  const message = typeof data.detail === 'string' ? data.detail : data.message
  if (!res.ok) throw new Error(message ?? 'Delete failed.')
  return { ok: true, message: data.message }
}
