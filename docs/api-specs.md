# 확장자 API

<br />

## `GET /api/exts`

고정·커스텀을 한 번에 조회.

### 요청

```http
GET /api/exts HTTP/1.1
```

### 응답 `200`

```json
{
  "fixed": [
    { "name": "bat", "checked": false },
    { "name": "cmd", "checked": true }
  ],
  "custom": [{ "name": "zip" }, { "name": "myext" }]
}
```

<br />

## `PATCH /api/exts/fixed/{name}`

고정 확장자 체크(차단) 여부 갱신.

### 요청

```http
PATCH /api/exts/fixed/bat HTTP/1.1
Content-Type: application/json

{
  "checked": true
}
```

### 응답 `200`

```json
{
  "name": "bat",
  "checked": true
}
```

<br />

## `POST /api/exts/custom`

커스텀 확장자 추가. 이름이 고정 카탈로그에 있으면 상단 규칙대로 고정만 갱신.

### 요청

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{
  "name": "zip"
}
```

### 응답 `201` - 커스텀에 신규 반영

```json
{
  "resolvedAs": "custom",
  "name": "zip"
}
```

### 응답 `200` - 고정 카탈로그와 겹쳐 고정만 체크

```json
{
  "resolvedAs": "fixed",
  "name": "exe",
  "checked": true
}
```

<br />

## `DELETE /api/exts/custom/{name}`

커스텀 확장자 삭제.

### 요청

```http
DELETE /api/exts/custom/zip HTTP/1.1
```

### 응답 `204`

본문 없음
