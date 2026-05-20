import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
const index = () => {
  const router =  useRouter()
  return (
    <SafeAreaView>
     <Pressable onPress={()=>{router.push('/(tabs)/pictures')}}>
      <Text>Tabs</Text>
     </Pressable>
    </SafeAreaView>
  
  )
}

export default index

const styles = StyleSheet.create({

})