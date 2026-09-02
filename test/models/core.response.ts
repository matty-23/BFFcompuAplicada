import { CoreResponse } from "../../src/interfaces/CoreResponse";

export const CoreResponseOk=(data:any,cookies?:string[]): CoreResponse => {
    return {
        status: 200,
        data: data,
        cookies: cookies||[]
    };
}

export const CoreResponseBad=(cookies?:string[]): CoreResponse => {
    return {
        status: 400,
        data: null,
        cookies: cookies||[]
    };
}

export const headersMock = {
    'Authorization': 'Bearer mockToken',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'MockUserAgent/1.0',
    'X-Custom-Header': 'CustomValue',
    'Origin': 'http://localhost:3000',
    'Cookie': 'sessionId=mockSessionId; otherCookie=otherValue',
};