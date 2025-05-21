export function json(value: any, status?: number) {
  return new Response(
    JSON.stringify(value),
    {
      status: status ?? 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}
