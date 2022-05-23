import {
  Platform,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import screens from "../../styles/screens";
import { uploadScreenStyle } from "./UploadScreen.style";
import { useNavigation } from "@react-navigation/native";
import { UploadStackNavigationProp } from "../../navigators/UploadNavigator";
import { useCallback, useContext, useEffect } from "react";
import { UploadContext } from "./UploadContext";
import * as ImagePicker from "expo-image-picker";
import { checkFileSize, checkSizeLimitMB } from "../../utils/file";
import { useToast } from "native-base";

const SIZE_LIMIT = 20; // MB

/**
 * 1. 영상 업로드 유형 선택
 * 새 영상 촬영 기능의 경우 용량 문제도 있고 구현 범위 축소에 따라 TBD
 */
function SelectTypeScreen() {
  const uploadNavigator = useNavigation<UploadStackNavigationProp>();

  const Toast = useToast();

  /** Upload Context */
  const { setButtonHidden, videoPath, setVideoPath } =
    useContext(UploadContext);

  /** 사용자가 이미 가지고 있는 영상을 업로드 하는 함수 */
  const uploadExistingVideo = useCallback(async () => {
    /** 갤러리 권한 요청 */
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    /** 권한 요청 거부됨 */
    if (permissionResult.granted === false) {
      if (Platform.OS === "android")
        // 어차피 Android 한정 코드라 다음 토스트 사용
        ToastAndroid.show("권한이 필요합니다.", ToastAndroid.SHORT);
      else {
        alert("권한이 필요합니다.");
      }
      return;
    }

    /** 영상 가져오기 */
    // https://github.com/expo/expo/issues/9374
    // TBD 알려진 expo image picker의 오류로 인해 큰 파일 업로드 시 문제 발생함.
    // 심지어 핸들링도 안됨.
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low,
    });

    if (!pickerResult.cancelled) {
      const fileSize = await checkFileSize(pickerResult.uri);
      if (!fileSize) {
        // TBD 이런 경우 파악해서 에러 처리
        return;
      }
      if (!checkSizeLimitMB(fileSize, SIZE_LIMIT)) {
        // 사이즈 제한보다 영상 크기가 작은지 파악
        Toast.show({
          description: `영상이 너무 큽니다! (크기 제한 : ${SIZE_LIMIT}MB)`,
        });
        return;
      }

      /** 컨텍스트에 영상 경로 등록 */
      setVideoPath(pickerResult.uri);

      /** 메타 정보 입력 화면으로 이동 */
      uploadNavigator.navigate("InputData");
    }
  }, []);

  /** 최초 렌더링 시 버튼 숨기기 */
  useEffect(() => {
    setButtonHidden(true);
  }, []);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <View style={uploadScreenStyle.largeButtonsContainer}>
        <TouchableOpacity
          style={[uploadScreenStyle.largeButton]}
          onPress={uploadExistingVideo}
        >
          <MaterialIcons
            style={uploadScreenStyle.largeButtonIcon}
            name="file-upload"
          />
          <Text style={uploadScreenStyle.largeButtonText}>파일 업로드</Text>
        </TouchableOpacity>
        <View style={uploadScreenStyle.seperation} />
        <TouchableOpacity
          style={[uploadScreenStyle.largeButton]}
          onPress={() => {
            alert("개발중입니다. 아임 쏘리");
          }}
        >
          <MaterialIcons
            style={[
              uploadScreenStyle.largeButtonIcon,
              uploadScreenStyle.largeButtonDisabled,
            ]}
            name="video-call"
          ></MaterialIcons>
          <Text
            style={[
              uploadScreenStyle.largeButtonText,
              uploadScreenStyle.largeButtonDisabled,
            ]}
          >
            새 영상 촬영
          </Text>
        </TouchableOpacity>
        {/* TBD 영상 사이즈 관련 안내 */}
      </View>
    </SafeAreaView>
  );
}

export default SelectTypeScreen;