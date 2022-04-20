import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import CommonTextInput from "../../../components/inputs/CommonTextInput";
import screens from "../../../styles/screens";
import {
  validatePassword,
  ValidatePasswordReasons,
} from "../../../utils/validator";
import { SignUpContext } from "./SignUpContext";
import { signUpScreenStyle } from "./SignUpScreen.style";

const styles = signUpScreenStyle;

const guidanceTextSet: { [key in ValidatePasswordReasons]: string } = {
  short: `비밀번호는 숫자와 영문자를 포함해야 하며,\n8자리 이상이어야 합니다.`,
  number: "숫자를 포함해야 합니다.",
  pass: "",
  letter: "영문자를 포함해야 합니다.",
  space: "비밀번호의 시작과 끝은 공백일 수 없습니다.",
  special: `다음 특수기호만 포함할 수 있습니다.\n! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ] ^ _ \` { | } ~ \\`,
};

/**
 * Step 2. 비밀번호 설정 화면
 * @returns
 */
export default function SetPasswordScreen() {
  /** 사용자 입력 비밀번호 데이터 */
  const [password, setPassword] = useState<string>("");
  /** 사용자 입력 비밀번호 검증 */
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  /** 검증 과정에서 경고 여부 */
  const [isWarningGuide, setIsWarningGuide] = useState<boolean>(false);
  /** 사용자 입력 확인용 비밀번호 데이터 */
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  /** 비밀번호 안내문구 */
  const [guidance, setGuidance] = useState<string>(guidanceTextSet.short);

  /** SignUp 컨텍스트 사용 */
  const {
    buttonEnabled,
    setButtonEnabled,
    buttonAction,
    setButtonAction,
    signUpNavigator,
    setHideSkipButton,
  } = useContext(SignUpContext);

  /** 사용자가 입력한 비밀번호를 실제 사용할 수 있도록 서버에 등록 */
  const postUserPassword = useCallback(() => {
    // TBD 비밀번호 등록

    // 다음 화면으로 이동
    signUpNavigator!.navigate("SetUserProfile");
  }, [password]);

  /** 최초 렌더링 시 건너뛰기 버튼 숨기기 */
  useEffect(() => {
    setHideSkipButton(true);
  }, []);

  /** 사용 가능한 비밀번호인지 검증 */
  useEffect(() => {
    const validation = validatePassword(password);

    // 비밀번호 변경되면 미리 입력되어있던 비밀번호 확인 입력은 초기화
    setConfirmPassword("");

    setIsValidPassword(validation[0]);

    setGuidance(guidanceTextSet[validation[1]]);

    // 길이가 짧은 경우엔 경고X
    validation[1] === "short" || validation[1] === "pass"
      ? setIsWarningGuide(false)
      : setIsWarningGuide(true);
  }, [password]);

  /** 비밀번호 확인 */
  useEffect(() => {
    if (isValidPassword && password == confirmPassword) {
      setButtonAction({ action: postUserPassword });
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [password, confirmPassword]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <View style={styles.upperContainer}>
        <CommonTextInput
          style={styles.textInputUpper}
          autoFocus
          /** TBD : textinput의 버튼을 누르면 비밀번호 드러내기 */
          secureTextEntry={true}
          invalid={isWarningGuide}
          accessibilityRole="text"
          textContentType="password"
          placeholder="비밀번호를 입력해주세요."
          onChangeText={(newStr) => setPassword(newStr)}
          value={password}
        />
        <Text
          style={[
            styles.messageText,
            isWarningGuide ? styles.errorMessageText : styles.messageText,
          ]}
        >
          {guidance}
        </Text>
        {isValidPassword ? (
          <CommonTextInput
            style={styles.textInputUpper}
            secureTextEntry={true}
            invalid={confirmPassword.length != 0 && !buttonEnabled}
            accessibilityRole="text"
            textContentType="password"
            placeholder="한 번 더 입력해주세요."
            onChangeText={(newStr) => setConfirmPassword(newStr)}
            value={confirmPassword}
            onKeyPress={(event) => {
              if (event.nativeEvent.key == "Enter" && buttonEnabled) {
                buttonAction.action();
              } else {
                // do nothing
              }
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
