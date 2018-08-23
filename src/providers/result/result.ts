import { Injectable } from "@angular/core";
import { resultType } from "../../providers/types/types";
import _ from "lodash";

@Injectable()
export class ResultProvider {
    constructor() {}

    public success(text: any): resultType {
        return {
            status: "success",
            msg: _.isString(text) ? text : JSON.stringify(text)
        };
    }

    public warn(text: any): resultType {
        return {
            status: "warn",
            msg: _.isString(text) ? text : JSON.stringify(text)
        };
    }

    public error(text: any): resultType {
        return {
            status: "fail",
            msg: _.isString(text) ? text : JSON.stringify(text)
        };
    }
}
