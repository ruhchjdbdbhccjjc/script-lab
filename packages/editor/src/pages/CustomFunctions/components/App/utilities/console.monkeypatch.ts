// Note: this file comes from the Script Lab 2017, from the "CleanerAsyncStorage" branch
//   (https://github.com/OfficeDev/script-lab-2017/compare/CleanerAsyncStorage).
// Work item https://github.com/OfficeDev/script-lab/issues/523 tracks cleaning up the engineering debt
//   and moving it into this repo.

// Due to asyncstorage was removed, the calling in this code caused errors. I decode this code
// and replace asyncstorage with storage by following this doc:
// https://devblogs.microsoft.com/microsoft365dev/update-your-customs-functions-project/#change-any-mentions-of-asyncstorage-to-storage

export const consoleMonkeypatch = `
!function%20(modules)%20%7B%20function%20__webpack_require__(moduleId)%20%7B%20if%20(installedModules%5BmoduleId%5D)%20return%20installedModules%5BmoduleId%5D.exports%3B%20var%20module%20%3D%20installedModules%5BmoduleId%5D%20%3D%20%7B%20i%3A%20moduleId%2C%20l%3A%20!1%2C%20exports%3A%20%7B%7D%20%7D%3B%20return%20modules%5BmoduleId%5D.call(module.exports%2C%20module%2C%20module.exports%2C%20__webpack_require__)%2C%20module.l%20%3D%20!0%2C%20module.exports%3B%20%7D%20var%20installedModules%20%3D%20%7B%7D%3B%20__webpack_require__.m%20%3D%20modules%2C%20__webpack_require__.c%20%3D%20installedModules%2C%20__webpack_require__.i%20%3D%20function%20(value)%20%7B%20return%20value%3B%20%7D%2C%20__webpack_require__.d%20%3D%20function%20(exports%2C%20name%2C%20getter)%20%7B%20__webpack_require__.o(exports%2C%20name)%20%7C%7C%20Object.defineProperty(exports%2C%20name%2C%20%7B%20configurable%3A%20!1%2C%20enumerable%3A%20!0%2C%20get%3A%20getter%20%7D)%3B%20%7D%2C%20__webpack_require__.n%20%3D%20function%20(module)%20%7B%20var%20getter%20%3D%20module%20%26%26%20module.__esModule%20%3F%20function%20()%20%7B%20return%20module.default%3B%20%7D%20%3A%20function%20()%20%7B%20return%20module%3B%20%7D%3B%20return%20__webpack_require__.d(getter%2C%20%22a%22%2C%20getter)%2C%20getter%3B%20%7D%2C%20__webpack_require__.o%20%3D%20function%20(object%2C%20property)%20%7B%20return%20Object.prototype.hasOwnProperty.call(object%2C%20property)%3B%20%7D%2C%20__webpack_require__.p%20%3D%20%22%22%2C%20__webpack_require__(__webpack_require__.s%20%3D%203)%3B%20%7D(%5Bfunction%20(module%2C%20exports%2C%20__webpack_require__)%20%7B%20%22use%20strict%22%3B%20(function%20(global)%20%7B%20function%20writeToAsyncStorage(entry)%20%7B%20return%20__awaiter(this%2C%20void%200%2C%20void%200%2C%20function%20()%20%7B%20var%20e_2%3B%20return%20__generator(this%2C%20function%20(_a)%20%7B%20switch%20(_a.label)%20%7B%20case%200%3A%20return%20_a.trys.push(%5B0%2C%202%2C%20%2C%203%5D)%2C%20%5B4%2C%20OfficeRuntime.storage.setItem(StorageKeys.logHash%20%2B%20logCounter%2B%2B%2C%20JSON.stringify(%7B%20severity%3A%20entry.severity%2C%20message%3A%20standalone_log_helper_1.stringifyPlusPlus(entry.message)%20%7D))%5D%3B%20case%201%3A%20return%20_a.sent()%2C%20%5B3%2C%203%5D%3B%20case%202%3A%20return%20e_2%20%3D%20_a.sent()%2C%20console.error(%22Error%20writing%20to%20AsyncStorage%22)%2C%20console.error(e_2)%2C%20%5B3%2C%203%5D%3B%20case%203%3A%20return%20%5B2%5D%3B%20%7D%20%7D)%3B%20%7D)%3B%20%7D%20function%20shouldIgnore()%20%7B%20for%20(var%20args%20%3D%20%5B%5D%2C%20_i%20%3D%200%3B%20_i%20%3C%20arguments.length%3B%20_i%2B%2B)%20args%5B_i%5D%20%3D%20arguments%5B_i%5D%3B%20return%201%20%3D%3D%3D%20args.length%20%26%26%20SHOULD_IGNORE_REGEX.test(args%5B0%5D)%3B%20%7D%20var%20__assign%20%3D%20this%20%26%26%20this.__assign%20%7C%7C%20function%20()%20%7B%20return%20__assign%20%3D%20Object.assign%20%7C%7C%20function%20(t)%20%7B%20for%20(var%20s%2C%20i%20%3D%201%2C%20n%20%3D%20arguments.length%3B%20i%20%3C%20n%3B%20i%2B%2B)%20%7B%20s%20%3D%20arguments%5Bi%5D%3B%20for%20(var%20p%20in%20s)%20Object.prototype.hasOwnProperty.call(s%2C%20p)%20%26%26%20(t%5Bp%5D%20%3D%20s%5Bp%5D)%3B%20%7D%20return%20t%3B%20%7D%2C%20__assign.apply(this%2C%20arguments)%3B%20%7D%2C%20__awaiter%20%3D%20this%20%26%26%20this.__awaiter%20%7C%7C%20function%20(thisArg%2C%20_arguments%2C%20P%2C%20generator)%20%7B%20return%20new%20(P%20%7C%7C%20(P%20%3D%20Promise))(function%20(resolve%2C%20reject)%20%7B%20function%20fulfilled(value)%20%7B%20try%20%7B%20step(generator.next(value))%3B%20%7D%20catch%20(e)%20%7B%20reject(e)%3B%20%7D%20%7D%20function%20rejected(value)%20%7B%20try%20%7B%20step(generator.throw(value))%3B%20%7D%20catch%20(e)%20%7B%20reject(e)%3B%20%7D%20%7D%20function%20step(result)%20%7B%20result.done%20%3F%20resolve(result.value)%20%3A%20new%20P(function%20(resolve)%20%7B%20resolve(result.value)%3B%20%7D).then(fulfilled%2C%20rejected)%3B%20%7D%20step((generator%20%3D%20generator.apply(thisArg%2C%20_arguments%20%7C%7C%20%5B%5D)).next())%3B%20%7D)%3B%20%7D%2C%20__generator%20%3D%20this%20%26%26%20this.__generator%20%7C%7C%20function%20(thisArg%2C%20body)%20%7B%20function%20verb(n)%20%7B%20return%20function%20(v)%20%7B%20return%20step(%5Bn%2C%20v%5D)%3B%20%7D%3B%20%7D%20function%20step(op)%20%7B%20if%20(f)%20throw%20new%20TypeError(%22Generator%20is%20already%20executing.%22)%3B%20for%20(%3B%20_%3B)%20try%20%7B%20if%20(f%20%3D%201%2C%20y%20%26%26%20(t%20%3D%202%20%26%20op%5B0%5D%20%3F%20y.return%20%3A%20op%5B0%5D%20%3F%20y.throw%20%7C%7C%20((t%20%3D%20y.return)%20%26%26%20t.call(y)%2C%200)%20%3A%20y.next)%20%26%26%20!(t%20%3D%20t.call(y%2C%20op%5B1%5D)).done)%20return%20t%3B%20switch%20(y%20%3D%200%2C%20t%20%26%26%20(op%20%3D%20%5B2%20%26%20op%5B0%5D%2C%20t.value%5D)%2C%20op%5B0%5D)%20%7B%20case%200%3A%20case%201%3A%20t%20%3D%20op%3B%20break%3B%20case%204%3A%20return%20_.label%2B%2B%2C%20%7B%20value%3A%20op%5B1%5D%2C%20done%3A%20!1%20%7D%3B%20case%205%3A%20_.label%2B%2B%2C%20y%20%3D%20op%5B1%5D%2C%20op%20%3D%20%5B0%5D%3B%20continue%3B%20case%207%3A%20op%20%3D%20_.ops.pop()%2C%20_.trys.pop()%3B%20continue%3B%20default%3A%20if%20(t%20%3D%20_.trys%2C%20!(t%20%3D%20t.length%20%3E%200%20%26%26%20t%5Bt.length%20-%201%5D)%20%26%26%20(6%20%3D%3D%3D%20op%5B0%5D%20%7C%7C%202%20%3D%3D%3D%20op%5B0%5D))%20%7B%20_%20%3D%200%3B%20continue%3B%20%7D%20if%20(3%20%3D%3D%3D%20op%5B0%5D%20%26%26%20(!t%20%7C%7C%20op%5B1%5D%20%3E%20t%5B0%5D%20%26%26%20op%5B1%5D%20%3C%20t%5B3%5D))%20%7B%20_.label%20%3D%20op%5B1%5D%3B%20break%3B%20%7D%20if%20(6%20%3D%3D%3D%20op%5B0%5D%20%26%26%20_.label%20%3C%20t%5B1%5D)%20%7B%20_.label%20%3D%20t%5B1%5D%2C%20t%20%3D%20op%3B%20break%3B%20%7D%20if%20(t%20%26%26%20_.label%20%3C%20t%5B2%5D)%20%7B%20_.label%20%3D%20t%5B2%5D%2C%20_.ops.push(op)%3B%20break%3B%20%7D%20t%5B2%5D%20%26%26%20_.ops.pop()%2C%20_.trys.pop()%3B%20continue%3B%20%7D%20op%20%3D%20body.call(thisArg%2C%20_)%3B%20%7D%20catch%20(e)%20%7B%20op%20%3D%20%5B6%2C%20e%5D%2C%20y%20%3D%200%3B%20%7D%20finally%20%7B%20f%20%3D%20t%20%3D%200%3B%20%7D%20if%20(5%20%26%20op%5B0%5D)%20throw%20op%5B1%5D%3B%20return%20%7B%20value%3A%20op%5B0%5D%20%3F%20op%5B1%5D%20%3A%20void%200%2C%20done%3A%20!0%20%7D%3B%20%7D%20var%20f%2C%20y%2C%20t%2C%20g%2C%20_%20%3D%20%7B%20label%3A%200%2C%20sent%3A%20function%20()%20%7B%20if%20(1%20%26%20t%5B0%5D)%20throw%20t%5B1%5D%3B%20return%20t%5B1%5D%3B%20%7D%2C%20trys%3A%20%5B%5D%2C%20ops%3A%20%5B%5D%20%7D%3B%20return%20g%20%3D%20%7B%20next%3A%20verb(0)%2C%20throw%3A%20verb(1)%2C%20return%3A%20verb(2)%20%7D%2C%20%22function%22%20%3D%3D%20typeof%20Symbol%20%26%26%20(g%5BSymbol.iterator%5D%20%3D%20function%20()%20%7B%20return%20this%3B%20%7D)%2C%20g%3B%20%7D%3B%20Object.defineProperty(exports%2C%20%22__esModule%22%2C%20%7B%20value%3A%20!0%20%7D)%3B%20var%20standalone_log_helper_1%20%3D%20__webpack_require__(2)%3B%20!function%20()%20%7B%20__awaiter(this%2C%20void%200%2C%20void%200%2C%20function%20()%20%7B%20var%20oldKeysToRemove%2C%20e_1%2C%20oldConsole%2C%20logTypes%3B%20return%20__generator(this%2C%20function%20(_a)%20%7B%20switch%20(_a.label)%20%7B%20case%200%3A%20return%20_a.trys.push(%5B0%2C%203%2C%20%2C%204%5D)%2C%20%5B4%2C%20OfficeRuntime.storage.getKeys()%5D%3B%20case%201%3A%20return%20oldKeysToRemove%20%3D%20_a.sent().filter(function%20(key)%20%7B%20return%20key.startsWith(StorageKeys.logHash)%3B%20%7D)%2C%20%5B4%2C%20OfficeRuntime.storage.removeItems(oldKeysToRemove)%5D%3B%20case%202%3A%20return%20_a.sent()%2C%20%5B3%2C%204%5D%3B%20case%203%3A%20return%20e_1%20%3D%20_a.sent()%2C%20console.error(%22Error%20clearing%20out%20initial%20AsyncStorage%22)%2C%20console.error(e_1)%2C%20%5B3%2C%204%5D%3B%20case%204%3A%20return%20OfficeExtensionBatch.CoreUtility._logEnabled%20%3D%20!1%2C%20oldConsole%20%3D%20console%2C%20logTypes%20%3D%20%5B%22log%22%2C%20%22info%22%2C%20%22warn%22%2C%20%22error%22%5D%2C%20console%20%3D%20__assign(%7B%7D%2C%20oldConsole)%2C%20logTypes.forEach(function%20(methodName)%20%7B%20console%5BmethodName%5D%20%3D%20function%20()%20%7B%20for%20(var%20args%20%3D%20%5B%5D%2C%20_i%20%3D%200%3B%20_i%20%3C%20arguments.length%3B%20_i%2B%2B)%20args%5B_i%5D%20%3D%20arguments%5B_i%5D%3B%20shouldIgnore.apply(void%200%2C%20args)%20%7C%7C%20(oldConsole%5BmethodName%5D.apply(oldConsole%2C%20args)%2C%20writeToAsyncStorage(standalone_log_helper_1.generateLogString(args%2C%20methodName)))%3B%20%7D%3B%20%7D)%2C%20%5B2%5D%3B%20%7D%20%7D)%3B%20%7D)%3B%20%7D()%2C%20global.__generateFunctionBinding__%20%3D%20function%20(funcName%2C%20func)%20%7B%20return%20function%20()%20%7B%20function%20handleError(e)%20%7B%20console.error(funcName%20%2B%20%22%20threw%20an%20error%3A%20%22%20%2B%20e)%3B%20%7D%20var%20args%20%3D%20arguments%3B%20try%20%7B%20var%20result%20%3D%20func.apply(global%2C%20args)%3B%20return%20%22object%22%20%3D%3D%20typeof%20result%20%26%26%20result.then%20%3F%20result.then(function%20(value)%20%7B%20return%20value%3B%20%7D).catch(function%20(e)%20%7B%20throw%20handleError(e)%2C%20e%3B%20%7D)%20%3A%20result%3B%20%7D%20catch%20(e)%20%7B%20throw%20handleError(e)%2C%20e%3B%20%7D%20%7D%3B%20%7D%2C%20global.__generateErrorFunction__%20%3D%20function%20(funcName%2C%20error)%20%7B%20return%20function%20()%20%7B%20var%20errorText%20%3D%20funcName%20%2B%20%22%20could%20not%20be%20registered%20due%20to%20an%20error%20while%20loading%20the%20snippet%3A%20%22%20%2B%20error%3B%20throw%20console.error(errorText)%2C%20new%20Error(errorText)%3B%20%7D%3B%20%7D%3B%20var%20logCounter%20%3D%200%2C%20StorageKeys%20%3D%20%7B%20logHash%3A%20%22cf_logs%23%22%20%7D%2C%20SHOULD_IGNORE_REGEX%20%3D%20%2F%5E%5Cw%2B%20CustomFunctions%20%5C%5BExecution%5C%5D%20%5C%5B(Begin%7CEnd)%5C%5D.*%2F%3B%20%7D).call(exports%2C%20__webpack_require__(1))%3B%20%7D%2C%20function%20(module%2C%20exports)%20%7B%20var%20g%3B%20g%20%3D%20function%20()%20%7B%20return%20this%3B%20%7D()%3B%20try%20%7B%20g%20%3D%20g%20%7C%7C%20Function(%22return%20this%22)()%20%7C%7C%20(0%2C%20eval)(%22this%22)%3B%20%7D%20catch%20(e)%20%7B%20%22object%22%20%3D%3D%20typeof%20window%20%26%26%20(g%20%3D%20window)%3B%20%7D%20module.exports%20%3D%20g%3B%20%7D%2C%20function%20(module%2C%20exports%2C%20__webpack_require__)%20%7B%20%22use%20strict%22%3B%20function%20generateLogString(args%2C%20severityType)%20%7B%20var%20message%20%3D%20%22%22%2C%20isSuccessfulMsg%20%3D%20!0%3B%20return%20args.forEach(function%20(element%2C%20index%2C%20array)%20%7B%20try%20%7B%20message%20%2B%3D%20stringifyPlusPlus(element)%3B%20%7D%20catch%20(e)%20%7B%20isSuccessfulMsg%20%3D%20!1%2C%20message%20%2B%3D%20%22%3CUnable%20to%20log%3E%22%3B%20%7D%20message%20%2B%3D%20%22%5Cn%22%3B%20%7D)%2C%20message.length%20%3E%200%20%26%26%20(message%20%3D%20message.trim())%2C%20%7B%20message%3A%20message%2C%20severity%3A%20isSuccessfulMsg%20%3F%20severityType%20%3A%20%22error%22%20%7D%3B%20%7D%20function%20stringifyPlusPlus(object)%20%7B%20if%20(null%20%3D%3D%3D%20object)%20return%20%22null%22%3B%20if%20(void%200%20%3D%3D%3D%20object)%20return%20%22undefined%22%3B%20if%20(%22string%22%20%3D%3D%20typeof%20object)%20return%20object%3B%20if%20(object%20instanceof%20Error)%20try%20%7B%20return%20%22ERROR%3A%20%5Cn%22%20%2B%20jsonStringify(object)%3B%20%7D%20catch%20(e)%20%7B%20return%20stringifyPlusPlus(object.toString())%3B%20%7D%20return%20%22%5Bobject%20Object%5D%22%20!%3D%3D%20object.toString()%20%3F%20object.toString()%20%3A%20jsonStringify(object)%3B%20%7D%20function%20jsonStringify(object)%20%7B%20function%20getStringifiableSnapshot(object)%20%7B%20function%20tryAddName(name)%20%7B%20var%20hasOwnProperty%20%3D%20Object.prototype.hasOwnProperty%3B%20name.indexOf(%22%20%22)%20%3C%200%20%26%26%20!hasOwnProperty.call(snapshot%2C%20name)%20%26%26%20Object.defineProperty(snapshot%2C%20name%2C%20%7B%20configurable%3A%20!0%2C%20enumerable%3A%20!0%2C%20get%3A%20function%20()%20%7B%20return%20object%5Bname%5D%3B%20%7D%20%7D)%3B%20%7D%20var%20snapshot%20%3D%20%7B%7D%3B%20try%20%7B%20var%20current%20%3D%20object%3B%20do%20%7B%20Object.keys(current).forEach(tryAddName)%2C%20current%20%3D%20Object.getPrototypeOf(current)%3B%20%7D%20while%20(current)%3B%20return%20snapshot%3B%20%7D%20catch%20(e)%20%7B%20return%20object%3B%20%7D%20%7D%20return%20JSON.stringify(object%2C%20function%20(key%2C%20value)%20%7B%20return%20value%20%26%26%20%22object%22%20%3D%3D%20typeof%20value%20%26%26%20!Array.isArray(value)%20%3F%20getStringifiableSnapshot(value)%20%3A%20value%3B%20%7D%2C%204)%3B%20%7D%20Object.defineProperty(exports%2C%20%22__esModule%22%2C%20%7B%20value%3A%20!0%20%7D)%2C%20exports.generateLogString%20%3D%20generateLogString%2C%20exports.stringifyPlusPlus%20%3D%20stringifyPlusPlus%3B%20%7D%2C%20function%20(module%2C%20exports%2C%20__webpack_require__)%20%7B%20module.exports%20%3D%20__webpack_require__(0)%3B%20%7D%5D)%3B
`;
