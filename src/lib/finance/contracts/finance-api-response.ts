export type FinanceApiSuccess<T> = {
  success: true
  data: T
  meta: {
    workspaceId: string
    generatedAt: string
  }
}

export type FinanceApiError = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type FinanceApiResponse<T> =
  | FinanceApiSuccess<T>
  | FinanceApiError
