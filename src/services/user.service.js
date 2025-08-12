import prisma from "../config/db.js";

export const createUser = async (username) => {
    return prisma.user.create({ data: { username } });
};

export const getUsers = async () => {
    return prisma.user.findMany();
};


export const getUserByPhone= async (phone) => {
    return await prisma.user.findMany({
        where: { phone: { contains: phone } }
    });

}
export  const getUserById = async (id) => {

    return await prisma.user.findUnique({
        where: {id: parseInt(id) }
    });

}