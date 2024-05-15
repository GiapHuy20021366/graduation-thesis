---
title: CommuniFood
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.23"

---

# My Project

<!-- Base URLs:

* <a href="">CommuniFood Test: </a> -->

<!-- # Authentication -->

# CommuniFood API

## POST USER > Manual login

POST /gateway/user_service/users/login

> Body Parameters

```yaml
email: gv.huy.2002@gmail.com
password: Sharefood@2024

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» email|body|string| no |Email of account|
|» password|body|string| no |Password of account|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST FOOD > Search food

POST /gateway/food_service/foods/search

> Body Parameters

```json
{
  "user": {
    "include": [],
    "exclude": []
  },
  "place": {
    "include": [],
    "exclude": []
  },
  "distance": {
    "max": 10,
    "current": {
      "lat": 0,
      "lng": 0
    }
  },
  "category": [
    "category"
  ],
  "price": {
    "min": 0,
    "max": 50000
  },
  "addedBy": [
    0,
    1,
    2,
    4,
    8,
    16
  ],
  "active": true,
  "resolved": false,
  "resolveBy": {
    "include": [],
    "exclude": []
  },
  "time": {
    "from": 0,
    "to": 10000000000
  },
  "duration": {
    "from": 0,
    "to": 10000000000
  },
  "quantity": {
    "from": 2,
    "to": 4
  },
  "populate": {
    "user": true,
    "place": true
  },
  "order": {
    "distance": -1,
    "price": -1,
    "quantity": -1,
    "time": -1
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST PLACE > Search places

POST /gateway/user_service/places/search

> Body Parameters

```json
{
  "query": "SAMPLE",
  "author": {
    "include": [],
    "exclude": []
  },
  "distance": {
    "max": 10,
    "current": {
      "lat": 0,
      "lng": 0
    }
  },
  "rating": {
    "min": 2,
    "max": 4
  },
  "types": [
    0,
    1,
    2,
    4,
    8
  ],
  "active": true,
  "pagination": {
    "skip": 0,
    "limit": 24
  },
  "order": {
    "distance": 1,
    "rating": 1,
    "time": 1
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST FOOD > Upload food

POST /gateway/food_service/foods

> Body Parameters

```json
{
  "images": [
    "URL"
  ],
  "title": "title",
  "location": {
    "name": "location name",
    "coordinates": {
      "lat": 0,
      "lng": 0
    }
  },
  "categories": [
    "category"
  ],
  "quantity": 4,
  "duration": 10000000000,
  "price": 40000,
  "place": "placeid"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST USER > Google OAuth Login

POST /gateway/user_service/users/register

> Body Parameters

```yaml
method: google-oauth

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|cridental|query|string| no |none|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» method|body|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET USER > Refresh token

GET /gateway/user_service/users/token/refresh

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|profile|query|boolean| no |Return profile information or not|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET USER > Active manual account

GET /gateway/user_service/users/active

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET USER > Get detail user

GET /gateway/user_service/users/<userID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|detail|query|boolean| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT USER > Update personal data

PUT /gateway/user_service/users/<userID>

> Body Parameters

```json
{
  "updated": {
    "firstName": "NEW FIRST NAME",
    "lastName": "NEW LAST NAME",
    "description": "NEW DESCRIPTION",
    "location": {
      "name": "NEW LOCATION",
      "coordinates": {
        "lat": 0,
        "lng": 0
      }
    },
    "avatar": "NEW AVATAR URL",
    "categories": [
      "NEW CATEGORY"
    ]
  },
  "deleted": {
    "description": true,
    "location": true,
    "categories": true,
    "avatar": true
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST USER > Search Users

POST /gateway/user_service/users/search

> Body Parameters

```json
{
  "query": "SAMPLE QUERY",
  "distance": {
    "max": 10,
    "current": {
      "lat": 0,
      "lng": 0
    }
  },
  "order": {
    "time": 1,
    "distance": 1,
    "like": 1
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT USER > Unfollow an user

PUT /gateway/user_service/users/<userID>/follow

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|action|query|string| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST USER > Get followers of an user

POST /gateway/user_service/users/<userID>/subcribe/search

> Body Parameters

```json
{
  "role": [
    1,
    2
  ],
  "type": [
    1,
    2,
    4,
    8
  ],
  "place": {
    "include": [],
    "exclude": []
  },
  "user": {
    "include": [],
    "exclude": []
  },
  "subcriber": {
    "include": [],
    "exclude": []
  },
  "duration": {
    "from": 0,
    "to": 10000000000
  },
  "order": {
    "time": -1
  },
  "populate": {
    "user": true,
    "place": true,
    "subcriber": true
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST USER > Get users and place that an user followed

POST /gateway/user_service/users/<userID>/follow/search

> Body Parameters

```json
{
  "role": [
    1,
    2
  ],
  "type": [
    1,
    2,
    4,
    8
  ],
  "place": {
    "include": [],
    "exclude": []
  },
  "user": {
    "include": [],
    "exclude": []
  },
  "subcriber": {
    "include": [],
    "exclude": []
  },
  "duration": {
    "from": 0,
    "to": 10000000000
  },
  "order": {
    "time": -1
  },
  "populate": {
    "user": true,
    "place": true,
    "subcriber": true
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST PLACE > Create place

POST /gateway/user_service/places

> Body Parameters

```json
{
  "exposedName": "NAME OF PLACE",
  "description": "DESCRIPTION",
  "categories": [
    "CATEGORY"
  ],
  "location": {
    "name": "NAME OF LOCATION",
    "coordinates": {
      "lat": 0,
      "lng": 0
    }
  },
  "avatar": "URL OF AVATAR",
  "images": [
    "URL OF IMAGE"
  ],
  "type": 0
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET PLACE > Get place

GET /gateway/user_service/places/<placeID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT PLACE > Update place

PUT /gateway/user_service/places/<placeID>

> Body Parameters

```json
{
  "exposedName": "NAME OF PLACE",
  "description": "DESCRIPTION",
  "categories": [
    "CATEGORY"
  ],
  "location": {
    "name": "NAME OF LOCATION",
    "coordinates": {
      "lat": 0,
      "lng": 0
    }
  },
  "avatar": "URL OF AVATAR",
  "images": [
    "URL OF IMAGE"
  ],
  "type": 0
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET PLACE > Active or inactive place

GET /gateway/user_service/places/<placeID>/active

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|active|query|boolean| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET PLACE > Unfollow a place

GET /gateway/user_service/places/<placeID>/follow

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|action|query|string| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET PLACE > Rating a place

GET /gateway/user_service/places/<placeID>/rating

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|scoree|query|number| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST PLACE > Get followed places of an user

POST /gateway/user_service/places/follow/users/<userID>

> Body Parameters

```json
{
  "followTypes": [
    1,
    2,
    4,
    8
  ],
  "placeTypes": [
    0,
    1,
    2,
    4,
    8,
    16
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET PLACE > Get rank favorite place

GET /gateway/user_service/places/rank/favorite"

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|skip|query|integer| no |none|
|limit|query|integer| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET PLACE > Get rated places of an user

GET /gateway/user_service/places/rating/users/<userID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|skip|query|integer| no |none|
|limit|query|integer| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST PLACE > Get followers of a place

POST /gateway/user_service/places/<placeID>/subcribe/search

> Body Parameters

```json
{
  "role": [
    1,
    2
  ],
  "type": [
    1,
    2,
    4,
    8
  ],
  "place": {
    "include": [],
    "exclude": []
  },
  "user": {
    "include": [],
    "exclude": []
  },
  "subcriber": {
    "include": [],
    "exclude": []
  },
  "duration": {
    "from": 0,
    "to": 10000000000
  },
  "order": {
    "time": -1
  },
  "populate": {
    "user": true,
    "place": true,
    "subcriber": true
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST FOOD > Upload an image

POST /gateway/food_service/foods/images

> Body Parameters

```json
{
  "images": [
    {
      "name": "ABC",
      "base64": "BASE64"
    }
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT FOOD > Update food

PUT /gateway/food_service/foods/<foodID>

> Body Parameters

```json
{
  "images": [
    "URL"
  ],
  "title": "title",
  "location": {
    "name": "location name",
    "coordinates": {
      "lat": 0,
      "lng": 0
    }
  },
  "categories": [
    "category"
  ],
  "quantity": 4,
  "duration": 10000000000,
  "price": 40000,
  "place": "placeid"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET FOOD > Get food

GET /gateway/food_service/foods/<foodID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## POST FOOD > Get food search history

POST /gateway/food_service/foods/search/history

> Body Parameters

```json
{
  "users": [
    "userid"
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT FOOD > Like or unlike food

PUT /gateway/food_service/foods/<foodID>/like

> Body Parameters

```json
{
  "action": "LIKE | UNLIKE"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET FOOD > Get liked foods

GET /gateway/food_service/foods/like/users/<userID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|skip|query|number| no |none|
|limit|query|number| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET FOOD > Get favorite foods

GET /gateway/food_service/foods/favorite/users/<userID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|skip|query|number| no |none|
|limit|query|number| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## GET FOOD > Get registered foods

GET /gateway/food_service/foods/register/users/<userID>

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|skip|query|number| no |none|
|limit|query|number| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT FOOD > Resolve or unresolve food

PUT /gateway/food_service/foods/<foodID>/resolve

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|resloveBy|query|string| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

## PUT FOOD > Active or inactive food

PUT /gateway/food_service/foods/<foodID>/active

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|active|query|boolean| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|

### Responses Data Schema

# Data Schema

