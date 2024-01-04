export default class NotAManagerError extends Error {
    constructor(){
        super('User is not Notifyer')
    }
}