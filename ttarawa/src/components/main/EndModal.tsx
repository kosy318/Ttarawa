import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { color } from '@styles/GlobalStyles'
import ViewShot, { captureRef } from 'react-native-view-shot'
import Road from '@screens/main/Road'
import axios from 'axios'
import sns from '@services/sns'
import { v4 as uuidv4 } from 'uuid'

const EndModal = ({ time, modalVisible, cancleModal, navigate }) => {
  // 캡쳐

  const uploadHistoryData = async () => {
    const imageUri = await captureRef(viewShotRef, {
      format: 'jpg',
      quality: 0.8,
    })

    // 파일명 중복 안되게 uuid 로 저장
    const uuid = uuidv4()
    const filename = `${uuid}.jpg`
    const imageData = {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename,
    }
    const formData = new FormData()

    formData.append('personal', 1)
    formData.append('time', time)
    formData.append('distance', 1)
    // formData.append('distance', getTotalDistance())
    formData.append('content', '')
    formData.append('startAddress', 'bb')
    formData.append('endAddress', 'cc')
    formData.append('image', imageData)

    sns
      .savePost(formData)
      .then((res) => {
        console.log(res)
        navigate()
      })
      .catch((err) => {
        console.log(err)
        console.log(formData)
      })
  }

  const viewShotRef = useRef(null)

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <Pressable style={styles.modalContainer}>
        <View
          style={{
            height: '70%',
            width: '90%',
            backgroundColor: color.white,
            borderRadius: 10,
          }}
        >
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.9 }}
            style={{ width: 500, height: 500 }}
          >
            <Road />
          </ViewShot>
          <Text style={styles.modalButton} onPress={() => uploadHistoryData()}>
            저장
          </Text>

          <Text style={styles.modalButton} onPress={() => cancleModal()}>
            취소
          </Text>
          {/* 
          <Text style={styles.modalButton} onPress={() => handlePress(time)}>
            확인
          </Text> */}
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: color.modalBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 10,
  },
}

export default EndModal
