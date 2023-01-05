import bcrypt from 'bcrypt';

export const hash = async (password) => {
    const salt = await  bcrypt.genSalt(10);
    console.log({ salt });
   return bcrypt.hashSync(password, salt);
};

export const generateCode = () => {
   return Math.floor(1000 + Math.random() * 9000);
    
};

// export const slug = (str) => str.toLowerCase()
//      .replace(/[^a-z0-9]+/g, '-')
//      .replace(/(^-|-$)+/g, '');

export const slugify = (str) => {
   return str.trim().toLowerCase().replace(/[^\w-]+/g, '-');
}