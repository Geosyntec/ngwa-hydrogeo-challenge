/**
 * Mock API: GET /api/classes?teacher=TEACHER_NAME
 * Returns a class dictionary: { className: listOfStudentNames }
 */

export type ClassesResponse = Record<string, string[]>

const MOCK_DELAY_MS = 600

const mockDataByTeacher: Record<string, ClassesResponse> = {
  default: {
    'Hydrogeology 101': ['Alice Smith', 'Bob Jones', 'Carol White', 'David Brown'],
    'Groundwater Lab': ['Eve Davis', 'Frank Miller', 'Grace Wilson'],
    'Advanced Aquifer Analysis': ['Henry Taylor', 'Ivy Anderson', 'Jack Thomas', 'Kate Martinez', 'Leo Garcia'],
  },
  teacher1: {
    'Hydrogeology 101': ['Alice Smith', 'Bob Jones', 'Carol White', 'David Brown'],
    'Groundwater Lab': ['Eve Davis', 'Frank Miller', 'Grace Wilson'],
    'Advanced Aquifer Analysis': ['Henry Taylor', 'Ivy Anderson', 'Jack Thomas', 'Kate Martinez', 'Leo Garcia'],
  },
}

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
  cache.set(key, data)
  return data
}
