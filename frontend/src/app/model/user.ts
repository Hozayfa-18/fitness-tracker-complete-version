import {Activity} from "./activity";

export class User {
   id: number | undefined;
   username: string | undefined;
   firstName: string | undefined;
   lastName: string | undefined;
   email: string | undefined;
   role: string | undefined;
   birthDate: Date | undefined;
   height: number | undefined;
   weight: number | undefined;
   gender: string | undefined;
   pic_byte:string|undefined;
   createdAt:Date|undefined
   updatedAt:Date|undefined
   activities: Activity[] | undefined;
}
