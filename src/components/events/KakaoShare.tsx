import Image from 'next/image';
import kakaoLinkImg from '~/public/static/images/kakaolink_btn_medium.png';

interface KakaoShareProps {
  title: string;
  description?: string;
  imageUrl: string;
  shareUrl: string;
}

export default function KakaoShare({
  title,
  description,
  imageUrl,
  shareUrl,
}: KakaoShareProps) {
  return (
    <button
      className="inline-flex items-center justify-center"
      onClick={() =>
        Kakao?.Link?.sendDefault({
          objectType: 'feed',
          content: {
            title,
            description,
            imageUrl,
            link: {
              webUrl: shareUrl,
              mobileWebUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '자세히 보기',
              link: {
                webUrl: shareUrl,
                mobileWebUrl: shareUrl,
              },
            },
          ],
        })
      }
    >
      <span className="sr-only">카카오 공유하기</span>
      <Image src={kakaoLinkImg} alt="" width={68} height={69} />
    </button>
  );
}
