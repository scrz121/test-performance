const readlineSync = require('readline-sync')
const parser = require('xml2json');

const callApi = require('./axiosService');

const IsJsonString = (str) => {
	let result = true;
	try {
		JSON.parse(str);
	} catch (e) {
		result = false;
	}
	return result;
}

const getTotalTime = async (promiseArray, timeArray) => {

	try {
		let responses = await Promise.all(promiseArray);
		for (let res of responses) {
			timeArray.push(res.config.meta.responseTime);
		}
		let totalTime = Math.max(...timeArray);
		return totalTime;
	} catch (e) {
		console.log(e.message);
		return null;
	}
}

const getResult = async () => {
	let body;
	let url = readlineSync.question('Type url: ');
	let httpRequest = readlineSync.question('Type Http Request(Get, Post): ');
	let count = readlineSync.question('Type number of request: ');
	let data = readlineSync.question('Enter data to send: ');

	if (IsJsonString(data)) {
		body = JSON.parse(data);
	} else {
		body = parser.toJson(data);
	}
	let timeArray = [];
	let promiseArray = [];

	for (let i = 0; i < count; i++) {
		promiseArray.push(callApi.post(url, body),);
	}

	switch (httpRequest.toLowerCase()) {
		case 'post':
			{
				try {
					totalTime = await getTotalTime(promiseArray, timeArray);
					console.info(`Number of request: ${count}`);
					console.info(`Total time: ${totalTime} ms`);
				} catch (e) {
					console.log(e.message)
				}
			}
		default:
			break;
	}
}

const main = async () => {
	await getResult();
	return 0;
}

main();
