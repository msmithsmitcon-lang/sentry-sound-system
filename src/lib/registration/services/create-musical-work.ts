export type CreateMusicalWorkInput = {
  work_title: string
  genre?: string
  mood?: string
  copyright_status?: string
  registration_status?: string
}

export async function createMusicalWork(
  input: CreateMusicalWorkInput
) {
  console.log("createMusicalWork input", input)

  return {
    success: false,
    message: "Create musical work service not implemented yet."
  }
}
