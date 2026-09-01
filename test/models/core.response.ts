import { CoreResponse } from "../../src/interfaces/CoreResponse";

export const CoreResponseOk=(data:any,cookies?:string[]): CoreResponse => {
    return {
        status: 200,
        data: data,
        cookies: cookies
    };
}

export const CoreResponseBad=(cookies?:string[]): CoreResponse => {
    return {
        status: 400,
        data: null,
        cookies: cookies
    };
}

