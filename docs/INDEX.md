Documentation
===================

# Init: b2w.init()

You need to get all the parameters from your contract.

```javascript
var b2w = require('b2w').init({
	symbol: <symbol>,
	company: <company>,
	login: <login>,
	password: <password>
});

console.log(b2w) // Return the b2w api object
```

# Products

## getFullCatalog()

### Description

Get all the products in sets of 100

## Usage

`offset` <int> default 0

```javascript
b2w.products.getFullCatalog(offset).then((json) => {
	console.log(json); // Return the product Object
});
```

### Output
```json
{
	total: <int>,
	offset: <int>,
	products: [{
		id: <string>,
		externalId: <string>,
		name: <string>,
		dateCreated: <date>,
		lastUpdated: <date>,
		description: <html>,
		salePrice: <float>,
		defaultPrice: <float>,
		category: {
			id: <string>,
			externalId: <string>,
			name: <string>
		},
		secondaryCategories: {
			id: <string>,
			externalId: <string>,
			name: <string>
		},
		images: [{
			type: <string>,
			link: <image-links>
		}],
		brand: <string>,
		gift: <boolean>,
		sku: [{
			id: <string>,
			externalId: <string>,
			salePrice: <float>,
			defaultPrice: <float>,
			variation: <string>',
			isAvailable: <boolean> }
		}]
	}]
}
```
