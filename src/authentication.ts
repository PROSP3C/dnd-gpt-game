export const authenticate = async (username: string, password: string) => {
  return {
    user: {
      username,
      name: 'Test User',
    },
  }
}
