# Egg Evolution Match - Web Application PRD

## 1. 목적
모바일 프로토타입 규칙을 유지하면서 웹 브라우저에서 즉시 플레이 가능한 버전을 제공한다.

## 2. 제품 목표
- 설치 없이 URL 접속 즉시 플레이
- 데스크톱/태블릿 환경에서 16x16 퍼즐 플레이 지원
- 모바일 규칙과 동일한 진화/점수/스테이지 경험 제공

## 3. 타깃 사용자
- 캐주얼 퍼즐 유저 (웹 접근 선호)
- 데모/테스트 용도로 빠르게 게임을 체험하려는 사용자

## 4. 핵심 게임 규칙
- 16x16 보드, Egg(색상) 블록 랜덤 배치
- 인접 블록 스왑으로 3매치
- 진화 체계:
  - Egg 3매치(동일 색) -> Chick
  - Chick 3매치 -> Rooster/Hen
  - Rooster/Hen + Chick 2개 라인 매치 -> 제거(통닭 처리)
- 연쇄 매치 시 콤보 점수 가산
- 목표 점수 달성 시 다음 스테이지 진행

## 5. UX 요구사항
- 상단 HUD: Stage, Score, Goal, Time
- 중앙 보드: 16x16, 클릭 2회로 스왑
- 하단 컨트롤: Restart
- 상태 표시: Match/Combo/No Match/Time Over

## 6. 기술 요구사항
- 순수 웹(HTML/CSS/Vanilla JS)
- 정적 서버에서 실행 가능
- 최신 Chromium 기준 동작

## 7. 분석 이벤트(초안)
- game_start, move_swap, match_egg, match_chick, remove_adult_chick
- combo_trigger, stage_clear, time_over, restart

## 8. 릴리즈 범위
- V1: 싱글 스테이지 루프 + 스테이지 상승 + 기본 점수/타이머
- V2: 사운드, 애니메이션, 리더보드, 계정 연동

## 9. 승인 필요사항
- Rooster/Hen 처리 규칙 최종안 확정
- 타이머/점수 밸런스 조정
- 웹 배포 도메인 및 분석 도구 확정
