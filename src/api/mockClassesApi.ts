/**
 * Mock API: GET /api/classes?teacher=TEACHER_NAME
 * Returns classes with students; each student has a read-only globalID (UUID).
 *
 * POST /update-class — Update a class's student list.
 */

/** Student with backend-assigned read-only global ID (UUID). */
export type StudentWithId = {
  id: string
  first_name: string
  last_name: string
}

/** Display name for a student (first + last). */
export function studentDisplayName(s: StudentWithId): string {
  return [s.first_name, s.last_name].filter(Boolean).join(' ').trim() || '(no name)'
}

/** Class data: class id plus list of students with ids. */
export type ClassData = {
  classId: string
  students: StudentWithId[]
}

/** Keyed by class name for display; each value has classId and students. */
export type ClassesResponse = Record<string, ClassData>

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `mock-${Math.random().toString(36).slice(2, 15)}`
}

function parseFullName(full: string): { first_name: string; last_name: string } {
  const parts = full.trim().split(/\s+/)
  if (parts.length === 0) return { first_name: '', last_name: '' }
  if (parts.length === 1) return { first_name: parts[0], last_name: '' }
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') }
}

function studentsWithIds(fullNames: string[]): StudentWithId[] {
  return fullNames.map((full) => {
    const { first_name, last_name } = parseFullName(full)
    return { id: generateId(), first_name, last_name }
  })
}

const MOCK_DELAY_MS = 600

/** Build mock data once with UUIDs per teacher. */
function buildMockData(): Record<string, ClassesResponse> {
  const makeClass = (className: string, names: string[]): ClassData => ({
    classId: generateId(),
    students: studentsWithIds(names),
  })
  const defaultClasses: ClassesResponse = {
    'Hydrogeology 101': makeClass('Hydrogeology 101', [
      'Alice Smith',
      'Bob Jones',
      'Carol White',
      'David Brown',
    ]),
    'Groundwater Lab': makeClass('Groundwater Lab', [
      'Eve Davis',
      'Frank Miller',
      'Grace Wilson',
    ]),
    'Advanced Aquifer Analysis': makeClass('Advanced Aquifer Analysis', [
      'Henry Taylor',
      'Ivy Anderson',
      'Jack Thomas',
      'Kate Martinez',
      'Leo Garcia',
    ]),
  }
  const copyForTeacher = (src: ClassesResponse): ClassesResponse =>
    Object.fromEntries(
      Object.entries(src).map(([name, data]) => [
        name,
        {
          classId: generateId(),
          students: data.students.map((s) => ({
            id: generateId(),
            first_name: s.first_name,
            last_name: s.last_name,
          })),
        },
      ])
    )
  return {
    default: copyForTeacher(defaultClasses),
    teacher1: copyForTeacher(defaultClasses),
  }
}

const mockDataByTeacher = buildMockData()

const cache = new Map<string, ClassesResponse>()

/**
 * Simulates a memoized GET request to /api/classes?teacher=TEACHER_NAME.
 * Returns cached result when the same teacher is requested again.
 */
export async function fetchClasses(teacherName: string): Promise<ClassesResponse> {
  const key = teacherName.trim() || 'default'
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))

  const data = mockDataByTeacher[key] ?? mockDataByTeacher.default ?? {}
  // Clone so we can mutate in updateClass without affecting the template
  const clone = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      { classId: v.classId, students: v.students.map((s) => ({ ...s })) },
    ])
  )
  cache.set(key, clone)
  return clone
}

/** Payload for POST /update-class */
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

/**
 * Simulates POST /update-class. Updates the in-memory cache for the teacher's
 * class so subsequent fetchClasses reflects the change.
 */
export async function updateClass(
  payload: UpdateClassPayload,
  teacherName: string
): Promise<UpdateClassResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const key = teacherName.trim() || 'default'
  let data = cache.get(key)
  if (!data) {
    const template = mockDataByTeacher[key] ?? mockDataByTeacher.default
    if (!template) return { ok: false, message: 'Teacher not found.' }
    data = Object.fromEntries(
      Object.entries(template).map(([n, v]) => [
        n,
        { classId: v.classId, students: v.students.map((s) => ({ ...s })) },
      ])
    )
    cache.set(key, data)
  }
  const entry = Object.entries(data).find(([, v]) => v.classId === payload.classId)
  if (!entry) return { ok: false, message: 'Class not found.' }
  const [, classData] = entry
  classData.students = payload.students.map((s) =>
    s.id
      ? { id: s.id, first_name: s.first_name.trim(), last_name: s.last_name.trim() }
      : { id: generateId(), first_name: s.first_name.trim(), last_name: s.last_name.trim() }
  )
  // eslint-disable-next-line no-console
  console.log('[mock] POST /update-class', payload)
  return { ok: true, message: 'Class updated.' }
}
