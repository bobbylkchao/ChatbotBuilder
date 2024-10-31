export const resolvers = {
  Query: {
    books: () => books,
    getOneBook: (_, { name }) => {
      return {
        title: name,
        author: 'Kate Chopin',
      }
    },
  },
}
