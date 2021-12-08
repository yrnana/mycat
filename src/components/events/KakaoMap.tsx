import { useCallback, useEffect, useRef } from 'react';
import { Place } from '@prisma/client';
import Head from 'next/head';
import Script from 'next/script';
import { NEXT_PUBLIC_KAKAO_JS_APP_KEY } from '~/helpers/constants';

export default function KakaoMap({ lat, lng }: Place) {
  const containerRef = useRef<HTMLDivElement>(null);

  const initMap = useCallback(() => {
    const map = new kakao.maps.Map(containerRef.current!, {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    });

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
    });

    marker.setMap(map);
  }, [lat, lng]);

  useEffect(() => {
    if (window?.kakao) {
      initMap();
    }
  }, [initMap]);

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${NEXT_PUBLIC_KAKAO_JS_APP_KEY}&autoload=false`}
        onLoad={() => kakao.maps.load(initMap)}
      />
      <Head>
        <link rel="preconnect" href="https://dapi.kakao.com" />
        <link rel="dns-prefetch" href="https://dapi.kakao.com" />
      </Head>
      <div className="w-full h-96 lg:h-full " ref={containerRef} />
    </>
  );
}
