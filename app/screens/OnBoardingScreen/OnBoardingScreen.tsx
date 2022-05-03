import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAssets } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QueAuthClient from "../../api/QueAuthUtils";
import RoundedButton from "../../components/buttons/RoundedButton";
import CommonHeader from "../../components/headers/CommonHeader";
import {
  OnBoardingStackNavigationProp,
  OnBoardingStackParamList,
} from "../../navigators/OnBoardingNavigator";
import { RootStackNavigationProp } from "../../navigators/RootNavigator";
import { bColors, bFont, bSpace } from "../../styles/base";
import screens from "../../styles/screens";
import SignInScreen from "./SignInScreen/SignInScreen";
import SignUpScreen from "./SignUpScreen/SignUpScreen";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

const styles = StyleSheet.create({
  contextContainer: {
    flexGrow: 0.1,
    marginHorizontal: bSpace.xlarge * 2,
  },
  catchPhraseContainer: {
    paddingTop: bSpace.large,
  },
  catchPhraseText: {
    fontWeight: "bold",
    fontSize: bFont.xlarge + bFont.middle,
    color: bColors.white,
  },
  buttonContainer: {
    paddingTop: bSpace.xlarge + bSpace.middle,
  },
  signInSuggestionText: { color: bColors.white, fontSize: bFont.middle },
  signInButtonText: { color: bColors.primary },
});

const OnBoardingStack = createNativeStackNavigator<OnBoardingStackParamList>();

/**
 * 회원가입 OR 로그인 권유 온보딩 화면, 네비게이션으로 이루어짐
 */
function OnBoardingScreen() {
  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <OnBoardingStack.Navigator screenOptions={{ headerShown: false }}>
        <OnBoardingStack.Screen
          name="CatchPhrase"
          component={CatchPhraseScreen}
        />
        <OnBoardingStack.Screen
          options={{
            headerShown: true,
            header: (props) => <CommonHeader hideButton {...props} />,
          }}
          name="SignIn"
          component={SignInScreen}
        />
        <OnBoardingStack.Screen
          name="SignUp"
          component={SignUpScreen}
          initialParams={{}}
        />
      </OnBoardingStack.Navigator>
    </SafeAreaView>
  );
}

WebBrowser.maybeCompleteAuthSession();

/**
 * 캐치프레이즈 & 회원가입 권유
 * 백그라운드에 휘황찬란한 GIF
 * @returns
 */
function CatchPhraseScreen() {
  /** TBD: 화면 최초 렌더링 후 현재 인증정보 확인해서 main screen으로 넘어가기 */

  /** TBD: 영상 교체하기 */
  const mockingVideoSrc = "https://i.postimg.cc/mgdFtJd5/welcome.gif";

  // 임시 네비게이터입니다.
  const onBoardingNavigator = useNavigation<OnBoardingStackNavigationProp>();
  const rootNavigator = useNavigation<RootStackNavigationProp>();

  const [assets, error] = useAssets([
    require("../../assets/custom/logo-colored.png"),
    require("../../assets/custom/google-icon.png"),
    require("../../assets/custom/que-icon.png"),
  ]);

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: "id_token",
    clientId:
      "944223797321-3fc5f5sn2l4vl3k3feuf61ckb7mirheb.apps.googleusercontent.com",
  });

  useEffect(() => {
    // console.log(response);
    // if (response?.type === "success") {
    //   const { id_token } = response.params;
    //   QueAuthClient.signInWithGoogleMob(id_token)
    //     .then((result) => {})
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }
  }, [response]);

  /**
   * Google Auth를 통한 계정 인증
   * 이미 등록된 Google 계정이 있으면 로그인 진행 후 main 화면으로
   * 등록된 Google 계정이 없으면 회원 가입 화면으로
   */
  const signWithGoogle = useCallback(async () => {
    const result = await promptAsync();

    if (result.type === "success") {
      const { id_token } = result.params;

      try {
        await QueAuthClient.signInWithGoogleMob(id_token);
      } catch (error) {
        alert(`구글 로그인 과정에서 오류가 발생했습니다. ${error}`);
      }
    } else {
      // 오류 처리
    }

    // if (result) {
    //   // 로그인 성공함
    //   // navigate to signup screen with google user info
    //   onBoardingNavigator.navigate("SignUp", {
    //     someGoogleTokenShit: { userName: "삼식이" },
    //   });
    // }
  }, [response, request]);

  const signUpNewQueUser = useCallback(() => {
    onBoardingNavigator.navigate("SignUp", {});
  }, []);

  return (
    <SafeAreaView style={[screens.defaultScreenLayout]}>
      <StatusBar translucent={true} />
      <ImageBackground
        testID="serviceMockingVideo"
        source={{ uri: mockingVideoSrc }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View testID="emptySpace" style={{ flex: 1 }}></View>
        <LinearGradient
          testID="darkOverlay"
          colors={["transparent", bColors.black]}
          start={{ x: 0, y: -1 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <View
          testID="onBoardingContextContainer"
          style={styles.contextContainer}
        >
          <View testID="logoContainer">
            {assets ? (
              <Image source={assets[0] as ImageSourcePropType}></Image>
            ) : null}
          </View>
          <View
            testID="catchPhraseContainer"
            style={styles.catchPhraseContainer}
          >
            <Text style={styles.catchPhraseText}>
              당신의 콘서트를{"\n"}
              시작하세요.
            </Text>
          </View>
          <View testID="signUpButtonContainer" style={styles.buttonContainer}>
            <RoundedButton
              testID="googleSignButton"
              buttonType={request ? "white" : "disabled"}
              style={{
                height: bFont.xlarge + bFont.large,
                marginBottom: bSpace.xlarge,
                fontSize: bFont.large,
              }}
              bold={true}
              iconData={{
                iconType: "image",
                withText: true,
                iconSize: bFont.xlarge,
                imageSrc: assets ? (assets[1] as ImageSourcePropType) : {},
              }}
              onPress={signWithGoogle}
            >
              Google 계정으로 계속하기
            </RoundedButton>
            <RoundedButton
              testID="queSignUpButton"
              buttonType="primary"
              bold={true}
              style={{
                height: bFont.xlarge + bFont.large,
                marginBottom: bSpace.xlarge,
                fontSize: bFont.large,
              }}
              iconData={{
                iconType: "image",
                withText: true,
                iconSize: bFont.xlarge,
                imageSrc: assets ? (assets[2] as ImageSourcePropType) : {},
              }}
              onPress={signUpNewQueUser}
            >
              QUE 계정 만들기
            </RoundedButton>
          </View>
          <View testID="signInTextContainer">
            <Text style={styles.signInSuggestionText}>이미 계정이 있다면</Text>
            <Text>
              {/** 이 Text 컴포넌트를 통한 Wrapping은 하위 컴포넌트의 크기가 텍스트의 길이에 맞춰지도록 만듭니다. */}
              <Text
                style={[styles.signInSuggestionText, styles.signInButtonText]}
                onPress={() => {
                  onBoardingNavigator.navigate("SignIn");
                  // onBoardingNavigator.navigate("SignIn");
                }}
                accessibilityRole="button"
              >
                로그인
              </Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default OnBoardingScreen;
