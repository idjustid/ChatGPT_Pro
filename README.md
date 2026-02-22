# Egg Evolution Match

PRD 기반으로 구현한 모바일 퍼즐 게임 프로토타입입니다.

## 구현 범위
- 16x16 고정 보드
- 블록 단계: Egg(색상) → Chick → Rooster/Hen → (성체+병아리 매치 시) 제거
- 인접 칸 선택 2회로 슬라이딩(스왑)
- 3매치 판정(가로/세로)
- 연쇄 콤보 점수
- 점수 목표 달성 시 Stage 상승
- 타이머 종료 시 Time Over

## 바로 실행 (현재 환경 포함)
의존성 설치가 막힌 환경에서도 아래 명령은 **즉시 동작**합니다.

```bash
npm run start
```

동작 방식:
- `node_modules/.bin/expo`가 있으면 Expo 앱 실행
- 없으면 `preview/` 정적 화면을 로컬 서버로 실행

## 설치 오류(403 Forbidden) 대응
일부 환경에서는 프록시/보안 정책으로 공개 npm registry 접근이 차단되어 `npm install`이 `403 Forbidden`으로 실패할 수 있습니다.

다음 스크립트는 접근 가능한 registry를 자동 탐색합니다.
- registry가 없지만 `node_modules`가 있으면 재사용
- registry가 없으면 npm cache offline 설치 시도
- 둘 다 불가하면 경고 후 종료(기본), 필요 시 실패 모드로 전환 가능

```bash
npm run install:deps
```

내부 npm mirror를 사용하는 경우:

```bash
NPM_REGISTRY_URL=https://<company-artifact-registry>/npm/ npm run install:deps
ALLOW_NO_INSTALL=0 npm run install:deps  # 하위 호환(경고 후 성공 종료)
FAIL_ON_MISSING_DEPS=1 npm run install:deps  # 하위 호환(경고 후 성공 종료)
```

## 실행 방법
```bash
npm run install:deps
npm run start
```

### Expo로만 실행
```bash
npm run start:expo
```

### Preview로만 실행
```bash
npm run start:preview
```

### iOS 시뮬레이터 도구 체크
```bash
npm run check:ios-sim
```
- macOS에서는 `xcrun simctl` 사용 가능 여부를 확인합니다.
- Linux/Windows에서는 iOS 시뮬레이터가 지원되지 않으므로 경고만 출력하고 성공 종료합니다.

### iOS 실행
```bash
npm run ios
```
- macOS + Xcode 환경에서는 iOS Simulator 실행을 시도합니다.
- Linux/Windows 환경에서는 안내 메시지를 출력하고 실패 없이 종료합니다.

## 패키징
### DMG 생성 (macOS 배포용, App Store iOS 용도 아님)
```bash
npm run package:dmg
```
- macOS + `.app` 번들이 있을 때 `dist/<APP_NAME>.dmg` 생성
- Linux/Windows에서는 `dist/DMG_NOT_AVAILABLE_ON_LINUX.txt` 안내 파일 생성

### Apple App Store(iOS) 배포
> iOS App Store 제출물은 **DMG가 아니라 IPA**입니다.

```bash
npm run deploy:ios
```
- 내부적으로 `eas build --platform ios` + `eas submit --platform ios` 실행
- `eas`가 없는 환경에서는 실패 대신 `dist/DEPLOY_IOS_SKIPPED.txt` 안내 파일 생성
- 엄격 모드(미설치 시 실패): `FAIL_ON_MISSING_EAS=1 npm run deploy:ios`
- 사전 준비: Apple Developer 계정, App Store Connect 앱 레코드, 인증서/프로비저닝

## Apple App Store 배포(수동 EAS)
1. EAS CLI 설치
```bash
npm install -g eas-cli
```
2. 로그인
```bash
eas login
```
3. 빌드 설정
```bash
eas build:configure
```
4. iOS 릴리즈 빌드
```bash
eas build --platform ios --profile production
```
5. App Store Connect 제출
```bash
eas submit --platform ios
```

> 실제 배포 전 `app.json`의 `ios.bundleIdentifier`를 고유 값으로 변경하고, 앱 아이콘/스플래시/스크린샷/개인정보 정책을 준비하세요.


## Web Application
- 웹 기획 문서: `WEB_PRD.md`
- 웹 앱 소스: `web/`

### Web 실행
```bash
python3 -m http.server 4180 --directory web
```
브라우저에서 `http://localhost:4180` 접속
