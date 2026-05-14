# API 설계

응답 본문은 항상 `{ ok, status, data, error }` 형태입니다.

<br />

```
GET    /api/exts
POST   /api/exts/custom
PATCH  /api/exts/fixed/:name
DELETE /api/exts/custom
DELETE /api/exts/custom/:name
```

<br />

### `GET /api/exts`

고정 및 커스텀 확장자 목록을 한 번에 조회합니다.

`fixed`는 확장자(`name`)와 차단 여부(`checked`)를, `custom`은 확장자(`name`)만 포함합니다. <br />
`fixed` 배열의 구성과 길이는 DB 시드에 따라 결정됩니다. 이 핸들러는 항상 `200`만 반환합니다. 

<br />

**요청:**

```http
GET /api/exts HTTP/1.1
```

**응답:** `200`

```json
{
  "ok": true,
  "status": 200,
  "data": {
    "fixed": [
      { "name": "bat", "checked": false },
      { "name": "cmd", "checked": false },
      { "name": "com", "checked": false },
      { "name": "cpl", "checked": false },
      { "name": "exe", "checked": false },
      { "name": "scr", "checked": false },
      { "name": "js", "checked": false }
    ],
    "custom": [
      { "name": "x" },
      { "name": "bar" }
    ]
  },
  "error": null
}
```

<br />

### `POST /api/exts/custom`

커스텀 확장자를 추가합니다.

요청한 확장자가 DB에 고정(`fixed`)으로 존재하면서 아직 미체크 상태인 경우, <br />
해당 행을 체크 처리하고 `checked: true` 를 반환합니다.

<br />

**요청 (신규 커스텀):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{"name":"x"}
```

**응답:** `201`

```json
{
  "ok": true,
  "status": 201,
  "data": { "name": "x" },
  "error": null
}
```

<br />

**요청 (고정 확장자 체크):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{"name":"bat"}
```

**응답:** `201`

```json
{
  "ok": true,
  "status": 201,
  "data": { "name": "bat", "checked": true },
  "error": null
}
```

<br />

**요청 (`name` 없음):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{}
```

**응답:** `400`

```json
{
  "ok": false,
  "status": 400,
  "data": null,
  "error": { "message": "확장자는 필수 입력 항목입니다" }
}
```

<br />

**요청 (영문·숫자 외 문자):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{"name":"안녕하세요"}
```

**응답:** `400`

```json
{
  "ok": false,
  "status": 400,
  "data": null,
  "error": { "message": "확장자는 영문자/숫자 이외의 문자를 사용할 수 없습니다" }
}
```

<br />

**요청 (20자 초과):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{"name":"abcdefghijklmnopqrstu"}
```

**응답:** `400`

```json
{
  "ok": false,
  "status": 400,
  "data": null,
  "error": { "message": "확장자는 최대 20자까지 입력할 수 있습니다" }
}
```

<br />

**요청 (커스텀 200개 도달 후 추가):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{"name":"new"}
```

**응답:** `400`

```json
{
  "ok": false,
  "status": 400,
  "data": null,
  "error": { "message": "커스텀 확장자는 최대 200개까지 추가할 수 있습니다" }
}
```

<br />

**요청 (이미 커스텀에 있는 이름, 또는 고정이면서 이미 체크된 이름):**

```http
POST /api/exts/custom HTTP/1.1
Content-Type: application/json

{"name":"dup"}
```

(후자의 예: `{"name":"bat"}` — `bat`이 이미 `checked`일 때. 위 `201` 승격과 배타적)

**응답:** `409` (두 경우 모두 동일한 본문)

```json
{
  "ok": false,
  "status": 409,
  "data": null,
  "error": { "message": "이미 차단되어 있습니다" }
}
```

**응답:** `500`

```json
{
  "ok": false,
  "status": 500,
  "data": null,
  "error": { "message": "Internal Server Error" }
}
```

<br />

### `PATCH /api/exts/fixed/:name`

고정 확장자의 차단 여부를 변경합니다. 확장자는 경로 파라미터(`:name`)로 전달합니다.

<br />

**요청:**

```http
PATCH /api/exts/fixed/bat HTTP/1.1
Content-Type: application/json

{"checked":true}
```

**응답:** `200`

```json
{
  "ok": true,
  "status": 200,
  "data": { "name": "bat", "checked": true },
  "error": null
}
```

<br />

**요청 (`checked` 없음):**

```http
PATCH /api/exts/fixed/bat HTTP/1.1
Content-Type: application/json

{}
```

**응답:** `400`

```json
{
  "ok": false,
  "status": 400,
  "data": null,
  "error": { "message": "체크 여부는 필수 입력 항목입니다" }
}
```

<br />

**요청 (존재하지 않는 고정 확장자):**

```http
PATCH /api/exts/fixed/no-such HTTP/1.1
Content-Type: application/json

{"checked":true}
```

**응답:** `404`

```json
{
  "ok": false,
  "status": 404,
  "data": null,
  "error": { "message": "확장자를 찾을 수 없습니다" }
}
```

<br />

### `DELETE /api/exts/custom`

`fixed = 0` 인 **커스텀 확장자 행을 모두** 삭제합니다. 고정 확장자 행은 그대로 둡니다.  
요청 URL 은 `/api/exts/custom` 까지이며, 단건 삭제 `DELETE /api/exts/custom/:name` 과 구분됩니다(경로에 확장자 이름을 넣지 않음).

<br />

**요청:**

```http
DELETE /api/exts/custom HTTP/1.1
```

**응답:** `200`

```json
{
  "ok": true,
  "status": 200,
  "data": { "deleted": 2 },
  "error": null
}
```

`data.deleted` 는 실제로 삭제된 커스텀 행 수입니다.

<br />

### `DELETE /api/exts/custom/:name`

커스텀 확장자 한 건을 삭제합니다.

**요청:**

```http
DELETE /api/exts/custom/bar HTTP/1.1
```

<br />

**응답:** `200`

```json
{
  "ok": true,
  "status": 200,
  "data": { "name": "bar" },
  "error": null
}
```

**요청 (존재하지 않는 커스텀):**

```http
DELETE /api/exts/custom/no-such HTTP/1.1
```

<br />

**응답:** `404`

```json
{
  "ok": false,
  "status": 404,
  "data": null,
  "error": { "message": "확장자를 찾을 수 없습니다" }
}
```

<br />

### 등록되지 않은 경로

<br />

**요청:**

```http
GET /api/nope HTTP/1.1
```

**응답:** `404`

```json
{
  "ok": false,
  "status": 404,
  "data": null,
  "error": { "message": "Not Found" }
}
```
