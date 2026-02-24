import {z} from 'zod';  

const signupSchema = z.object({
    username: z.string().min(6,"username should be of min 6 lenght").max(20,"username should not exceed 20 characters"),
    password: z.string().min(4,"password needs to have atleast 4 characters").max(20,"password should not exceed 20 characters"),
    email: z.email()
    // .refine( // refine is used to write custom check on value you got. EG: apply any regex on value
    //     (value)=>{
    //             /gmail\.com/.test(value) // test(value) return true or false based on regex provided
    //     },
    //     {
    //         message: "email should contail gmail.com"
    //     }
    // )
     .regex(/[0-9]/, "Must contain a number")
     .regex(/[@$!%*?&]/, "Must contain a special character") // can also use simple regex
});

const MailSchema = z.object({
    email: z.email()
     .regex(/[0-9]/, "Must contain a number")
     .regex(/[@$!%*?&]/, "Must contain a special character") 
})


const verifySchema = z.object({
  email: z.email()
     .regex(/[0-9]/, "Must contain a number")
     .regex(/[@$!%*?&]/, "Must contain a special character") 
    ,
    otp : z.number()
})


const loginSchema = z.object({
    email: z.email()
     .regex(/[0-9]/, "Must contain a number")
     .regex(/[@$!%*?&]/, "Must contain a special character")
    ,
    password: z.string().min(4,"password needs to have atleast 4 characters").max(20,"password should not exceed 20 characters")
})

export{
    signupSchema,
    MailSchema,
    verifySchema,
    loginSchema
}