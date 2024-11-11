import React from 'react'
import { Stack } from 'expo-router'

const HomeScreen = () => {
  return (<>
      <Stack.Screen options={{ title: 'Home' }} />
      <div>HomeScreen</div>
  </>

  )
}

export default HomeScreen