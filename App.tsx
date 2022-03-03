import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import {Entypo} from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(true);

    useEffect(() => {
    /**
     * Splash screen 함수
     */
        async function prepare() {
            try {
                // 리소스를 fetch하는 동안 splash를 보이게 하기
                await SplashScreen.preventAutoHideAsync();

                // 폰트  미리 로드. 여기다가 원하는 API콜을 만들 수 있음
                await Font.loadAsync(Entypo.font);
            } catch (e) {
                console.warn(e);
            } finally {
                // 어플리케이션에게 준비됐다고 말하기
                setAppIsReady(true);
            }
        }

        // 함수 호출
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // 이 코드는 스플래시 화면이 바로 사라지게 만듬
            // 우리가 'setAppIsReady' 다음 호출하면
            // 앱이 미처 렌더링 되기 전의 빈 화면을 볼 수도 있음.
            // 그러니까 root view가 layout을 생성한 것을 인식한 다음 사라지게 하는게 좋다.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    let firstPage;
    if (userLoggedIn) {
        // firstPage = TimelineScene
    }else {
        // firstPage = OnBoardingScene
    }

    return (
        <View style={styles.container}
            onLayout={onLayoutRootView}>
            <Text>스플래시 화면 만드렀따!!</Text>
            <Entypo name="rocket" size={30} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
