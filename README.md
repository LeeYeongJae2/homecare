# 홈케어 홈페이지

`index.html`을 브라우저에서 열면 바로 확인할 수 있는 반응형 정적 홈페이지입니다.

## 파일

- `index.html`: 홈페이지 내용과 SEO 메타태그
- `styles.css`: 전체 디자인과 모바일 반응형 스타일
- `script.js`: 메뉴, 스크롤 효과, 전후 비교 슬라이더, 후기 슬라이더

## 사용 전 꼭 바꿀 것

1. `index.html`의 `브랜드명 홈케어`를 새 업체명으로 일괄 변경
2. `images` 폴더의 WebP 이미지를 같은 파일명의 실제 시공사진으로 덮어쓰기
   - 대표사진: `hero-homecare.webp`, `hero-homecare-mobile.webp`
   - 서비스: `service-cleaning.webp`, `service-grout.webp`, `service-elastic.webp`, `service-coating.webp`
   - 시공사례: `work-01.webp`부터 `work-09.webp`
3. `tel:01095937665`을 새 업체의 실제 전화번호로 변경
4. 상담 폼을 EmailJS, 네이버 톡톡 또는 카카오톡 채널과 연결
5. 도메인이 정해지면 canonical, Open Graph URL과 대표 이미지를 추가

## 이미지 교체 예시

사진은 WebP 형식으로 저장한 뒤 같은 파일명으로 덮어쓰기만 하면 됩니다. 대표사진은 PC용 1280px, 모바일용 720px 내외를 권장합니다.

```html
<img src="images/hero-homecare.png" alt="홈케어 완료 사진">
```

HTML 안에 `[업체명 교체]`, `[로고 교체]`, `[대표사진 교체]`, `[서비스 사진 교체]`, `[연락처 교체]` 주석을 남겨두었습니다.
