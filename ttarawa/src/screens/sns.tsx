import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { color } from '~/styles/GlobalStyles'
const imagePath = require('../../assets/icon.png')

export default function Sns() {
  return (
    <View>
      <Text>SNS</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 145,
    padding: 20,
  },
  Logo: {
    width: 90,
    height: 70,
  },
})