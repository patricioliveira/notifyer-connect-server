export class HttpRespose{
    Status: string;
    Message: string;
    Result: any

    constructor( status: string = 'SUCCESS', message: string = 'SUCCESS', result?: any){
        this.Status = status;
        this.Message = message;
        this.Result = result;
    }

}