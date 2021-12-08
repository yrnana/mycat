import Script from 'next/script';
import { NEXT_PUBLIC_KAKAO_JS_APP_KEY } from '~/helpers/constants';

export default function KakaoSdk() {
  const initKakao = () => {
    if (!Kakao?.isInitialized()) {
      Kakao?.init(NEXT_PUBLIC_KAKAO_JS_APP_KEY);
    }
  };

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.min.js"
      onLoad={initKakao}
    />
  );
}
