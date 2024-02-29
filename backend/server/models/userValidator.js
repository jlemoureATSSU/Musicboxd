const z = require('zod')

const newUserValidation = data => { 
  const registerValidationSchema = z.object({
    username : z.string().min(3, 'Username must be 3 characters or more'),
    email: z.string().optional(),
    password: z.string().min(3, 'Password must be 3 or more characters').trim(),
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    phoneNumber: z.string().optional(),
  });
  
  return registerValidationSchema.safeParse(data)
};

const userLoginValidation = data => {
  const loginValidationSchema = z.object({
    username : z.string().min(3, 'Username must be 3 characters or more'),
    password: z.string().min(3, 'Password must be 3 or more characters').trim(),
  });
  return loginValidationSchema.safeParse(data)
};

module.exports.newUserValidation = newUserValidation;
module.exports.userLoginValidation = userLoginValidation;