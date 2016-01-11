Documentation
===================

# Init: b2w()

You need to get all the parameters from your contract.

```javascript
var b2w = require('b2w')({
	symbol: <symbol>,
	company: <company>,
	login: <login>,
	password: <password>
});

console.log(b2w) // Return the b2w api object
```

# Products

## getCatalog()

### Description

Get all the products in sets of 100

## Usage

`page` <int> default 0

```javascript
b2w.products.getCatalog(page).then((json) => {
	console.log(json); // Return the product Object
});
```

### Output
```json
{
	"total": <int>,
	"totalPages": <int>,
	"offset": <int>,
	"products": [{
		"id": <string>,
		"externalId": <string>,
		"name": <string>,
		"dateCreated": <date>,
		"lastUpdated": <date>,
		"description": <html>,
		"salePrice": <float>,
		"defaultPrice": <float>,
		"category": {
			"id": <string>,
			"externalId": <string>,
			"name": <string>
		},
		"secondaryCategories": {
			"id": <string>,
			"externalId": <string>,
			"name": <string>
		},
		"images": [{
			"type": <string>,
			"link": <image-links>
		}],
		"brand": <string>,
		"gift": <boolean>,
		"sku": [{
			"id": <string>,
			"externalId": <string>,
			"salePrice": <float>,
			"defaultPrice": <float>,
			"variation": <string>',
			"isAvailable": <boolean> }
		}]
	}]
}
```
