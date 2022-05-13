/**
 * 큰 수를 축약해 문자열로 표시하는 유틸 함수. ex) 12345 => 12.3k
 * @param count 표시 형식을 변환하려는 수
 * @returns 변환된 문자열
 */
export function formatCount(count: number) {
  if (count < 10000) {
    return count.toString();
  } else {
    const front = Math.floor(count / 1000);
    const back = Math.floor((count - front * 1000) / 100);

    return front.toString() + "." + back.toString() + "k";
  }
}

/**
 * 초 단위 시간을 받아 분:초(m:ss) 형식으로 반환하는 유틸 함수.
 * @param length 초 단위 시간 정수
 * @returns
 */
export function formatTimer(length: number) {
  // TBD : 시간(hh)도 대응하기, 근데 서비스 특성 상 그럴 일이나 있겠어요?
  let min, sec;
  min = Math.floor(length / 60);
  sec = length % 60;
  if (sec < 10) {
    sec = "0" + sec;
  }
  return `${min}:${sec}`;
}
