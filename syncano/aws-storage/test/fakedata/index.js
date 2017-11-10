import faker from 'faker'

export const bucket = () => ({
  bucket_name: faker.name.lastName(0),
  region: 'eu-central-1'
})
