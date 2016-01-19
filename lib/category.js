'use strict';

var coreAPI, categoryAPI = {

	init(coreAPIObj) {
		coreAPI = coreAPIObj;
		return categoryAPI;
	},

	getCategories(page, limit) {
		var paramObj = { max: 100, offset: 0 };

		if(limit) {
			paramObj.max = limit;
		}

		if(page) {
			paramObj.offset = page * limit;
		}

		return coreAPI
			.makeRequest('GET', 'category', paramObj)
			.then((xmlBody) => {
				var categoryObj = xmlBody.categories;

				categoryObj.category = categoryObj.category.map((el) => {
					delete el.brand;
					return el;
				});

				return {
					total: parseInt(categoryObj.$.totalFound, 10),
					itensPerPage: paramObj.max,
					totalPages: Math.ceil(categoryObj.$.totalFound / paramObj.max),
					offset: parseInt(categoryObj.$.offset, 10),
					categories: categoryObj.category
				};
			});
	},

	getAllCategories() {
		return coreAPI
			.makeRequest('GET', 'category/file')
			.then((xmlBody) => {
				var categoryObj = xmlBody.categories,
					departamentsArray = [];

				categoryObj.category = categoryObj.category.map((el) => {
					delete el.brand;
					return el;
				});

				categoryObj.category.forEach((el) => {
					var departamentHasDuplicate = false;

					departamentsArray.forEach((dep) => {
						if(dep.name === el.departamentName) {
							departamentHasDuplicate = true;
						}
					});

					if(!departamentHasDuplicate) {
						departamentsArray.push({
							id: parseInt(el.departamentId, 10),
							name: el.departamentName
						});
					}
				});

				return {
					total: parseInt(categoryObj.$.totalFound, 10),
					departaments: departamentsArray,
					categories: categoryObj.category
				};
			});
	}

};

module.exports = Object.create(categoryAPI);
