import { Meteor } from "src/meteor/meteor"

export class Accounts {
    public static changePassword(oldPassword: string, password: string, callback: (error: Error| null) => void): void {
        throw new Error('Not implemeneted')
    }

    public static createUser(
        options: any,
        callback?: (error?: Error | Meteor.Error | Meteor.TypedError) => void,
    ): string {
        throw new Error('Not implemeneted')
    }


    public static  resetPassword(
        token: string,
        newPassword: string,
        callback?: (error?: Error | Meteor.Error | Meteor.TypedError) => void,
    ): void{
        throw new Error('Not implemeneted')
    }

    public static  verifyEmail(
        token: string,
        callback?: (error?: Error | Meteor.Error | Meteor.TypedError) => void,
    ): void{
        throw new Error('Not implemeneted')
    }
}