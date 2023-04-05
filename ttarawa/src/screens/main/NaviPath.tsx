import { View, Text, SafeAreaView, Pressable } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import { color, styles } from '@styles/GlobalStyles'
import { useRecoilValue, useRecoilState } from 'recoil'
import { navi } from '@styles/main'
import {
  pathState,
  markerListState,
  locationListState,
  departState,
} from '@store/atoms'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import EndModal from '@components/main/EndModal'
import NaviBottom from '@components/main/NaviBottom'
import NaviTimer from '@components/main/NaviTimer'
import TimerModal from '@components/main/TimerModal'
import ReturnModal from '@components/main/ReturnModal'
import Categories from '@components/main/Categories'

export default function NaviPath({ route, navigation }) {
  // 지도 위치 표시를 위한 현재 위치 받기
  const [userLocation, setUserLocation] = useState(null)

  // endmodal
  const [endmodalVisible, setEndModalVisible] = useState(false)
  const handleEndModalVisible = () => {
    setEndModalVisible(!endmodalVisible)
    console.log('End')
  }
  const cancleModal = () => {
    setEndModalVisible(false)
  }
  const goProfile = () => {
    navigation.navigate('Mypage', { screen: 'MyHistory' })
    setEndModalVisible(false)
  }
  // props로 넘긴 데이터 받기
  const { depart, destin, middlePoint } = route.params

  // 지도 중심을 설정을 위한 현재 위치 설정
  const [region, setRegion] = useState({
    latitude: depart.lat,
    longitude: depart.lng,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  })

  const resultData = useRecoilValue(pathState)

  const [markerList, setMarkerList] = useRecoilState(markerListState)

  // 지나간 경로 표시 위한 위치저장
  const [locationList, setLocationList] = useRecoilState(locationListState)
  const [watcher, setWatcher] =
    useState<Promise<Location.LocationSubscription> | null>(null)

  // 위치 저장
  const startLocationTracking = async () => {
    const watcher = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 0,
      },
      (location) => {
        const { latitude, longitude } = location.coords
        setLocationList((prevData) => [
          ...prevData,
          { longitude: longitude, latitude: latitude },
        ])
        setRegion({ ...region, latitude: latitude, longitude: longitude })
      },
    )
    setWatcher(watcher)
    return watcher
  }
  // 시작 시 실행
  useEffect(() => {
    startLocationTracking()
  }, [])
  // 저장 종료
  const stopLocationTracking = () => {
    if (!watcher) return

    watcher.then((locationSubscription: Location.LocationSubscription) => {
      locationSubscription.remove()
      setWatcher(null)
      console.log('stop it')
    })
  }
  // 주행시간 타이머
  const [ttime, setTTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(ttime)

  // 따릉 타이머
  const [modalVisible, setModalVisible] = useState(false)
  const [returnModalVisible, setReturnModalVisible] = useState(false)
  const [time, setTime] = useState(0)

  const handleModalVisible = () => {
    if (time == 0) {
      setModalVisible(!modalVisible)
    } else {
      setReturnModalVisible(!modalVisible)
    }
  }

  const handleSetTime = (newTime) => {
    setTime(newTime)
    setModalVisible(false)
    setReturnModalVisible(false)
  }

  const cancleTime = () => {
    setModalVisible(false)
  }
  const returnBike = () => {
    setReturnModalVisible(false)
  }

  return (
    <SafeAreaView style={[styles.androidSafeArea, navi.container]}>
      <NaviTimer time={time} onpress={handleModalVisible} />

      <Categories style={navi.categories} route={route} />

      <TimerModal
        modalVisible={modalVisible}
        handleSetTime={handleSetTime}
        cancleTime={cancleTime}
      />
      <ReturnModal
        modalVisible={returnModalVisible}
        handleSetTime={handleSetTime}
        cancleTime={returnBike}
      />

      {resultData && (
        <MapView
          style={navi.container}
          region={region}
          showsUserLocation
          followsUserLocation
          provider={PROVIDER_GOOGLE}
        >
          <Marker coordinate={depart} title="출발" pinColor={color.red} />
          <Marker coordinate={destin} title="도착" pinColor={color.red} />

          {markerList?.map((marker) => (
            <Marker
              key={marker.spotId}
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
              pinColor={color.primary}
              title={marker.name}
              description={
                marker.sub_category ? marker.sub_category : marker.subCategory
              }
            />
          ))}

          <Polyline
            coordinates={resultData}
            strokeColor="#AA0000"
            strokeWidth={5}
          />
        </MapView>
      )}
      <NaviBottom
        time={ttime}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        stop={stopLocationTracking}
        handleOn={handleEndModalVisible}
      />
      <EndModal
        time={currentTime}
        modalVisible={endmodalVisible}
        cancleModal={cancleModal}
        navigate={goProfile}
      />
    </SafeAreaView>
  )
}