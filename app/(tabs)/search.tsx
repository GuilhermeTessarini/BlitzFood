import seed from '@/lib/seed'
import React from 'react'
import { Button, SafeAreaView, Text } from 'react-native'

const Search = () => {
  return (
    <SafeAreaView>
      <Text>Search</Text>

      <Button title='Seed' onPress={() => seed().catch((error) => console.error('FAILED to seed the database.', error))}/>
    </SafeAreaView>
  )
}

export default Search